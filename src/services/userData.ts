import type { Recipe, RecipeAttempt, User, ShoppingListItem, ShoppingList } from '../types';

const USER_DATA_KEY = 'vanadisHeartUserData';

export const getUserData = (): User => {
  const stored = localStorage.getItem(USER_DATA_KEY);
  if (stored) {
    const parsed = JSON.parse(stored);
    // Convert date strings back to Date objects
    parsed.recipeHistory = parsed.recipeHistory.map((attempt: RecipeAttempt & { date: string }) => ({
      ...attempt,
      date: new Date(attempt.date)
    }));
    // Ensure shoppingLists exists for backward compatibility
    if (!parsed.shoppingLists) {
      parsed.shoppingLists = [];
    }
    return parsed;
  }
  return {
    id: 'user1',
    username: 'User',
    email: 'user@example.com',
    savedRecipes: [],
    recipeHistory: [],
    shoppingLists: []
  };
};

export const saveUserData = (userData: User): void => {
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
};

export const addSavedRecipe = (recipeId: string): void => {
  const userData = getUserData();
  if (!userData.savedRecipes.includes(recipeId)) {
    userData.savedRecipes.push(recipeId);
    saveUserData(userData);
  }
};

export const removeSavedRecipe = (recipeId: string): void => {
  const userData = getUserData();
  userData.savedRecipes = userData.savedRecipes.filter(id => id !== recipeId);
  saveUserData(userData);
};

export const isRecipeSaved = (recipeId: string): boolean => {
  const userData = getUserData();
  return userData.savedRecipes.includes(recipeId);
};

export const addToHistory = (attempt: RecipeAttempt): void => {
  const userData = getUserData();
  userData.recipeHistory.push(attempt);
  saveUserData(userData);
};

export const getSavedRecipes = (allRecipes: Recipe[]): Recipe[] => {
  const userData = getUserData();
  return allRecipes.filter(recipe => userData.savedRecipes.includes(recipe.id));
};

export const getRecipeHistory = (): RecipeAttempt[] => {
  const userData = getUserData();
  return userData.recipeHistory;
};

export const getShoppingLists = (): ShoppingList[] => {
  const userData = getUserData();
  return userData.shoppingLists;
};

export const getShoppingList = (listId: string): ShoppingList | undefined => {
  const userData = getUserData();
  return userData.shoppingLists.find(list => list.id === listId);
};

export const createShoppingList = (name: string): string => {
  const userData = getUserData();
  const newList: ShoppingList = {
    id: Date.now().toString(),
    name,
    items: [],
    createdDate: new Date(),
    isCompleted: false
  };
  userData.shoppingLists.push(newList);
  saveUserData(userData);
  return newList.id;
};

export const addToShoppingList = async (listId: string, item: Omit<ShoppingListItem, 'id' | 'addedDate' | 'image'>): Promise<void> => {
  const userData = getUserData();
  const list = userData.shoppingLists.find(list => list.id === listId);
  if (!list) return;

  const newItem: ShoppingListItem = {
    ...item,
    id: Date.now().toString(),
    addedDate: new Date()
  };

  // Try to fetch an image for the ingredient
  try {
    const { fetchRecipeImage } = await import('./recipePicApi');
    newItem.image = await fetchRecipeImage(item.ingredient);
  } catch (error) {
    console.warn('Failed to fetch image for ingredient:', item.ingredient, error);
    // Continue without image
  }

  list.items.push(newItem);
  saveUserData(userData);
};

export const removeFromShoppingList = (listId: string, itemId: string): void => {
  const userData = getUserData();
  const list = userData.shoppingLists.find(list => list.id === listId);
  if (!list) return;

  list.items = list.items.filter(item => item.id !== itemId);
  saveUserData(userData);
};

export const toggleShoppingListItem = (listId: string, itemId: string): void => {
  const userData = getUserData();
  const list = userData.shoppingLists.find(list => list.id === listId);
  if (!list) return;

  const item = list.items.find(item => item.id === itemId);
  if (item) {
    item.isCompleted = !item.isCompleted;
    saveUserData(userData);
  }
};

export const clearCompletedShoppingListItems = (listId: string): void => {
  const userData = getUserData();
  const list = userData.shoppingLists.find(list => list.id === listId);
  if (!list) return;

  list.items = list.items.filter(item => !item.isCompleted);
  saveUserData(userData);
};

export const deleteShoppingList = (listId: string): void => {
  const userData = getUserData();
  userData.shoppingLists = userData.shoppingLists.filter(list => list.id !== listId);
  saveUserData(userData);
};