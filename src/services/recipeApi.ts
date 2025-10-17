import type { Recipe } from '../types';
import { fetchRecipeImage } from './recipePicApi';

interface NinjaAPIRecipe {
  title: string;
  ingredients: string;
  servings: string;
  instructions: string;
}

const API_KEY = 'Hh9POVEan9zgRnjXuRt3eA==uI5qXYDiODpL88SV';
const BASE_URL = 'https://api.api-ninjas.com/v1/recipe';

// Array of popular food queries for random recommendations
const popularQueries = [
  'pasta', 'chicken', 'beef', 'salmon', 'rice', 
  'curry', 'soup', 'salad', 'pizza', 'burger'
];

export const getRandomQuery = (): string => {
  return popularQueries[Math.floor(Math.random() * popularQueries.length)];
};

const getDifficultyFromTime = (prepTime: number, cookTime: number): 'easy' | 'medium' | 'hard' => {
  const totalTime = prepTime + cookTime;
  if (totalTime < 30) return 'easy';
  if (totalTime >= 30 && totalTime <= 60) return 'medium';
  return 'hard';
};

const getCulinaryTags = (recipe: NinjaAPIRecipe): string[] => {
  const tags: string[] = [];
  const ingredients = recipe.ingredients.toLowerCase();


  // Italian cuisine
  if (ingredients.includes('pasta') || 
      ingredients.includes('parmesan') || 
      ingredients.includes('italian')) {
    tags.push('italian');
  }

  // Quick recipes
  if (recipe.ingredients.split('|').length <= 5) {
    tags.push('quick');
  }

  // Comfort food
  if (ingredients.includes('soup') || 
      ingredients.includes('stew') || 
      ingredients.includes('broth')) {
    tags.push('comfort food');
  }

  // Seafood
  const seafoodIngredients = ['fish', 'prawn', 'shrimp', 'clam', 'mussel', 'salmon', 'tuna'];
  if (seafoodIngredients.some(item => ingredients.includes(item))) {
    tags.push('seafood');
  }

  // Healthy
  const vegetables = ['spinach', 'kale', 'broccoli', 'carrot', 'lettuce', 'vegetable'];
  if (vegetables.some(veg => ingredients.includes(veg))) {
    tags.push('healthy');
  }

  // Asian
  if (ingredients.includes('rice') || 
      ingredients.includes('soy sauce') || 
      ingredients.includes('asian')) {
    tags.push('asian');
  }

  // Gluten-free
  const glutenIngredients = ['wheat', 'barley', 'rye', 'flour'];
  if (!glutenIngredients.some(item => ingredients.includes(item))) {
    tags.push('gluten free');
  }

  // Dessert
  if (ingredients.includes('flour') && 
      (ingredients.includes('sugar') || ingredients.includes('sweet'))) {
    tags.push('dessert');
  }

  // Chocolate
  if (ingredients.includes('chocolate') || 
      ingredients.includes('cocoa')) {
    tags.push('chocolate');
  }

  // Baking
  if (ingredients.includes('egg') && 
      (ingredients.includes('baking powder') || ingredients.includes('baking soda'))) {
    tags.push('baking');
  }

  // Special occasions
  const complexityIndicators = recipe.ingredients.split('|').length >= 8;
  if (complexityIndicators) {
    tags.push('special occasions');
  }

  return tags;
};

export const fetchRecipes = async (query: string = ''): Promise<Recipe[]> => {
  try {
    const searchQuery = query.trim() || getRandomQuery();

    // Fetch multiple queries to get more recipes
    const queries = query.trim() ? [searchQuery] : [
      searchQuery,
      getRandomQuery(),
      getRandomQuery(),
      getRandomQuery()
    ];

    // Remove duplicates
    const uniqueQueries = [...new Set(queries)];

    // Fetch recipes from multiple queries concurrently
    const recipePromises = uniqueQueries.map(async (q) => {
      const response = await fetch(`${BASE_URL}?query=${encodeURIComponent(q)}`, {
        headers: {
          'X-Api-Key': API_KEY,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json() as Promise<NinjaAPIRecipe[]>;
    });

    const recipeResults = await Promise.all(recipePromises);

    // Flatten and combine all recipes
    const allRecipes = recipeResults.flat();

    // Shuffle and limit to 10 recipes
    const shuffledRecipes = allRecipes.sort(() => Math.random() - 0.5).slice(0, 10);

    // Fetch images for all recipes concurrently with specific queries
    const recipesWithImages = await Promise.all(
      shuffledRecipes.map(async (item: NinjaAPIRecipe) => {
        // Extract a relevant food keyword from the recipe title or ingredients for image search
        const titleWords = item.title.toLowerCase().split(' ');
        const ingredientWords = item.ingredients.toLowerCase().split('|')[0]?.split(' ') || [];

        // Find food-related keywords
        const foodKeywords = [...titleWords, ...ingredientWords].filter(word =>
          popularQueries.some(query => word.includes(query) || query.includes(word))
        );

        // Use the first matching keyword or a random one
        const imageQuery = foodKeywords.length > 0 ? foodKeywords[0] : getRandomQuery();

        const imageUrl = await fetchRecipeImage(imageQuery);
        let estimatedPrepTime = 20; // Default prep time
        let estimatedCookTime = 25; // Default cook time

        // Estimate cooking time based on instructions complexity
        if (item.instructions.length > 500) {
          estimatedPrepTime = 40;
          estimatedCookTime = 50;
        } else if (item.instructions.length > 300) {
          estimatedPrepTime = 30;
          estimatedCookTime = 35;
        }

        return {
          id: Math.random().toString(36).substr(2, 9),
          name: item.title,
          description: item.title,
          instructions: item.instructions.split('. ').filter(step => step.trim()),
          ingredients: item.ingredients.split('|').map((i: string) => i.trim()),
          prepTime: estimatedPrepTime,
          cookTime: estimatedCookTime,
          servings: parseInt(item.servings) || 4,
          difficulty: getDifficultyFromTime(estimatedPrepTime, estimatedCookTime),
          tags: getCulinaryTags(item),
          rating: 5,
          image: imageUrl,
          isFavorite: false,
          variants: [],
          notes: [],
          author: 'API Recipe',
          createdAt: new Date()
        };
      })
    );

    return recipesWithImages;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
};