'use client';
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Campaign, CampaignStatus, CampaignCategory } from '@prisma/client'; // Ensure CampaignCategory is imported if used in FilterState
import Link from 'next/link';
import { useDebounce } from 'use-debounce';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  Loader2,
  AlertCircle,
  Filter,
  Plus,
  Sparkles,
  FileText,
  RefreshCw,
} from 'lucide-react';
import CampaignFilterModel, { FilterState } from '@/components/campaign/CampaignFilterModel';
import CampaignCard from '@/components/campaign/CampaignCard';
import { create as createZustand } from 'zustand';
import { motion, AnimatePresence } from 'framer-motion';

interface CampaignWithCounts extends Campaign {
  _count?: {
    backers: number;
  };
}

// API response structure
interface CampaignsApiResponse {
  data: CampaignWithCounts[];
  hasMore: boolean;
  currentPage: number;
}

// Default filter state
const defaultFilters: FilterState = {
  categories: [],
  statuses: [CampaignStatus.ACTIVE],
  sortBy: 'createdAt_desc',
};

const ITEMS_PER_PAGE = 6;

interface CampaignStoreState {
  campaigns: CampaignWithCounts[];
  setCampaigns: (campaigns: CampaignWithCounts[]) => void;
  appendCampaigns: (newCampaigns: CampaignWithCounts[]) => void; // Renamed and corrected
  isInitialLoading: boolean;
  setIsInitialLoading: (isLoading: boolean) => void;
  hasMore: boolean;
  setHasMore: (hasMore: boolean) => void;
  isLoadingMore: boolean;
  setIsLoadingMore: (isLoading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  page: number;
  setPage: (page: number) => void;
  resetForNewQuery: () => void;
}

const useStore = createZustand<CampaignStoreState>(set => ({
  campaigns: [],
  isInitialLoading: true,
  hasMore: true,
  isLoadingMore: false,
  error: null,
  searchTerm: '',
  filters: defaultFilters,
  page: 1,
  setCampaigns: campaigns => set({ campaigns }),
  // Correctly appends new campaigns to the existing list
  appendCampaigns: newCampaigns =>
    set(state => ({ campaigns: [...state.campaigns, ...newCampaigns] })),
  setIsInitialLoading: isLoading => set({ isInitialLoading: isLoading }),
  setHasMore: hasMore => set({ hasMore }),
  setIsLoadingMore: isLoading => set({ isLoadingMore: isLoading }),
  setError: error => set({ error }),
  setSearchTerm: term => set({ searchTerm: term }),
  setFilters: filters => set({ filters }),
  setPage: page => set({ page }),
  resetForNewQuery: () => set({ campaigns: [], page: 1, hasMore: true, error: null }),
}));
// --- End of Zustand Store Definition ---

const CampaignsPage = () => {
  // Destructure state and actions from the Zustand store
  const {
    campaigns,
    isInitialLoading,
    isLoadingMore,
    error,
    searchTerm,
    filters,
    page,
    hasMore,
    setCampaigns: storeSetCampaigns, // Renamed for clarity
    appendCampaigns: storeAppendCampaigns, // Renamed for clarity
    setIsInitialLoading,
    setIsLoadingMore,
    setError,
    setSearchTerm,
    setFilters,
    setPage: storeSetPage, // Renamed for clarity
    setHasMore,
    resetForNewQuery,
  } = useStore();

  const [isFilterModelOpen, setIsFilterModelOpen] = useState(false);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const loaderRef = useRef<HTMLDivElement | null>(null); // For IntersectionObserver

  // Memoize base query parameters based on debounced search and filters
  const baseQueryParams = useMemo(() => {
    const params = new URLSearchParams();
    if (debouncedSearchTerm) params.set('search', debouncedSearchTerm);
    if (filters.categories.length > 0) params.set('categories', filters.categories.join(','));
    if (filters.statuses.length > 0) params.set('statuses', filters.statuses.join(','));
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    params.set('limit', String(ITEMS_PER_PAGE));
    return params.toString(); // Convert to string only once here
  }, [debouncedSearchTerm, filters.categories, filters.statuses, filters.sortBy]);

  // Function to fetch campaigns for a specific page
  const fetchCampaignsForPage = useCallback(
    async (pageNum: number, isInitialLoad = false) => {
      if (isInitialLoad) {
        setIsInitialLoading(true);
      } else {
        // Avoid fetching more if already loading or no more data
        if (isLoadingMore || !hasMore) return;
        setIsLoadingMore(true);
      }
      // Clear previous errors when starting a new fetch
      if (error) setError(null);

      const params = new URLSearchParams(baseQueryParams);
      params.set('page', String(pageNum));

      console.log(`Fetching page ${pageNum} with params: ${params.toString()}`); // Debug log

      try {
        const response = await fetch(`/api/campaigns?${params.toString()}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({})); // Try to parse error
          throw new Error(errorData.error || `Failed to fetch campaigns (${response.status})`);
        }
        const result: CampaignsApiResponse = await response.json();

        console.log(
          `Received page ${result.currentPage}, hasMore: ${result.hasMore}, data count: ${result.data.length}`
        ); // Debug log

        // Update state using Zustand actions
        if (pageNum === 1) {
          storeSetCampaigns(result.data); // Replace campaigns on first page load/reset
        } else {
          storeAppendCampaigns(result.data); // Append campaigns for subsequent pages
        }
        setHasMore(result.hasMore);
        storeSetPage(pageNum); // Update the current page number in the store
      } catch (err) {
        console.error('Error fetching campaigns:', err);
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(errorMessage);
        // If initial load fails, ensure campaigns are empty
        if (isInitialLoad) {
          storeSetCampaigns([]);
          setHasMore(false); // Stop trying to load more if initial fails
        }
        // Don't automatically clear campaigns on subsequent load errors
      } finally {
        if (isInitialLoad) {
          setIsInitialLoading(false);
        } else {
          setIsLoadingMore(false);
        }
      }
    },
    [
      baseQueryParams,
      storeSetCampaigns,
      storeAppendCampaigns,
      setIsInitialLoading,
      setIsLoadingMore,
      setError,
      setHasMore,
      storeSetPage,
      isLoadingMore,
      hasMore,
      error,
    ] // Include dependencies
  );

  // Effect to fetch initial data or refetch when filters/search change
  useEffect(() => {
    console.log('Filters or search term changed, resetting and fetching page 1.'); // Debug log
    resetForNewQuery(); // Reset campaigns, page, hasMore, error in store
    fetchCampaignsForPage(1, true); // Fetch page 1 as initial load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseQueryParams]); // Dependency: only refetch when base query params change

  // Effect for infinite scrolling using IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const target = entries[0];
        // Trigger fetch only if intersecting, there's more data, and not already loading
        if (target.isIntersecting && hasMore && !isLoadingMore && !isInitialLoading) {
          console.log('Loader intersecting, loading next page...'); // Debug log
          fetchCampaignsForPage(page + 1); // Fetch the *next* page
        }
      },
      {
        root: null, // Use the viewport as the root
        rootMargin: '0px', // No margin
        threshold: 1.0, // Trigger when the loader is fully visible
      }
    );

    const currentLoaderRef = loaderRef.current;
    if (currentLoaderRef) {
      observer.observe(currentLoaderRef);
    }

    // Cleanup function to unobserve
    return () => {
      if (currentLoaderRef) {
        observer.unobserve(currentLoaderRef);
      }
    };
  }, [hasMore, isLoadingMore, isInitialLoading, page, fetchCampaignsForPage]); // Dependencies for the observer effect

  // Handler for applying filters from the modal
  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters); // Update filters in the store, triggering the effect above
    setIsFilterModelOpen(false);
  };

  // Handler for search input changes
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value); // Update search term in the store
  };

  const totalActiveFilters = (filters.categories.length || 0) + (filters.statuses.length || 0);

  // --- JSX Rendering ---
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50/80 pt-16">
      {/* Page header with gradient background */}
      <div className="relative overflow-hidden bg-gradient-to-r from-teal-700 via-teal-600 to-teal-700">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* Decorative patterns */}
        <div className="absolute top-5 right-5 opacity-20 hidden lg:block">
          <svg
            width="80"
            height="80"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="20" cy="20" r="8" fill="rgba(255, 255, 255, 0.2)" />
            <circle cx="60" cy="20" r="8" fill="rgba(255, 255, 255, 0.2)" />
            <circle cx="100" cy="20" r="8" fill="rgba(255, 255, 255, 0.2)" />
            <circle cx="20" cy="60" r="8" fill="rgba(255, 255, 255, 0.2)" />
            <circle cx="60" cy="60" r="8" fill="rgba(255, 255, 255, 0.2)" />
            <circle cx="100" cy="60" r="8" fill="rgba(255, 255, 255, 0.2)" />
            <circle cx="20" cy="100" r="8" fill="rgba(255, 255, 255, 0.2)" />
            <circle cx="60" cy="100" r="8" fill="rgba(255, 255, 255, 0.2)" />
            <circle cx="100" cy="100" r="8" fill="rgba(255, 255, 255, 0.2)" />
          </svg>
        </div>

        <div className="container max-w-7xl mx-auto px-4 py-12 sm:py-14 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
          >
            <div className="flex flex-col">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-3"
              >
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium border border-white/25 backdrop-blur-sm">
                  <span className="flex h-4 w-4 items-center justify-center">
                    <span className="absolute h-2.5 w-2.5 animate-ping rounded-full bg-white opacity-75"></span>
                    <span className="relative rounded-full h-1.5 w-1.5 bg-white"></span>
                  </span>
                  Discover Projects
                </span>
              </motion.div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">
                Discover Campaigns
              </h1>
              <p className="text-teal-100 max-w-2xl">
                Explore innovative projects seeking funding or start your own campaign today.
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link href="/campaign/create">
                <Button
                  size="lg"
                  className="bg-white text-teal-700 hover:text-teal-800 hover:bg-white/95 shadow-md"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Campaign
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-8 sm:py-12">
        {/* Search and Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 sm:mb-10 bg-white p-4 sm:p-6 rounded-xl shadow-md border border-slate-100"
        >
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <Input
                type="search"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 h-11 border-slate-200 focus:border-teal-500 shadow-sm"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setIsFilterModelOpen(true)}
              className="sm:w-auto h-11 bg-slate-50 border-slate-200 hover:bg-slate-100 flex gap-2 items-center"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {totalActiveFilters > 0 && (
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 text-xs font-medium text-teal-600">
                  {totalActiveFilters}
                </span>
              )}
            </Button>
          </div>

          {/* Active Filters Summary */}
          {(filters.categories.length > 0 ||
            filters.statuses.length !== 1 ||
            filters.statuses[0] !== CampaignStatus.ACTIVE) && (
            <div className="mt-4 flex flex-wrap gap-2 items-center text-sm text-slate-600">
              <span className="font-medium">Active filters:</span>
              {filters.categories.length > 0 && (
                <span className="px-2 py-1 rounded-md bg-teal-50 text-teal-700 border border-teal-100">
                  {filters.categories.length === 1
                    ? filters.categories[0].toLowerCase().replace('_', ' ')
                    : `${filters.categories.length} categories`}
                </span>
              )}
              {(filters.statuses.length !== 1 || filters.statuses[0] !== CampaignStatus.ACTIVE) && (
                <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                  {filters.statuses.length === 1
                    ? filters.statuses[0].toLowerCase().replace('_', ' ')
                    : `${filters.statuses.length} statuses`}
                </span>
              )}
              <button
                onClick={() => setFilters(defaultFilters)}
                className="text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
              >
                <RefreshCw className="h-3 w-3" />
                Reset
              </button>
            </div>
          )}
        </motion.div>

        {/* Campaign Grid */}
        <div className="relative min-h-[200px]">
          {/* Loading indicator for initial load */}
          <AnimatePresence>
            {isInitialLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10 rounded-xl"
              >
                <Loader2 className="h-8 w-8 text-teal-600 animate-spin mb-3" />
                <p className="text-slate-600 font-medium">Loading campaigns...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error display */}
          {error && !isInitialLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 sm:p-6 rounded-xl bg-red-50 border border-red-200 mb-6 flex items-start gap-3"
            >
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-800 mb-1">Error loading campaigns</h3>
                <p className="text-sm text-red-700">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    resetForNewQuery();
                    fetchCampaignsForPage(1, true);
                  }}
                  className="mt-3 bg-white hover:bg-red-50 border-red-200 text-red-700"
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                  Try again
                </Button>
              </div>
            </motion.div>
          )}

          {/* Empty state */}
          {!isInitialLoading && !error && campaigns.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 sm:p-10 rounded-xl bg-slate-50 border border-slate-200 text-center flex flex-col items-center justify-center"
            >
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">No Campaigns Found</h3>
              <p className="text-slate-600 max-w-md mb-6">
                {searchTerm || totalActiveFilters > 0
                  ? "We couldn't find any campaigns matching your filters. Try adjusting your search criteria."
                  : 'There are no campaigns available at the moment. Be the first to create one!'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                {(searchTerm || totalActiveFilters > 0) && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm('');
                      setFilters(defaultFilters);
                    }}
                    className="border-slate-300"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset Filters
                  </Button>
                )}
                <Link href="/campaign/create">
                  <Button className="bg-teal-600 hover:bg-teal-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Campaign
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}

          {/* Campaign grid */}
          {!isInitialLoading && !error && campaigns.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {campaigns.map((campaign, index) => (
                  <motion.div
                    key={campaign.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: Math.min(0.1 + index * 0.05, 0.5), // cap the delay for large numbers of items
                      ease: 'easeOut',
                    }}
                  >
                    <CampaignCard campaign={campaign} />
                  </motion.div>
                ))}
              </div>

              {/* Loader for infinite scrolling */}
              {hasMore && (
                <div ref={loaderRef} className="flex justify-center py-8">
                  {isLoadingMore ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-6 w-6 text-teal-600 animate-spin mb-2" />
                      <p className="text-sm text-slate-500">Loading more campaigns...</p>
                    </div>
                  ) : (
                    <div className="h-16 flex items-center justify-center">
                      <span className="text-sm text-slate-400">Scroll for more</span>
                    </div>
                  )}
                </div>
              )}

              {/* End of results message */}
              {!hasMore && campaigns.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 text-sm text-slate-500"
                >
                  <div className="w-12 h-12 mx-auto rounded-full bg-teal-50 flex items-center justify-center mb-3">
                    <Sparkles className="h-6 w-6 text-teal-400" />
                  </div>
                  <p>You&apos;ve reached the end of the list</p>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Campaign Filter Modal */}
      <CampaignFilterModel
        isOpen={isFilterModelOpen}
        onClose={() => setIsFilterModelOpen(false)}
        currentFilters={filters}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};

export default CampaignsPage;
