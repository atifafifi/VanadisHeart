import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import SearchBar from "../components/SearchBar";
import type { Recipe } from "../types";
import { fetchRecipes, getRandomQuery } from "../services/recipeApi";
import "../styles/recommended.css";

interface RecipeFilters {
  query?: string;
  tags?: string[];
  difficulty?: string[];
  maxPrepTime?: number;
  minRating?: number;
}

const RecommendedRecipesPage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadRandomRecipes = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const randomQuery = getRandomQuery();
        console.log("Fetching recipes for:", randomQuery);
        const initialRecipes = await fetchRecipes(randomQuery);
        setRecipes(initialRecipes);
        setFilteredRecipes(initialRecipes);
      } catch (err) {
        setError("Failed to load recipes");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadRandomRecipes();
  }, []);

  const handleSearch = async (query: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const searchResults = await fetchRecipes(query);

      if (searchResults.length === 0) {
        setError("No recipes found for your search");
      }

      setRecipes(searchResults);
      setFilteredRecipes(searchResults);
    } catch (err) {
      setError("Failed to search recipes");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFiltersChange = (filters: RecipeFilters) => {
    let filtered = [...recipes];

    // Apply text search
    if (typeof filters.query === 'string' && filters.query.trim()) {
      const searchTerm = filters.query.toLowerCase();
      filtered = filtered.filter(
        (recipe) =>
          recipe.name.toLowerCase().includes(searchTerm) ||
          recipe.description.toLowerCase().includes(searchTerm) ||
          recipe.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Apply tag filters
    if (Array.isArray(filters.tags) && filters.tags.length > 0) {
      filtered = filtered.filter((recipe) =>
        filters.tags!.some((tag) => recipe.tags.includes(tag))
      );
    }

    // Apply difficulty filters
    if (Array.isArray(filters.difficulty) && filters.difficulty.length > 0) {
      filtered = filtered.filter((recipe) =>
        filters.difficulty!.includes(recipe.difficulty)
      );
    }

    // Apply prep time filter
    const maxPrepTime = filters.maxPrepTime;
    if (typeof maxPrepTime === 'number' && maxPrepTime > 0) {
      filtered = filtered.filter(
        (recipe) => recipe.prepTime + recipe.cookTime <= maxPrepTime
      );
    }

    // Apply rating filter
    const minRating = filters.minRating;
    if (typeof minRating === 'number' && minRating > 0) {
      filtered = filtered.filter(
        (recipe) => recipe.rating >= minRating
      );
    }

    setFilteredRecipes(filtered);
  };

  const handleRecipeClick = (recipe: Recipe) => {
    sessionStorage.setItem('currentRecipe', JSON.stringify(recipe));
    navigate(`/recipe/${recipe.id}`);
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

        {/* Loading State */}
        {isLoading && (
          <div className="recommended-loading-state">
            <div className="spinner"></div>
            <p>Loading recipes...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="recommended-error-state">
            <p>{error}</p>
            <button onClick={() => handleSearch("")} className="btn btn-primary">
              Retry
            </button>
          </div>
        )}

        {/* Results Count */}
        {!isLoading && !error && (
          <div className="recommended-results-count">
            <p>
              Showing {filteredRecipes.length} of {recipes.length} recipes
            </p>
          </div>
        )}

        {/* Recipes Grid */}
        {!isLoading && filteredRecipes.length === 0 ? (
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
              <p>No recipes found</p>
              <button onClick={resetFilters} className="btn btn-primary">
                Reset Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="recommended-grid">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => handleRecipeClick(recipe)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendedRecipesPage;
