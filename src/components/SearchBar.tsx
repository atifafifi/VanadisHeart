import React, { useState } from "react";
// import '../styles/searchBar.css';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  showFilters?: boolean;
  onFiltersChange?: (filters: any) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search recipes...",
  className = "",
  showFilters = false,
  onFiltersChange,
}) => {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({
    tags: [] as string[],
    difficulty: [] as string[],
    maxPrepTime: 0,
    minRating: 0,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleFilterChange = (filterType: string, value: any) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };

  const availableTags = [
    "Italian",
    "Pasta",
    "Quick",
    "Comfort Food",
    "Seafood",
    "Healthy",
    "Asian-inspired",
    "Gluten-free",
    "Dessert",
    "Chocolate",
    "Baking",
    "Special Occasion",
  ];
  const difficultyLevels = ["Easy", "Medium", "Hard"];

  return (
    <div className={`w-full ${className}`}>
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="form-input pl-10 pr-4 py-3 w-full"
          />
          <button
            type="submit"
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-primary-pastel-50 rounded-r-md transition-colors"
          ></button>
        </div>
      </form>

      {showFilters && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Filters</h4>

          {/* Tags Filter */}
          <div className="mb-4">
            <label className="form-label">Tags</label>
            <div className="recommended-tags flex gap-2">
              {availableTags.map((tag) => {
                // Determine if the current tag is active
                const isActive = filters.tags.includes(tag);

                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      const newTags = isActive
                        ? filters.tags.filter((t) => t !== tag)
                        : [...filters.tags, tag];
                      handleFilterChange("tags", newTags);
                    }}
                    // The class only needs the base class and the conditional modifier
                    className={`tags-button ${isActive ? "is-active" : ""}`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div className="mb-4">
            <label className="form-label">Difficulty</label>
            <div className="recommended-tags flex gap-2">
              {difficultyLevels.map((level) => {
                // Determine the active state for cleaner JSX logic
                const isActive = filters.difficulty.includes(level);

                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => {
                      // Toggle the level in the filters array
                      const newDifficulty = isActive
                        ? filters.difficulty.filter((d) => d !== level) // Deselect
                        : [...filters.difficulty, level]; // Select
                      handleFilterChange("difficulty", newDifficulty);
                    }}
                    // Apply the base class and the conditional active class
                    className={`difficulty-button ${
                      isActive ? "is-active" : ""
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prep Time Filter */}
          <div className="mb-4">
            <label className="form-label">Maximum Prep Time (minutes)</label>
            <input
              type="range"
              min="0"
              max="120"
              step="15"
              value={filters.maxPrepTime}
              onChange={(e) =>
                handleFilterChange("maxPrepTime", parseInt(e.target.value))
              }
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0 min</span>
              <span>{filters.maxPrepTime} min</span>
              <span>120 min</span>
            </div>
          </div>

          {/* Rating Filter */}
          <div className="mb-4">
            <label className="form-label">Minimum Rating</label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={filters.minRating}
              onChange={(e) =>
                handleFilterChange("minRating", parseFloat(e.target.value))
              }
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0 stars</span>
              <span>{filters.minRating} stars</span>
              <span>5 stars</span>
            </div>
          </div>

          {/* Clear Filters */}
          <button
            type="button"
            onClick={() => {
              const clearedFilters = {
                tags: [],
                difficulty: [],
                maxPrepTime: 0,
                minRating: 0,
              };
              setFilters(clearedFilters);
              if (onFiltersChange) {
                onFiltersChange(clearedFilters);
              }
            }}
            className="btn btn-outline text-sm"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
