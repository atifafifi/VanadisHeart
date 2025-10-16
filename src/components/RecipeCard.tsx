import React from 'react';
import type { Recipe } from '../types';
import '../styles/recipeCard.css';

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
  showDescription?: boolean;
  className?: string;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ 
  recipe, 
  onClick, 
  showDescription = true,
  className = '' 
}) => {
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'var(--complementary-mint)';
      case 'Medium': return 'var(--primary-pastel)';
      case 'Hard': return 'var(--complementary-lavender)';
      default: return 'var(--gray-500)';
    }
  };

  return (
    <div 
      className={`card cursor-pointer ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {recipe.image && (
        <div className="relative overflow-hidden rounded-t-lg" style={{ height: '200px' }}>
          <img 
            src={recipe.image} 
            alt={recipe.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-3 right-3">
            <div 
              className="px-2 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: getDifficultyColor(recipe.difficulty) }}
            >
              {recipe.difficulty}
            </div>
          </div>
        </div>
      )}
      
      <div className="card-body">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {recipe.name}
          </h3>
          <div className="flex items-center ml-2">
            <span className="text-yellow-500">★</span>
            <span className="text-sm text-gray-600 ml-1">{recipe.rating}</span>
          </div>
        </div>

        {showDescription && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {recipe.description}
          </p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center">
              <svg className="icon-sm mr-1.5 text-primary-pastel" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatTime(recipe.prepTime + recipe.cookTime)}
            </span>
            <span className="flex items-center">
              <svg className="icon-sm mr-1.5 text-primary-pastel" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {recipe.servings} servings
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {recipe.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 text-xs rounded-full"
              style={{
                backgroundColor: 'var(--primary-pastel-100)',
                color: 'var(--primary-pastel-800)'
              }}
            >
              {tag}
            </span>
          ))}
          {recipe.tags.length > 3 && (
            <span className="px-2 py-1 text-xs text-gray-500">
              +{recipe.tags.length - 3} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;