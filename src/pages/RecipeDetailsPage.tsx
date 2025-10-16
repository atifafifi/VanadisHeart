import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Recipe } from '../types';
import NotesEditor from '../components/NotesEditor';
import { fetchRecipes } from '../services/recipeApi';
import '../styles/recipeDetails.css';

const RecipeDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [userNotes, setUserNotes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
            return;
          }
        }
        // Fallback to fetching new data
        const recipes = await fetchRecipes();
        const foundRecipe = recipes.find(r => r.id === id);
        if (foundRecipe) {
          setRecipe(foundRecipe);
          sessionStorage.setItem('currentRecipe', JSON.stringify(foundRecipe));
        }
      } catch (error) {
        console.error('Error loading recipe:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecipe();
  }, [id]);

  // const handleNotesChange = (notes: string[]) => {
  //   setUserNotes(notes);
  //   // In a real app, this would save to the backend
  // };

  // const handleRatingChange = (rating: number) => {
  //   if (recipe) {
  //     // In a real app, this would update the recipe rating
  //     console.log(`Rating changed to: ${rating}`);
  //   }
  // };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'var(--complementary-teal)';
      case 'Medium': return 'var(--primary-orange)';
      case 'Hard': return 'var(--complementary-blue)';
      default: return 'var(--gray-500)';
    }
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
      {/* Header */}
      <div className="recipe-details-header">
        <div className="container py-6">
          <div className="recipe-details-header-content">
            <div className="breadcrumb">
              <span
                onClick={() => navigate('/recommended')}
                className="breadcrumb-link"
              >
                Recipes
              </span>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">{recipe?.name}</span>
            </div>
            <div className="recipe-details-actions">
              <button className="btn btn-outline">
                <svg className="icon-sm mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Save Recipe
              </button>
              <button className="btn btn-primary">
                <svg className="icon-sm mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="recipe-details-layout">
          {/* Main Content */}
          <div className="recipe-details-main">
            {/* Recipe Header */}
            <div className="card">
              <div className="card-body">
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{recipe?.name}</h1>
                    <div className="recipe-times">
                      <span>Preparation Time: {formatTime(recipe?.prepTime || 0)}</span>
                      <span>•</span>
                      <span>Cooking Time: {formatTime(recipe?.cookTime || 0)}</span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="recipe-tags">
                  {recipe?.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="recipe-tag"
                      style={{
                        backgroundColor: 'var(--primary-orange-100)',
                        color: 'var(--primary-orange-800)'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Ingredients */}
            <div className="card">
              <div className="card-header">
                <h2 className="text-xl font-semibold text-gray-900">Ingredients</h2>
              </div>
              <div className="card-body">
                <ul className="ingredients-list">
                  {recipe?.ingredients.map((ingredient, index) => (
                    <li key={index} className="ingredient-item">
                      <span className="text-primary-orange mr-3 mt-1">•</span>
                      <span className="text-gray-700">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Instructions */}
            <div className="card">
              <div className="card-header">
                <h2 className="text-xl font-semibold text-gray-900">Instructions</h2>
              </div>
              <div className="card-body">
                <div className="instructions-list">
                  {recipe?.instructions.map((instruction, index) => (
                    instruction.trim() && (
                      <div key={index} className="instruction-item">
                        <span
                          className="instruction-number"
                          style={{ backgroundColor: 'var(--primary-orange)' }}
                        >
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{instruction.trim()}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="recipe-details-sidebar">
            {/* Difficulty Level */}
            <div className="card">
              <div className="card-body">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Difficulty Level</h3>
                <div
                  className="difficulty-badge"
                  style={{ backgroundColor: getDifficultyColor(recipe?.difficulty || 'Medium') }}
                >
                  {recipe?.difficulty || 'Medium'}
                </div>
              </div>
            </div>

            {/* Notes Editor */}
            <NotesEditor
              notes={userNotes}
              onNotesChange={setUserNotes}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailsPage;