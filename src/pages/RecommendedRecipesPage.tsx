import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import SearchBar from "../components/SearchBar";
import type { Recipe } from "../types";
import { fetchRecipes } from "../services/recipeApi";
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
  const [filters, setFilters] = useState<RecipeFilters>({
    query: '',
    tags: [],
    difficulty: [],
    maxPrepTime: 0,
    minRating: 0,
  });
  const navigate = useNavigate();

  // Add available tags array
  const availableTags = [
    'Italian',
    'Asian',
    'Quick',
    'Comfort Food',
    'Seafood',
    'Healthy',
    'Gluten Free',
    'Dessert',
    'Chocolate',
    'Baking',
    'Special Occasion'
  ];

  // Add toggle functions
  const toggleTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags?.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...(prev.tags || []), tag]
    }));
  };

  const toggleDifficulty = (difficulty: string) => {
    setFilters(prev => ({
      ...prev,
      difficulty: prev.difficulty?.includes(difficulty)
        ? prev.difficulty.filter(d => d !== difficulty)
        : [...(prev.difficulty || []), difficulty]
    }));
  };

  useEffect(() => {
    const loadRandomRecipes = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Fetch 10 recipes by using empty query (triggers multiple random queries)
        const initialRecipes = await fetchRecipes('');
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

  const handleFiltersChange = (newFilters: RecipeFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  useEffect(() => {
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
  }, [filters, recipes]);

  const handleRecipeClick = (recipe: Recipe) => {
    sessionStorage.setItem('currentRecipe', JSON.stringify(recipe));
    navigate(`/recipe/${recipe.id}`);
  };

  //reset const function
  const resetFilters = () => {
    setFilters({
      query: '',
      tags: [],
      difficulty: [],
      maxPrepTime: 0,
      minRating: 0,
    });
    setFilteredRecipes(recipes);
  };

  return (
    <div className="recommended-container">
      <div className="recommended-header">
        <div className="recommended-title-section">
          <h1 className="recommended-title">Recommended Recipes</h1>
          <p className="recommended-subtitle">Discover amazing recipes tailored for you</p>
        </div>
        <div className="recommended-header-actions">
          <button
            onClick={() => navigate('/search')}
            className="btn btn-outline"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Advanced Search
          </button>
          <button
            onClick={() => navigate('/my-recipes')}
            className="btn btn-secondary"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            My Recipes
          </button>
        </div>
      </div>

      <div className="recommended-content">
        {/* Enhanced Search and Filters Section */}
        <div className="recommended-filters-grid">
          <div className="recommended-filters-sidebar">
            <div className="filters-card">
              <div className="filters-header">
                <h2>Filters</h2>
                <button
                  onClick={resetFilters}
                  className="clear-filters-button"
                >
                  Clear All
                </button>
              </div>

              {/* Enhanced Search Input */}
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
                      className={`tags-button ${
                        filters.tags?.includes(tag) ? 'is-active' : ''
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
                  {['Easy', 'Medium', 'Hard'].map((diff) => (
                    <button
                      key={diff}
                      className={`difficulty-button ${
                        filters.difficulty?.includes(diff) ? 'is-active' : ''
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
                  <label className="filter-section-title">Maximum Prep Time</label>
                  <span className="filter-slider-value">
                    {filters.maxPrepTime || 'Any'} min
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="120"
                  step="15"
                  value={filters.maxPrepTime || 0}
                  onChange={(e) => handleFiltersChange({ 
                    maxPrepTime: Number(e.target.value) 
                  })}
                  className="filter-slider"
                />
              </div>
            </div>
          </div>

          {/* Enhanced Results Section */}
          <div className="recommended-results">
            {/* Enhanced Results Header */}
            <div className="results-header">
              <div className="results-count">
                <h2>{filteredRecipes.length} Recipe{filteredRecipes.length !== 1 ? 's' : ''} Found</h2>
                {recipes.length !== filteredRecipes.length && (
                  <p className="results-subtitle">Filtered from {recipes.length} total recipes</p>
                )}
              </div>
              <div className="sort-container">
                <label>Sort by:</label>
                <select className="sort-select">
                  <option value="relevance">Relevance</option>
                  <option value="rating">Rating</option>
                  <option value="time">Prep Time</option>
                </select>
              </div>
            </div>

            {/* Enhanced Loading State */}
            {isLoading && (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading amazing recipes...</p>
              </div>
            )}

            {/* Enhanced Error State */}
            {error && !isLoading && (
              <div className="error-state">
                <p>{error}</p>
                <button onClick={() => handleSearch('')} className="btn btn-primary">
                  Try Again
                </button>
              </div>
            )}

            {/* Recipes Grid */}
            {!isLoading && !error && (
              <div className="recipes-grid">
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
      </div>
    </div>
  );
};

export default RecommendedRecipesPage;
