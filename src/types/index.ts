export interface Recipe {
  id: string;
  name: string;
  description: string;
  image?: string;
  ingredients: string[];
  instructions: string[];
  variants: RecipeVariant[];
  notes: string[];
  rating: number;
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  author: string;
  createdAt: Date;
}

export interface RecipeVariant {
  id: string;
  name: string;
  description: string;
  modifications: {
    ingredients: string[];
    instructions: string[];
  };
}

export interface User {
  id: string;
  username: string;
  email: string;
  savedRecipes: string[];
  recipeHistory: RecipeAttempt[];
}

export interface RecipeAttempt {
  recipeId: string;
  date: Date;
  rating: number;
  notes: string;
  modifications: string[];
}

export interface SearchFilters {
  query: string;
  tags: string[];
  difficulty: string[];
  prepTime: number;
  rating: number;
}