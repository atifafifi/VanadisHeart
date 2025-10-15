import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sampleRecipes } from '../data/sampleRecipes';
import type { Recipe } from '../types';
import NotesEditor from '../components/NotesEditor';
import VariantsList from '../components/VariantsList';
import Ratings from '../components/Ratings';
import '../styles/recipeDetails.css';

const RecipeDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [userNotes, setUserNotes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      const foundRecipe = sampleRecipes.find(r => r.id === id);
      setRecipe(foundRecipe || null);
      setIsLoading(false);
    }, 500);
  }, [id]);

  const handleNotesChange = (notes: string[]) => {
    setUserNotes(notes);
    // In a real app, this would save to the backend
  };

  const handleRatingChange = (rating: number) => {
    if (recipe) {
      // In a real app, this would update the recipe rating
      console.log(`Rating changed to: ${rating}`);
    }
  };

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
          <div className="w-16 h-16 bg-primary-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="icon-2xl text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Recipe not found</h2>
          <p className="text-lg text-gray-600 mb-6">The recipe you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/recommended')}
            className="btn btn-primary px-8 py-3"
          >
            Back to Recipes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/recommended')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="icon-md mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Recipes
            </button>
            <div className="flex items-center gap-4">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recipe Header */}
            <div className="card">
              <div className="card-body">
                {recipe.image && (
                  <div className="mb-6">
                    <img
                      src={recipe.image}
                      alt={recipe.name}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                )}

                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{recipe.name}</h1>
                    <p className="text-lg text-gray-600 mb-4">{recipe.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>By {recipe.author}</span>
                      <span>•</span>
                      <span>{new Date(recipe.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end mb-2">
                      <Ratings rating={recipe.rating} size="lg" />
                    </div>
                    <div
                      className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white"
                      style={{ backgroundColor: getDifficultyColor(recipe.difficulty) }}
                    >
                      {recipe.difficulty}
                    </div>
                  </div>
                </div>

                {/* Recipe Stats */}
                <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-gray-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{formatTime(recipe.prepTime)}</div>
                    <div className="text-sm text-gray-500">Prep Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{formatTime(recipe.cookTime)}</div>
                    <div className="text-sm text-gray-500">Cook Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{recipe.servings}</div>
                    <div className="text-sm text-gray-500">Servings</div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {recipe.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm rounded-full"
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
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start">
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
                <ol className="space-y-4">
                  {recipe.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start">
                      <span
                        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium mr-4"
                        style={{ backgroundColor: 'var(--primary-orange)' }}
                      >
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Variants */}
            <VariantsList variants={recipe.variants} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Rate Recipe */}
            <div className="card">
              <div className="card-body">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Rate this Recipe</h3>
                <Ratings
                  rating={0}
                  interactive={true}
                  onRatingChange={handleRatingChange}
                  size="lg"
                />
                <p className="text-sm text-gray-500 mt-2">Click on a star to rate</p>
              </div>
            </div>

            {/* Notes Editor */}
            <NotesEditor
              notes={userNotes}
              onNotesChange={handleNotesChange}
            />

            {/* Original Notes */}
            {recipe.notes.length > 0 && (
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-gray-900">Chef's Notes</h3>
                </div>
                <div className="card-body">
                  <ul className="space-y-2">
                    {recipe.notes.map((note, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <span className="text-primary-orange mr-2 mt-1">💡</span>
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailsPage;