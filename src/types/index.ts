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
  shoppingLists: ShoppingList[];
}

export interface RecipeAttempt {
  recipeId: string;
  date: Date;
  rating: number;
  notes: string;
  modifications: string[];
}

export interface ShoppingListItem {
  id: string;
  ingredient: string;
  quantity?: string;
  isCompleted: boolean;
  recipeId?: string; // Optional: link to recipe if added from one
  addedDate: Date;
  image?: string; // Optional: image for the ingredient
}

export interface ShoppingList {
  id: string;
  name: string; // Recipe name or custom name
  items: ShoppingListItem[];
  createdDate: Date;
  isCompleted: boolean;
}

export interface SearchFilters {
  query: string;
  tags: string[];
  difficulty: string[];
  prepTime: number;
  rating: number;
}