'use client';
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Campaign, CampaignStatus } from '@prisma/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDebounce } from 'use-debounce';
import { AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import CampaignFilterModel, { FilterState } from '@/components/campaign/CampaignFilterModel';
import { addDays, differenceInDays, isPast } from 'date-fns';
import CampaignCard from '@/components/campaign/CampaignCard';
import { create as createZustand } from 'zustand';

interface CampaignWithCounts extends Campaign {
  _count?: {
    backers: number;
  };
}

// Define the structure of the API response
interface CampaignsApiResponse {
  data: CampaignWithCounts[];
  hasMore: boolean;
  currentPage: number;
}

// Default filters
const defaultFilters: FilterState = {
  categories: [],
  statuses: [CampaignStatus.ACTIVE],
  sortBy: 'createdAt_desc',
};

const ITEMS_PER_PAGE = 6;

const useStore = createZustand<{
  campaigns: CampaignWithCounts[];
  setCampaigns: (campaigns: CampaignWithCounts[]) => void;
  addCampaigns: (campaigns: CampaignWithCounts[]) => void;
  isInitialLoading: boolean;
  setIsInitialLoading: (isInitialLoading: boolean) => void;
  hasMore: boolean;
  setHasMore: (hasMore: boolean) => void;
  isLoadingMore: boolean;
  setIsLoadingMore: (isLoadingMore: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  page: number;
  setPage: (page: number) => void;
}>(set => ({
  campaigns: [],
  isInitialLoading: true,
  setIsInitialLoading: (isInitialLoading: boolean) => set({ isInitialLoading }),
  hasMore: true,
  setHasMore: (hasMore: boolean) => set({ hasMore }),
  isLoadingMore: false,
  setIsLoadingMore: (isLoadingMore: boolean) => set({ isLoadingMore }),
  error: null,
  setError: (error: string | null) => set({ error }),
  searchTerm: '',
  setSearchTerm: (searchTerm: string) => set({ searchTerm }),
  filters: defaultFilters,
  setFilters: (filters: FilterState) => set({ filters }),
  page: 1,
  setPage: (page: number) => set({ page }),
  addCampaigns: (data: CampaignWithCounts[]) => {
    return set({ campaigns: data })
  },
  setCampaigns: (campaigns: CampaignWithCounts[]) => set({ campaigns }),
}));

const CampaignsPage = () => {
  const router = useRouter();
  const {
    addCampaigns,
    setPage,
    setHasMore,
    setIsInitialLoading,
    setIsLoadingMore,
    setError,
    setSearchTerm,
    setFilters,
    isInitialLoading,
    isLoadingMore,
    error,
    searchTerm,
    filters,
    page,
    hasMore,
  } = useStore();
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [campaigns, setCampaigns] = useState<CampaignWithCounts[]>([]);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const baseQueryParams = useMemo(() => {
    const params = new URLSearchParams();
    if (debouncedSearchTerm) params.set('search', debouncedSearchTerm);
    if (filters.categories.length > 0) params.set('categories', filters.categories.join(','));
    if (filters.statuses.length > 0) params.set('statuses', filters.statuses.join(','));
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    params.set('limit', String(ITEMS_PER_PAGE));
    return params.toString();
  }, [debouncedSearchTerm, filters]);

  const fetchCampaignsForPage = useCallback(
    async (pageNum: number, isInitialLoad = false) => {
      if (!isInitialLoad) setIsLoadingMore(true);
      else setIsInitialLoading(true);
      setError(null);

      const params = new URLSearchParams(baseQueryParams);
      params.set('page', String(pageNum));

      try {
        const response = await fetch(`/api/campaigns?${params.toString()}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to fetch campaigns (${response.status})`);
        }
        const result: CampaignsApiResponse = await response.json();
        setHasMore(result.hasMore);
        setPage(pageNum);
        setCampaigns(prev => pageNum === 1 ? result.data : prev.concat(result.data))
      } catch (err) {
        console.error('Error fetching campaigns:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        if (isInitialLoad) setCampaigns([]);
      } finally {
        if (!isInitialLoad) setIsLoadingMore(false);
        else setIsInitialLoading(false);
      }
    },
    [baseQueryParams]
  );

  useEffect(() => {
    setCampaigns([]);
    setPage(1);
    setHasMore(true);
    fetchCampaignsForPage(1, true);
  }, [fetchCampaignsForPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isLoadingMore && !isInitialLoading) {
          console.log('Loader intersecting, loading more...');
          fetchCampaignsForPage(page + 1);
        }
      },
      {
        root: null, rootMargin: '0px', threshold: 1.0,
      });
    const currentLoaderRef = loaderRef.current;
    if (currentLoaderRef) {
      observer.observe(currentLoaderRef);
    }

    return () => {
      if (currentLoaderRef) {
        observer.unobserve(currentLoaderRef);
      }
    };
  }, [hasMore, isLoadingMore, isInitialLoading, page, fetchCampaignsForPage]);

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="container mx-auto py-8 ">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold tracking-tight">Discover Campaigns</h1>
          <p className="text-muted-foreground">Discover your all campaign</p>
        </div>

        <Link href="/campaign/create">
          <Button>Start a Campaign</Button>
        </Link>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-8 flex flex-col sm:flex-row items-center w-full gap-4 sticky top-0 bg-background py-4 z-10 border-b">
        {' '}
        {/* Make sticky */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by title, description, creator..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <CampaignFilterModel currentFilters={filters} onApplyFilters={handleApplyFilters} />
      </div>

      {/* Campaign Grid / Results */}
      {isInitialLoading ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-10 px-4 border border-destructive/50 bg-destructive/10 rounded-lg">
          <AlertCircle className="mx-auto h-10 w-10 text-destructive mb-3" />
          <h2 className="text-xl font-semibold text-destructive mb-2">Failed to load campaigns</h2>
          <p className="text-destructive/80 mb-4">{error}</p>
          <Button variant="destructive" onClick={() => fetchCampaignsForPage(1, true)}>
            Try Again
          </Button>{' '}
          {/* Allow retry */}
        </div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-10 px-4 border border-dashed rounded-lg min-h-[40vh] flex flex-col justify-center items-center">
          <h2 className="text-xl font-semibold text-muted-foreground">No Campaigns Found</h2>
          <p className="text-muted-foreground/80 mt-2">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map(campaign => (
              <CampaignCard campaign={campaign} key={`${campaign.id}-${page}`} />
            ))}
          </div>

          <div ref={loaderRef} className="h-10 flex justify-center items-center mt-8">
            {isLoadingMore && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
            {!isLoadingMore && !hasMore && campaigns.length > 0 && (
              <p className="text-sm text-muted-foreground">You&apos;ve reached the end!</p>
            )}
            {!isLoadingMore &&
              error &&
              page > 1 && ( // Show error for subsequent loads
                <p className="text-sm text-destructive">Failed to load more campaigns.</p>
              )}
          </div>
        </>
      )}
    </div>
  );
};

export default CampaignsPage;
