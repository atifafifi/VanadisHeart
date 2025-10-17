import type { Recipe } from '../types';

interface NinjaAPIRecipe {
  title: string;
  ingredients: string;
  servings: string;
  instructions: string;
}

interface UnsplashResponse {
  urls: {
    regular: string;
    small: string;
  };
}

const API_KEY = '53oH6r_tvuuUFuRWsQMdaBZqVmh9HhXjeIBl306hICw';
const BASE_URL = 'https://api.unsplash.com/photos/random?query=food&client_id=' + API_KEY;

const UNSPLASH_API_KEY = '53oH6r_tvuuUFuRWsQMdaBZqVmh9HhXjeIBl306hICw';
const UNSPLASH_BASE_URL = 'https://api.unsplash.com/photos/random';

// Array of popular food queries for random recommendations
const popularQueries = [
  'pasta', 'chicken', 'beef', 'salmon', 'rice', 
  'curry', 'soup', 'salad', 'pizza', 'burger'
];

export const getRandomQuery = (): string => {
  return popularQueries[Math.floor(Math.random() * popularQueries.length)];
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
        return {
          id: Math.random().toString(36).substr(2, 9),
          name: item.title,
          description: item.title,
          instructions: item.instructions.split('. ').filter(step => step.trim()),
          ingredients: item.ingredients.split('|').map((i: string) => i.trim()),
          prepTime: 30,
          cookTime: 30,
          servings: parseInt(item.servings) || 4,
          difficulty: 'medium' as const,
          tags: item.ingredients.split('|').slice(0, 3).map((i: string) => i.trim()),
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

// Array of fallback food images from a public CDN
const fallbackImages = [
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop'
];

export const fetchRecipeImage = async (query?: string): Promise<string> => {
  try {
    // Use specific food query or default to 'food'
    const searchQuery = query || 'food';

    // Try Unsplash API first with specific query
    const response = await fetch(
      `${UNSPLASH_BASE_URL}?query=${encodeURIComponent(searchQuery)}&client_id=${UNSPLASH_API_KEY}&orientation=landscape`
    );

    if (response.ok) {
      const data = await response.json() as UnsplashResponse;
      console.log(`Fetched image URL for ${searchQuery}:`, data.urls.small);
      return data.urls.small;
    }

    // If API fails, use a random fallback image
    console.log('Using fallback image due to API failure');
    return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
  } catch (error) {
    console.error('Error fetching image:', error);
    // Return a random fallback image
    return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
  }
};