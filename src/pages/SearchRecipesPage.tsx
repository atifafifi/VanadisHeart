import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import SearchBar from "../components/SearchBar";
import { fetchRecipes } from "../services/recipeApi";
import type { Recipe, SearchFilters } from "../types";
import "../styles/searchRecipes.css";

const SearchRecipesPage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    tags: [],
    difficulty: [],
    prepTime: 0,
    rating: 0,
  });
  const navigate = useNavigate();

  // Add available tags array
  const availableTags = [
    "Italian",
    "Asian",
    "Quick",
    "Comfort Food",
    "Seafood",
    "Healthy",
    "Gluten Free",
    "Dessert",
    "Chocolate",
    "Baking",
    "Special Occasion",
  ];

  useEffect(() => {
    const loadInitialRecipes = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const initialRecipes = await fetchRecipes();
        setRecipes(initialRecipes);
        setFilteredRecipes(initialRecipes);
      } catch (err) {
        setError("Failed to load recipes");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialRecipes();
  }, []);

  const handleSearch = async (query: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const searchResults = await fetchRecipes(query);
      setRecipes(searchResults);
      setFilteredRecipes(searchResults);
      setFilters({ ...filters, query });
    } catch (err) {
      setError("Failed to search recipes");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    applyFilters(updatedFilters);
  };

  const applyFilters = (currentFilters: SearchFilters) => {
    let filtered = [...recipes];

    if (currentFilters.query) {
      filtered = filtered.filter(
        (recipe) =>
          recipe.name
            .toLowerCase()
            .includes(currentFilters.query.toLowerCase()) ||
          recipe.description
            .toLowerCase()
            .includes(currentFilters.query.toLowerCase()) ||
          recipe.tags.some((tag) =>
            tag.toLowerCase().includes(currentFilters.query.toLowerCase())
          ) ||
          recipe.ingredients.some((ingredient) =>
            ingredient
              .toLowerCase()
              .includes(currentFilters.query.toLowerCase())
          )
      );
    }

    if (currentFilters.tags && currentFilters.tags.length > 0) {
      filtered = filtered.filter((recipe) =>
        currentFilters.tags.some((tag) => recipe.tags.includes(tag))
      );
    }

    if (currentFilters.difficulty && currentFilters.difficulty.length > 0) {
      filtered = filtered.filter((recipe) =>
        currentFilters.difficulty.includes(recipe.difficulty)
      );
    }

    if (currentFilters.prepTime > 0) {
      filtered = filtered.filter(
        (recipe) => recipe.prepTime + recipe.cookTime <= currentFilters.prepTime
      );
    }

    if (currentFilters.rating > 0) {
      filtered = filtered.filter(
        (recipe) => recipe.rating >= currentFilters.rating
      );
    }

    setFilteredRecipes(filtered);
  };

  const handleRecipeClick = (recipeId: string) => {
    navigate(`/recipe/${recipeId}`);
  };

  const clearAllFilters = () => {
    const clearedFilters: SearchFilters = {
      query: "",
      tags: [],
      difficulty: [],
      prepTime: 0,
      rating: 0,
    };
    setFilters(clearedFilters);
    setFilteredRecipes(recipes);
  };

  const resetToInitialRecipes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const initialRecipes = await fetchRecipes();
      setRecipes(initialRecipes);
      setFilteredRecipes(initialRecipes);
      clearAllFilters();
    } catch (err) {
      setError("Failed to load recipes");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const hasActiveFilters = () => {
    return (
      filters.query ||
      filters.tags.length > 0 ||
      filters.difficulty.length > 0 ||
      filters.prepTime > 0 ||
      filters.rating > 0
    );
  };

  // Add toggle functions
  const toggleTag = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag];
    handleFiltersChange({ tags: newTags });
  };

  const toggleDifficulty = (difficulty: string) => {
    const newDifficulty = filters.difficulty.includes(difficulty)
      ? filters.difficulty.filter((d) => d !== difficulty)
      : [...filters.difficulty, difficulty];
    handleFiltersChange({ difficulty: newDifficulty });
  };

  return (
    <div className="search-page-container">
      {/* Header */}
      <div className="search-page-header">
        <div className="search-header-content">
          <div className="search-header-flex">
            <div className="search-header-title-section">
              <h1>Search Recipes</h1>
              <p>Find the perfect recipe with advanced filters</p>
            </div>
            <button
              onClick={() => navigate("/recommended")}
              className="btn btn-outline search-back-button"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Recommended
            </button>
          </div>
        </div>
      </div>
      <div className="container search-content-container">
        <div className="search-grid-layout">
          {/* Filters Sidebar */}
          <div className="search-filters-sidebar">
            <div className="search-filters-card">
              <div className="search-filters-header">
                <h2>Filters</h2>
                {hasActiveFilters() && (
                  <button
                    onClick={clearAllFilters}
                    className="search-clear-filters-button"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <div className="search-filters-body">
                {/* Search Input */}
                <div className="filter-section">
                  <label className="filter-section-title">Search</label>
                  <SearchBar
                    onSearch={handleSearch}
                    placeholder="Search recipes..."
                    showFilters={false}
                  />
                </div>

                {/* Tags Filter */}
                <div className="filter-section">
                  <label className="filter-section-title">Tags</label>
                  <div className="filter-tags">
                    {availableTags.map((tag) => (
                      <button
                        key={tag}
                        className={`filter-tag ${
                          filters.tags.includes(tag) ? "active" : ""
                        }`}
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty Filter */}
                <div className="filter-section">
                  <label className="filter-section-title">Difficulty</label>
                  <div className="filter-tags">
                    {["Easy", "Medium", "Hard"].map((diff) => (
                      <button
                        key={diff}
                        className={`filter-tag ${
                          filters.difficulty.includes(diff) ? "active" : ""
                        }`}
                        onClick={() => toggleDifficulty(diff)}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Prep Time Slider */}
                <div className="filter-section">
                  <div className="filter-slider-header">
                    <label className="filter-section-title">Max Prep Time</label>
                    <span className="filter-slider-value">
                      {filters.prepTime || "Any"} min
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="120"
                    step="15"
                    value={filters.prepTime}
                    onChange={(e) =>
                      handleFiltersChange({
                        prepTime: Number(e.target.value),
                      })
                    }
                    className="filter-slider"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="search-results-section">
            {/* Results Header */}
            <div className="search-results-header">
              <div className="search-results-title-section">
                <h2>
                  {filteredRecipes.length} Recipe
                  {filteredRecipes.length !== 1 ? "s" : ""} Found
                </h2>
                {hasActiveFilters() && (
                  <p className="search-results-subtitle">
                    Filtered from {recipes.length} total recipes
                  </p>
                )}
              </div>

              {/* Sort Options */}
              <div className="search-sort-container">
                <label className="search-sort-label">Sort by:</label>
                <select className="search-sort-select">
                  <option value="relevance">Relevance</option>
                  <option value="rating">Rating</option>
                  <option value="prep-time">Prep Time</option>
                  <option value="name">Name</option>
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters() && (
              <div className="search-active-filters">
                <div className="search-filter-pills">
                  {filters.query && (
                    <span className="search-filter-pill">
                      Search: "{filters.query}"
                      <button
                        onClick={() => handleSearch("")}
                        className="search-filter-pill-remove"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {filters.tags.map((tag, index) => (
                    <span key={index} className="search-filter-pill">
                      Tag: {tag}
                      <button
                        onClick={() => {
                          const newTags = filters.tags.filter((t) => t !== tag);
                          handleFiltersChange({ tags: newTags });
                        }}
                        className="search-filter-pill-remove"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {filters.difficulty.map((diff, index) => (
                    <span key={index} className="search-filter-pill">
                      Difficulty: {diff}
                      <button
                        onClick={() => {
                          const newDifficulty = filters.difficulty.filter(
                            (d) => d !== diff
                          );
                          handleFiltersChange({ difficulty: newDifficulty });
                        }}
                        className="search-filter-pill-remove"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {filters.prepTime > 0 && (
                    <span className="search-filter-pill">
                      Max Time: {filters.prepTime}m
                      <button
                        onClick={() => handleFiltersChange({ prepTime: 0 })}
                        className="search-filter-pill-remove"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {filters.rating > 0 && (
                    <span className="search-filter-pill">
                      Min Rating: {filters.rating}★
                      <button
                        onClick={() => handleFiltersChange({ rating: 0 })}
                        className="search-filter-pill-remove"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="search-loading">
                <div className="search-loading-spinner"></div>
                <p>Loading recipes...</p>
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <div className="search-empty-state">
                <div className="search-empty-icon-wrapper">
                  <svg
                    className="search-empty-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <h3>Error Loading Recipes</h3>
                <p>{error}</p>
                <button
                  onClick={resetToInitialRecipes}
                  className="btn btn-primary search-empty-button"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Recipes Grid */}
            {!isLoading && !error && filteredRecipes.length === 0 ? (
              <div className="search-empty-state">
                <div className="search-empty-icon-wrapper">
                  <svg
                    className="search-empty-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3>No recipes found</h3>
                <p>Try adjusting your search criteria or filters</p>
                <button
                  onClick={resetToInitialRecipes}
                  className="btn btn-primary search-empty-button"
                >
                  Load Recipes
                </button>
              </div>
            ) : (
              !isLoading &&
              !error && (
                <div className="search-recipes-grid">
                  {filteredRecipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      onClick={() => handleRecipeClick(recipe.id)}
                      className="search-recipe-card"
                    />
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchRecipesPage;
