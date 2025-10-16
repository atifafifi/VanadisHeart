export interface Recipe {
  id: string;
  name: string;
  description: string;
  instructions: string[];
  ingredients: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  rating: number;
  image: string;
  isFavorite?: boolean;
  variants?: RecipeVariant[];
  notes?: string[];
  author?: string;
  createdAt?: Date;
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