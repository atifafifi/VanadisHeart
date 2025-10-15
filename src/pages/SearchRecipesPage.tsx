import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import SearchBar from "../components/SearchBar";
import { sampleRecipes } from "../data/sampleRecipes";
import type { Recipe, SearchFilters } from "../types";
import "../styles/searchRecipes.css";

const SearchRecipesPage: React.FC = () => {
  const [recipes] = useState<Recipe[]>(sampleRecipes);
  const [filteredRecipes, setFilteredRecipes] =
    useState<Recipe[]>(sampleRecipes);
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    tags: [],
    difficulty: [],
    prepTime: 0,
    rating: 0,
  });
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    const newFilters = { ...filters, query };
    setFilters(newFilters);
    applyFilters({ ...newFilters });
  };

  const handleFiltersChange = (newFilters: any) => {
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

  const hasActiveFilters = () => {
    return (
      filters.query ||
      filters.tags.length > 0 ||
      filters.difficulty.length > 0 ||
      filters.prepTime > 0 ||
      filters.rating > 0
    );
  };

  return (
    <div className="search-page-container">
      {" "}
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
            <div className="card search-filters-card">
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
                <SearchBar
                  onSearch={handleSearch}
                  placeholder="Search recipes..."
                  showFilters={true}
                  onFiltersChange={handleFiltersChange}
                />
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

            {/* Recipes Grid */}
            {filteredRecipes.length === 0 ? (
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
                  onClick={clearAllFilters}
                  className="btn btn-primary search-empty-button"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchRecipesPage;
