import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import SearchBar from "../components/SearchBar";
import { sampleRecipes } from "../data/sampleRecipes";
import type { Recipe } from "../types";
import "../styles/recommended.css";

const RecommendedRecipesPage: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [recipes, setRecipes] = useState<Recipe[]>(sampleRecipes);
  const [filteredRecipes, setFilteredRecipes] =
    useState<Recipe[]>(sampleRecipes);
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredRecipes(recipes);
      return;
    }

    const filtered = recipes.filter(
      (recipe) =>
        recipe.name.toLowerCase().includes(query.toLowerCase()) ||
        recipe.description.toLowerCase().includes(query.toLowerCase()) ||
        recipe.tags.some((tag) =>
          tag.toLowerCase().includes(query.toLowerCase())
        ) ||
        recipe.ingredients.some((ingredient) =>
          ingredient.toLowerCase().includes(query.toLowerCase())
        )
    );

    setFilteredRecipes(filtered);
  };

  const handleFiltersChange = (filters: any) => {
    let filtered = [...recipes];

    // Apply text search
    if (filters.query) {
      filtered = filtered.filter(
        (recipe) =>
          recipe.name.toLowerCase().includes(filters.query.toLowerCase()) ||
          recipe.description
            .toLowerCase()
            .includes(filters.query.toLowerCase()) ||
          recipe.tags.some((tag) =>
            tag.toLowerCase().includes(filters.query.toLowerCase())
          )
      );
    }

    // Apply tag filters
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter((recipe) =>
        filters.tags.some((tag: string) => recipe.tags.includes(tag))
      );
    }

    // Apply difficulty filters
    if (filters.difficulty && filters.difficulty.length > 0) {
      filtered = filtered.filter((recipe) =>
        filters.difficulty.includes(recipe.difficulty)
      );
    }

    // Apply prep time filter
    if (filters.maxPrepTime > 0) {
      filtered = filtered.filter(
        (recipe) => recipe.prepTime + recipe.cookTime <= filters.maxPrepTime
      );
    }

    // Apply rating filter
    if (filters.minRating > 0) {
      filtered = filtered.filter(
        (recipe) => recipe.rating >= filters.minRating
      );
    }

    setFilteredRecipes(filtered);
  };

  const handleRecipeClick = (recipeId: string) => {
    navigate(`/recipe/${recipeId}`);
  };

  //reset const function
  const resetFilters = () => {
    setFilteredRecipes(recipes);
  };

  return (
    <div className="recommended-container">
      {" "}
      {/* Header */}
      <div className="recommended-header">
        <div className="recommended-header-content">
          <div className="recommended-header-flex">
            <div className="recommended-title-section">
              <h1>Recommended Recipes</h1>
              <p>Discover amazing recipes tailored for you</p>
            </div>
            <div className="recommended-header-actions">
              <button
                onClick={() => navigate("/search")}
                className="btn btn-outline"
              >
                <svg
                  className="btn-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Advanced Search
              </button>
              <button
                onClick={() => navigate("/my-recipes")}
                className="btn btn-secondary"
              >
                <svg
                  className="btn-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                My Recipes
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="recommended-content">
        {/* Search Bar */}
        <div className="recommended-search">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search recipes by name, ingredients, or tags..."
            showFilters={true}
            onFiltersChange={handleFiltersChange}
          />
        </div>

        {/* Results Count */}
        <div className="recommended-results-count">
          <p>
            Showing {filteredRecipes.length} of {recipes.length} recipes
          </p>
        </div>

        {/* Recipes Grid */}
        {filteredRecipes.length === 0 ? (
          <div className="recommended-empty-state">
            <div className="recommended-empty-icon-wrapper">
              <svg
                className="recommended-empty-icon"
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
              onClick={resetFilters}
              className="btn btn-primary recommended-empty-button"
            >
              Show All Recipes
            </button>
          </div>
        ) : (
          <div className="recommended-recipes-grid">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => handleRecipeClick(recipe.id)}
                className="recommended-recipe-card"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendedRecipesPage;
