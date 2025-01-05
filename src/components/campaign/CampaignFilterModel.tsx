import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const FilterButton = ({ 
  label, 
  isActive, 
  children 
}: { 
  label: string; 
  isActive: boolean; 
  children: React.ReactNode;
}) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button 
        variant={isActive ? "secondary" : "outline"} 
        className="h-9 gap-2 px-3"
      >
        {label}
        <ChevronDown className="h-4 w-4" />
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-[240px] p-3" align="start">
      {children}
    </PopoverContent>
  </Popover>
);

const CampaignFilterModel = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("recent");
  const [timeFrame, setTimeFrame] = useState("all");
  const [campaignStatus, setCampaignStatus] = useState("all");
  const [fundingProgress, setFundingProgress] = useState("all");

  const categories = [
    "Education", "Environment", "Health", "Community",
    "Arts & Culture", "Technology", "Social Justice", "Animal Welfare"
  ];

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSortBy("recent");
    setTimeFrame("all");
    setCampaignStatus("all");
    setFundingProgress("all");
  };

  const hasActiveFilters = selectedCategories.length > 0 || 
    sortBy !== "recent" || 
    timeFrame !== "all" || 
    campaignStatus !== "all" || 
    fundingProgress !== "all";

  return (
    <div className="w-full ">
      <div className="flex flex-wrap items-center gap-2">
        {/* Sort Filter */}
        <FilterButton 
          label="Sort" 
          isActive={sortBy !== "recent"}
        >
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="funded">Most Funded</SelectItem>
              <SelectItem value="ending">Ending Soon</SelectItem>
            </SelectContent>
          </Select>
        </FilterButton>

        {/* Time Frame Filter */}
        <FilterButton 
          label="Time" 
          isActive={timeFrame !== "all"}
        >
          <RadioGroup value={timeFrame} onValueChange={setTimeFrame} className="space-y-2">
            {[
              { value: "all", label: "All Time" },
              { value: "today", label: "Today" },
              { value: "week", label: "This Week" },
              { value: "month", label: "This Month" }
            ].map(({ value, label }) => (
              <div key={value} className="flex items-center">
                <RadioGroupItem value={value} id={`time-${value}`} />
                <Label htmlFor={`time-${value}`} className="ml-2 text-sm">
                  {label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </FilterButton>

        {/* Status Filter */}
        <FilterButton 
          label="Status" 
          isActive={campaignStatus !== "all"}
        >
          <RadioGroup value={campaignStatus} onValueChange={setCampaignStatus} className="space-y-2">
            {[
              { value: "all", label: "All Campaigns" },
              { value: "active", label: "Active" },
              { value: "ending", label: "Ending Soon" },
              { value: "completed", label: "Completed" }
            ].map(({ value, label }) => (
              <div key={value} className="flex items-center">
                <RadioGroupItem value={value} id={`status-${value}`} />
                <Label htmlFor={`status-${value}`} className="ml-2 text-sm">
                  {label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </FilterButton>

        {/* Progress Filter */}
        <FilterButton 
          label="Progress" 
          isActive={fundingProgress !== "all"}
        >
          <RadioGroup value={fundingProgress} onValueChange={setFundingProgress} className="space-y-2">
            {[
              { value: "all", label: "All" },
              { value: "75plus", label: "75%+ Funded" },
              { value: "50plus", label: "50%+ Funded" },
              { value: "25plus", label: "25%+ Funded" }
            ].map(({ value, label }) => (
              <div key={value} className="flex items-center">
                <RadioGroupItem value={value} id={`funding-${value}`} />
                <Label htmlFor={`funding-${value}`} className="ml-2 text-sm">
                  {label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </FilterButton>

        {/* Categories Filter */}
        <FilterButton 
          label="Categories" 
          isActive={selectedCategories.length > 0}
        >
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center">
                <Checkbox
                  id={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => toggleCategory(category)}
                />
                <label htmlFor={category} className="ml-2 text-sm">
                  {category}
                </label>
              </div>
            ))}
          </div>
        </FilterButton>

        {/* Active Filters */}
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            onClick={resetFilters}
            className="h-9 px-3 text-muted-foreground"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selectedCategories.map((category) => (
            <Badge 
              key={category}
              variant="secondary" 
              className="text-xs"
              onClick={() => toggleCategory(category)}
            >
              {category}
              <X className="ml-1 h-3 w-3" />
            </Badge>
          ))}
          {sortBy !== "recent" && (
            <Badge variant="secondary" className="text-xs">
              Sort: {sortBy}
              <X className="ml-1 h-3 w-3" onClick={() => setSortBy("recent")} />
            </Badge>
          )}
          {timeFrame !== "all" && (
            <Badge variant="secondary" className="text-xs">
              Time: {timeFrame}
              <X className="ml-1 h-3 w-3" onClick={() => setTimeFrame("all")} />
            </Badge>
          )}
          {campaignStatus !== "all" && (
            <Badge variant="secondary" className="text-xs">
              Status: {campaignStatus}
              <X className="ml-1 h-3 w-3" onClick={() => setCampaignStatus("all")} />
            </Badge>
          )}
          {fundingProgress !== "all" && (
            <Badge variant="secondary" className="text-xs">
              Progress: {fundingProgress}
              <X className="ml-1 h-3 w-3" onClick={() => setFundingProgress("all")} />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default CampaignFilterModel;