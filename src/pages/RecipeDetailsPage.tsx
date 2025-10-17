import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Recipe, RecipeAttempt } from '../types';
import NotesEditor from '../components/NotesEditor';
import { fetchRecipes } from '../services/recipeApi';
import { isRecipeSaved, addSavedRecipe, removeSavedRecipe, addToHistory } from '../services/userData';
import '../styles/recipeDetails.css';

const RecipeDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [userNotes, setUserNotes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [showHistoryForm, setShowHistoryForm] = useState(false);
  const [historyRating, setHistoryRating] = useState(5);
  const [historyNotes, setHistoryNotes] = useState('');
  const [historyModifications, setHistoryModifications] = useState<string[]>([]);

  useEffect(() => {
    const loadRecipe = async () => {
      setIsLoading(true);
      try {
        // Since Ninja API doesn't support fetching by ID, we'll need to store the recipe in state/localStorage
        const storedRecipes = sessionStorage.getItem('currentRecipe');
        if (storedRecipes) {
          const parsedRecipe = JSON.parse(storedRecipes);
          if (parsedRecipe.id === id) {
            setRecipe(parsedRecipe);
            setIsSaved(isRecipeSaved(parsedRecipe.id));
            return;
          }
        }
        // Fallback to fetching new data
        const recipes = await fetchRecipes();
        const foundRecipe = recipes.find(r => r.id === id);
        if (foundRecipe) {
          setRecipe(foundRecipe);
          setIsSaved(isRecipeSaved(foundRecipe.id));
          sessionStorage.setItem('currentRecipe', JSON.stringify(foundRecipe));
        } else {
          // If recipe not found, show error
          console.error('Recipe not found in API results');
        }
      } catch (error) {
        console.error('Error loading recipe:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecipe();
  }, [id]);

  const handleSaveRecipe = () => {
    if (!recipe) return;
    if (isSaved) {
      removeSavedRecipe(recipe.id);
      setIsSaved(false);
    } else {
      addSavedRecipe(recipe.id);
      setIsSaved(true);
    }
    // Force re-render to update saved state
    setIsSaved(isRecipeSaved(recipe.id));
  };

  const handleMoveToHistory = () => {
    if (!recipe) return;
    const attempt: RecipeAttempt = {
      recipeId: recipe.id,
      date: new Date(),
      rating: historyRating,
      notes: historyNotes,
      modifications: historyModifications
    };
    addToHistory(attempt);
    removeSavedRecipe(recipe.id);
    setIsSaved(false);
    setShowHistoryForm(false);
    // Reset form
    setHistoryRating(5);
    setHistoryNotes('');
    setHistoryModifications([]);
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };


  if (isLoading) {
    return (
      <div className="recipe-details-container">
        <div className="text-center">
          <div className="loading-spinner">
            <svg className="animate-spin h-8 w-8 text-primary-orange" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-gray-600 font-medium">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="recipe-details-container">
        <div className="text-center">
          <div className="error-icon">
            <svg className="icon-2xl text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Recipe not found</h2>
          <p className="text-lg text-gray-600 mb-6">The recipe you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/recommended')}
            className="btn btn-primary"
          >
            Back to Recipes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-details-page">
      {/* Enhanced Header */}
      <div className="recipe-details-header">
        <div className="recipe-details-header-content">
          <div className="breadcrumb">
            <button
              onClick={() => navigate('/recommended')}
              className="breadcrumb-link"
            >
              <span className="mr-1">🍽️</span>
              Recipes
            </button>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">{recipe?.name}</span>
          </div>
          <div className="recipe-details-actions">
            <button className="btn btn-outline" onClick={handleSaveRecipe}>
              <span className="mr-2">{isSaved ? '💔' : '❤️'}</span>
              {isSaved ? 'Unsave Recipe' : 'Save Recipe'}
            </button>
            {isSaved && (
              <button className="btn btn-secondary" onClick={() => setShowHistoryForm(true)}>
                <span className="mr-2">🍳</span>
                Move to History
              </button>
            )}
            <button className="btn btn-primary">
              <span className="mr-2">📤</span>
              Share Recipe
            </button>
          </div>
        </div>
      </div>

      <div className="recipe-details-layout">
        {/* Enhanced Main Content */}
        <div className="recipe-details-main">
          {/* Enhanced Recipe Hero Section */}
          <div className="recipe-details-card">
            {recipe?.image && (
              <div className="recipe-image-container">
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  className="recipe-image"
                />
              </div>
            )}

            <div className="recipe-header-info">
              <div>
                <h1 className="recipe-details-title">{recipe?.name}</h1>
                <div className="recipe-times">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary-pastel" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Prep: {formatTime(recipe?.prepTime || 0)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary-pastel" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Cook: {formatTime(recipe?.cookTime || 0)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary-pastel" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Serves: {recipe?.servings || 4}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Tags */}
            <div className="recipe-tags">
              {recipe?.tags.map((tag, index) => (
                <span key={index} className="recipe-tag">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Enhanced Ingredients Section */}
          <div className="recipe-details-card">
            <h2 className="recipe-details-card-title">
              <span className="text-primary-pastel font-bold text-lg mr-2">🥕</span>
              Ingredients
            </h2>
            <div className="ingredients-list">
              {recipe?.ingredients.map((ingredient, index) => (
                <div key={index} className="ingredient-item">
                  <span className="text-gray-700 font-medium">{ingredient}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Instructions Section */}
          <div className="recipe-details-card">
            <h2 className="recipe-details-card-title">
              <span className="text-primary-pastel font-bold text-lg mr-2">👨‍🍳</span>
              Instructions
            </h2>
            <div className="instructions-list">
              {recipe?.instructions.map((instruction, index) => (
                instruction.trim() && (
                  <div key={index} className="instruction-item">
                    <span className="instruction-number">
                      {index + 1}
                    </span>
                    <span className="text-gray-700 leading-relaxed">{instruction.trim()}</span>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Sidebar */}
        <div className="recipe-details-sidebar">
          {/* Enhanced Difficulty Badge */}
          <div className="recipe-details-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2 text-lg">🎯</span>
              Difficulty Level
            </h3>
            <div
              className="difficulty-badge"
              style={{
                background: recipe?.difficulty === 'easy'
                  ? 'linear-gradient(135deg, #10b981, #059669)'
                  : recipe?.difficulty === 'medium'
                  ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                  : 'linear-gradient(135deg, #ef4444, #dc2626)'
              }}
            >
              {recipe?.difficulty ? recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1) : 'Medium'}
            </div>
          </div>

          {/* Enhanced Nutritional Info Placeholder */}
          <div className="recipe-details-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2 text-lg">📊</span>
              Quick Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">Total Time</span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatTime((recipe?.prepTime || 0) + (recipe?.cookTime || 0))}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">Rating</span>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold text-gray-900">{recipe?.rating || 5}</span>
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Notes Editor */}
          <NotesEditor
            notes={userNotes}
            onNotesChange={setUserNotes}
          />

          {/* History Form Modal */}
          {showHistoryForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold mb-4">Move to Cooking History</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                    <select
                      value={historyRating}
                      onChange={(e) => setHistoryRating(Number(e.target.value))}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      {[1, 2, 3, 4, 5].map(rating => (
                        <option key={rating} value={rating}>{rating} ⭐</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      value={historyNotes}
                      onChange={(e) => setHistoryNotes(e.target.value)}
                      placeholder="How did it turn out?"
                      className="w-full p-2 border border-gray-300 rounded-md h-20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Modifications (one per line)</label>
                    <textarea
                      value={historyModifications.join('\n')}
                      onChange={(e) => setHistoryModifications(e.target.value.split('\n').filter(m => m.trim()))}
                      placeholder="What did you change?"
                      className="w-full p-2 border border-gray-300 rounded-md h-20"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() => setShowHistoryForm(false)}
                    className="flex-1 btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleMoveToHistory}
                    className="flex-1 btn btn-primary"
                  >
                    Move to History
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailsPage;