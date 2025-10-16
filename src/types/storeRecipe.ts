import type { Recipe } from '../types';

export const storeRecipeForDetails = (recipe: Recipe): void => {
  const viewedRecipes = JSON.parse(localStorage.getItem('viewedRecipes') || '[]');
  const updatedRecipes = [recipe, ...viewedRecipes.filter((r: Recipe) => r.id !== recipe.id)];
  localStorage.setItem('viewedRecipes', JSON.stringify(updatedRecipes.slice(0, 10))); // Keep last 10 recipes
};