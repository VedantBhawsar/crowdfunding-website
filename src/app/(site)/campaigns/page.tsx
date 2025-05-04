'use client';
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Campaign, CampaignStatus, CampaignCategory } from '@prisma/client'; // Ensure CampaignCategory is imported if used in FilterState
import Link from 'next/link';
// useRouter is not used in this component, can be removed if not needed elsewhere
// import { useRouter } from 'next/navigation';
import { useDebounce } from 'use-debounce';
// AnimatePresence is not used in the provided snippet, can be removed if not needed
// import { AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// Card components are not directly used here, only in CampaignCard, can be removed if not needed elsewhere
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// Progress is not directly used here, only in CampaignCard, can be removed if not needed elsewhere
// import { Progress } from '@/components/ui/progress';
import { Search, Loader2, AlertCircle } from 'lucide-react';
// Badge is not directly used here, only potentially in CampaignCard/FilterModel, can be removed if not needed elsewhere
// import { Badge } from '@/components/ui/badge';
import CampaignFilterModel, { FilterState } from '@/components/campaign/CampaignFilterModel';
// date-fns functions are not used directly here, only potentially in CampaignCard, can be removed if not needed elsewhere
// import { addDays, differenceInDays, isPast } from 'date-fns';
import CampaignCard from '@/components/campaign/CampaignCard';
import { create as createZustand } from 'zustand';

// Interface representing a Campaign with potential backer count
interface CampaignWithCounts extends Campaign {
  _count?: {
    backers: number;
  };
}

// API response structure
interface CampaignsApiResponse {
  data: CampaignWithCounts[];
  hasMore: boolean;
  currentPage: number; // The page number returned by the API
}

// Default filter state
const defaultFilters: FilterState = {
  categories: [], // Ensure FilterState uses CampaignCategory[] if needed
  statuses: [CampaignStatus.ACTIVE],
  sortBy: 'createdAt_desc',
};

const ITEMS_PER_PAGE = 6;

// --- Zustand Store Definition ---
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
  page: number; // Current page *loaded*
  setPage: (page: number) => void;
  resetForNewQuery: () => void; // Helper action to reset state
}

const useStore = createZustand<CampaignStoreState>((set) => ({
  campaigns: [],
  isInitialLoading: true,
  hasMore: true,
  isLoadingMore: false,
  error: null,
  searchTerm: '',
  filters: defaultFilters,
  page: 1,
  setCampaigns: (campaigns) => set({ campaigns }),
  // Correctly appends new campaigns to the existing list
  appendCampaigns: (newCampaigns) =>
    set((state) => ({ campaigns: [...state.campaigns, ...newCampaigns] })),
  setIsInitialLoading: (isLoading) => set({ isInitialLoading: isLoading }),
  setHasMore: (hasMore) => set({ hasMore }),
  setIsLoadingMore: (isLoading) => set({ isLoadingMore: isLoading }),
  setError: (error) => set({ error }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setFilters: (filters) => set({ filters }),
  setPage: (page) => set({ page }),
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

        console.log(`Received page ${result.currentPage}, hasMore: ${result.hasMore}, data count: ${result.data.length}`); // Debug log

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
    [baseQueryParams, storeSetCampaigns, storeAppendCampaigns, setIsInitialLoading, setIsLoadingMore, setError, setHasMore, storeSetPage, isLoadingMore, hasMore, error] // Include dependencies
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
      (entries) => {
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
  };

  // Handler for search input changes
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value); // Update search term in the store
  };

  // --- JSX Rendering ---
  return (
    <div className="container mx-auto py-8 ">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold tracking-tight">Discover Campaigns</h1>
          <p className="text-muted-foreground">Explore amazing projects and back your favorites.</p>
        </div>
        <Link href="/campaign/create">
          <Button>Start a Campaign</Button>
        </Link>
      </div>

      {/* Search and Filter Bar - Sticky */}
      <div className="mb-8 flex flex-col sm:flex-row items-center w-full gap-4 sticky top-0 bg-background py-4 z-10 border-b">
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by title, description, creator..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Search campaigns"
          />
        </div>
        <CampaignFilterModel currentFilters={filters} onApplyFilters={handleApplyFilters} />
      </div>

      {/* Content Area: Loading, Error, No Results, or Campaign Grid */}
      <div className="min-h-[40vh]"> {/* Ensure minimum height */}
        {isInitialLoading ? (
          <div className="flex justify-center items-center h-full pt-16">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : error && campaigns.length === 0 ? ( // Show critical error only if initial load failed
          <div className="text-center py-10 px-4 border border-destructive/50 bg-destructive/10 rounded-lg">
            <AlertCircle className="mx-auto h-10 w-10 text-destructive mb-3" />
            <h2 className="text-xl font-semibold text-destructive mb-2">Failed to load campaigns</h2>
            <p className="text-destructive/80 mb-4">{error}</p>
            <Button variant="destructive" onClick={() => fetchCampaignsForPage(1, true)}>
              Try Again
            </Button>
          </div>
        ) : !isInitialLoading && campaigns.length === 0 ? ( // No results found after initial load
          <div className="text-center py-10 px-4 border border-dashed rounded-lg h-full flex flex-col justify-center items-center">
            <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-muted-foreground">No Campaigns Found</h2>
            <p className="text-muted-foreground/80 mt-2">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
           // Display Campaign Grid
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <CampaignCard campaign={campaign} key={`${campaign.id}-${campaign.createdAt}`} /> // Use a more stable key if possible
              ))}
            </div>

            {/* Loader/End Message for Infinite Scroll */}
            <div ref={loaderRef} className="h-16 flex justify-center items-center mt-8">
              {isLoadingMore && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
              {!isLoadingMore && !hasMore && campaigns.length > 0 && (
                <p className="text-sm text-muted-foreground">You&apos;ve reached the end!</p>
              )}
              {/* Show non-critical error if loading *more* failed */}
              {!isLoadingMore && error && page > 1 && (
                <p className="text-sm text-destructive">Error loading more campaigns. {error}</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CampaignsPage;