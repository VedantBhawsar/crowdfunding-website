import React, { useState, useEffect } from 'react';
import { CampaignStatus } from '@prisma/client'; // Import enums
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Settings2, X } from 'lucide-react';

// Define available categories (consider fetching these if dynamic)
const AVAILABLE_CATEGORIES = [
  'Technology',
  'Art',
  'Music',
  'Film',
  'Games',
  'Food',
  'Publishing',
  'Fashion',
  'Design',
  'Community',
  'Education',
  'Environment',
  'Health',
  'Nonprofit',
  'Social Enterprise',
];

// Define available statuses
const AVAILABLE_STATUSES = Object.values(CampaignStatus);

// Define sort options
const SORT_OPTIONS = [
  { value: 'createdAt_desc', label: 'Newest' },
  { value: 'createdAt_asc', label: 'Oldest' },
  { value: 'goal_asc', label: 'Goal (Low to High)' },
  { value: 'goal_desc', label: 'Goal (High to Low)' },
  { value: 'raisedAmount_desc', label: 'Most Funded' },
  // Add more like 'ending_soon' if implemented in API
];

// Type for the filter state
export interface FilterState {
  categories: string[];
  statuses: CampaignStatus[];
  sortBy: string;
}

interface CampaignFilterModelProps {
  currentFilters: FilterState;
  onApplyFilters: (filters: FilterState) => void;
}

const CampaignFilterModel: React.FC<CampaignFilterModelProps> = ({
  currentFilters,
  onApplyFilters,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(currentFilters.categories);
  const [selectedStatuses, setSelectedStatuses] = useState<CampaignStatus[]>(
    currentFilters.statuses
  );
  const [sortBy, setSortBy] = useState<string>(currentFilters.sortBy);

  // Reset local state when currentFilters prop changes (e.g., if cleared externally)
  useEffect(() => {
    setSelectedCategories(currentFilters.categories);
    setSelectedStatuses(currentFilters.statuses);
    setSortBy(currentFilters.sortBy);
  }, [currentFilters]);

  const handleCategoryChange = (category: string, checked: boolean | 'indeterminate') => {
    setSelectedCategories(prev =>
      checked ? [...prev, category] : prev.filter(c => c !== category)
    );
  };

  const handleStatusChange = (status: CampaignStatus, checked: boolean | 'indeterminate') => {
    setSelectedStatuses(prev => (checked ? [...prev, status] : prev.filter(s => s !== status)));
  };

  const handleApply = () => {
    onApplyFilters({
      categories: selectedCategories,
      statuses: selectedStatuses,
      sortBy: sortBy,
    });
    setIsOpen(false); // Close dialog on apply
  };

  const handleClear = () => {
    // Reset local state to defaults
    setSelectedCategories([]);
    setSelectedStatuses([CampaignStatus.ACTIVE]); // Default to active
    setSortBy('createdAt_desc');
    // Apply the cleared filters immediately
    onApplyFilters({
      categories: [],
      statuses: [CampaignStatus.ACTIVE],
      sortBy: 'createdAt_desc',
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex-shrink-0">
          <Settings2 className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Filter & Sort Campaigns</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        <div className="py-4 grid gap-6 max-h-[60vh] overflow-y-auto pr-2">
          {' '}
          {/* Added scroll */}
          {/* Categories */}
          <div>
            <h3 className="text-sm font-medium mb-2">Categories</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {AVAILABLE_CATEGORIES.map(category => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={checked => handleCategoryChange(category, checked)}
                  />
                  <Label
                    htmlFor={`category-${category}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <Separator />
          {/* Statuses */}
          <div>
            <h3 className="text-sm font-medium mb-2">Status</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {AVAILABLE_STATUSES.map(status => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status}`}
                    checked={selectedStatuses.includes(status)}
                    onCheckedChange={checked => handleStatusChange(status, checked)}
                  />
                  <Label
                    htmlFor={`status-${status}`}
                    className="text-sm font-normal cursor-pointer capitalize"
                  >
                    {status.toLowerCase().replace('_', ' ')}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <Separator />
          {/* Sorting */}
          <div>
            <h3 className="text-sm font-medium mb-2">Sort By</h3>
            <RadioGroup value={sortBy} onValueChange={setSortBy}>
              {SORT_OPTIONS.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`sort-${option.value}`} />
                  <Label
                    htmlFor={`sort-${option.value}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
        <DialogFooter className="mt-4 pt-4 border-t">
          <Button type="button" variant="outline" onClick={handleClear}>
            Clear Filters
          </Button>
          <Button type="button" onClick={handleApply}>
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CampaignFilterModel;
