import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import { sampleRecipes } from '../data/sampleRecipes';
import type { Recipe, RecipeAttempt } from '../types';
import '../styles/myRecipes.css';

const MyRecipesPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'saved' | 'history'>('saved');
  
  const [savedRecipes] = useState<Recipe[]>(sampleRecipes.slice(0, 2));
  const [recipeHistory] = useState<RecipeAttempt[]>([
    {
      recipeId: '1',
      date: new Date('2024-01-20'),
      rating: 5,
      notes: 'Made this for dinner, turned out amazing!',
      modifications: ['Added extra garlic', 'Used whole wheat pasta']
    },
    {
      recipeId: '2',
      date: new Date('2024-01-18'),
      rating: 4,
      notes: 'Great recipe, will make again',
      modifications: ['Reduced salt']
    }
  ]);

  const handleRecipeClick = (recipeId: string) => {
    navigate(`/recipe/${recipeId}`);
  };

  const getRecipeById = (id: string) => {
    return sampleRecipes.find(recipe => recipe.id === id);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="my-recipes-container">
      {/* Header */}
      <div className="my-recipes-header">
        <div className="container my-recipes-header-content">
          <div className="my-recipes-header-flex">
            <div className="my-recipes-title-section">
              <h1>My Recipes</h1>
              <p>Your saved recipes and cooking history</p>
            </div>
            <button
              onClick={() => navigate('/recommended')}
              className="btn btn-outline my-recipes-discover-button"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Discover More
            </button>
          </div>
        </div>
      </div>

      <div className="container my-recipes-content">
        {/* Tabs */}
        <div className="my-recipes-tabs-wrapper">
          <div className="my-recipes-tabs-border">
            <nav className="my-recipes-tabs-nav">
              <button
                onClick={() => setActiveTab('saved')}
                className={`my-recipes-tab ${activeTab === 'saved' ? 'active' : 'inactive'}`}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Saved Recipes
                <span className="my-recipes-tab-count">{savedRecipes.length}</span>
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`my-recipes-tab ${activeTab === 'history' ? 'active' : 'inactive'}`}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Cooking History
                <span className="my-recipes-tab-count">{recipeHistory.length}</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Saved Recipes Tab */}
        {activeTab === 'saved' && (
          <div className="my-recipes-tab-content">
            {savedRecipes.length === 0 ? (
              <div className="my-recipes-empty-state">
                <div className="my-recipes-empty-icon-wrapper">
                  <svg className="my-recipes-empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3>No saved recipes yet</h3>
                <p>Start exploring recipes and save your favorites!</p>
                <button
                  onClick={() => navigate('/recommended')}
                  className="btn btn-primary my-recipes-empty-button"
                >
                  Browse Recipes
                </button>
              </div>
            ) : (
              <div className="my-recipes-grid">
                {savedRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onClick={() => handleRecipeClick(recipe.id)}
                    className="my-recipes-card"
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Cooking History Tab */}
        {activeTab === 'history' && (
          <div className="my-recipes-tab-content">
            {recipeHistory.length === 0 ? (
              <div className="my-recipes-empty-state">
                <div className="my-recipes-empty-icon-wrapper">
                  <svg className="my-recipes-empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3>No cooking history yet</h3>
                <p>Start cooking recipes to see your history here!</p>
                <button
                  onClick={() => navigate('/recommended')}
                  className="btn btn-primary my-recipes-empty-button"
                >
                  Start Cooking
                </button>
              </div>
            ) : (
              <div className="my-recipes-history-list">
                {recipeHistory.map((attempt, index) => {
                  const recipe = getRecipeById(attempt.recipeId);
                  if (!recipe) return null;

                  return (
                    <div key={index} className="my-recipes-history-card">
                      <div className="my-recipes-history-card-body">
                        <div className="my-recipes-history-content">
                          <div className="my-recipes-history-main">
                            <div className="my-recipes-history-header">
                              <h3 className="my-recipes-history-title">{recipe.name}</h3>
                              <div className="my-recipes-history-rating">
                                <span className="my-recipes-history-rating-star">★</span>
                                <span className="my-recipes-history-rating-value">{attempt.rating}</span>
                              </div>
                              <span className="my-recipes-history-date">
                                Cooked on {formatDate(attempt.date)}
                              </span>
                            </div>
                            
                            {attempt.notes && (
                              <p className="my-recipes-history-notes">{attempt.notes}</p>
                            )}

                            {attempt.modifications.length > 0 && (
                              <div className="my-recipes-history-modifications">
                                <h4 className="my-recipes-modifications-title">Your Modifications:</h4>
                                <ul className="my-recipes-modifications-list">
                                  {attempt.modifications.map((mod, modIndex) => (
                                    <li key={modIndex}>{mod}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            <div className="my-recipes-history-actions">
                              <button
                                onClick={() => handleRecipeClick(recipe.id)}
                                className="btn btn-primary my-recipes-history-action-btn"
                              >
                                View Recipe
                              </button>
                              <button
                                onClick={() => handleRecipeClick(recipe.id)}
                                className="btn btn-outline my-recipes-history-action-btn"
                              >
                                Cook Again
                              </button>
                            </div>
                          </div>
                          
                          {recipe.image && (
                            <div className="my-recipes-history-image-wrapper">
                              <img
                                src={recipe.image}
                                alt={recipe.name}
                                className="my-recipes-history-image"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRecipesPage;