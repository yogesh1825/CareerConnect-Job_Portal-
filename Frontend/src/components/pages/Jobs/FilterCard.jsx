import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { setFilterCriteria } from "@/redux/jobSlice";
import { Filter, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";

const filterData = [
  {
    filterType: "Location",
    array: ["Ahmedabad", "Bangalore", "Delhi NCR", "Hyderabad", "Mumbai", "Pune", "Surat","Remote"],
  },
  {
    filterType: "Industry",
    array: ["AI", "Backend Developer", "Data Science", "DevOps", "Frontend Developer", "FullStack Developer", "Machine Learning"],
  },
];

const FilterCard = () => {
  const [filters, setFilters] = useState({
    location: '',
    industry: '',
  });
  const dispatch = useDispatch();
  
  const handleFilterChange = (value, filterType) => {
    setFilters(prev => {
      // If user clicks the same value again, unselect it
      if (prev[filterType.toLowerCase()] === value) {
        return {
          ...prev,
          [filterType.toLowerCase()]: ''
        };
      }
      
      // Otherwise, set the new value
      return {
        ...prev,
        [filterType.toLowerCase()]: value
      };
    });
  };
  
  const clearFilters = () => {
    setFilters({
      location: '',
      industry: '',
    });
  };
  
  // Check if any filter is active
  const hasActiveFilters = Object.values(filters).some(value => value !== '');
  
  useEffect(() => {
    dispatch(setFilterCriteria(filters));
  }, [filters, dispatch]);

  return (
    <div className="sticky top-5 w-full bg-white p-5 rounded-xl shadow-md border border-purple-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-[#6A38C2]" />
          <h1 className="font-bold text-lg text-gray-900">Filter Jobs</h1>
        </div>
        
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="text-[#6A38C2] hover:bg-purple-50 p-2"
          >
            <X size={16} />
          </Button>
        )}
      </div>
      
      <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-200 to-transparent mb-5"></div>
      
      {filterData.map((data, index) => {
        const filterType = data.filterType.toLowerCase();
        
        return (
          <div key={index} className="mb-5">
            <h2 className="font-semibold text-[#6A38C2] mb-2">{data.filterType}</h2>
            <div className="space-y-1 pl-1">
              {data.array.map((item, idx) => {
                const itemId = `filter-${index}-${idx}`;
                const isSelected = filters[filterType] === item;
                
                return (
                  <div 
                    key={itemId} 
                    className={`flex items-center space-x-2 p-1.5 rounded-md transition-colors cursor-pointer ${isSelected ? 'bg-purple-50' : 'hover:bg-gray-50'}`}
                    onClick={() => handleFilterChange(item, data.filterType)}
                  >
                    <div className={`h-4 w-4 rounded-full border ${isSelected ? 'border-[#6A38C2] bg-[#6A38C2]' : 'border-gray-300'} flex items-center justify-center`}>
                      {isSelected && (
                        <div className="h-2 w-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <Label className="cursor-pointer text-gray-700 text-sm">
                      {item}
                    </Label>
                  </div>
                );
              })}
            </div>
            
            {filters[filterType] && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFilterChange('', data.filterType)}
                className="mt-1 text-[#6A38C2] hover:bg-purple-50 text-xs"
              >
                Clear {data?.filterType}
              </Button>
            )}
          </div>
        );
      })}
      
      {hasActiveFilters && (
        <div className="mt-6">
          <Button 
            onClick={clearFilters}
            className="w-full bg-white text-[#6A38C2] hover:bg-purple-50 border border-purple-200"
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default FilterCard;
