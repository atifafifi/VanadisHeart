import type { Recipe } from '../types';

export const sampleRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Classic Spaghetti Carbonara',
    description: 'A traditional Italian pasta dish with eggs, cheese, and pancetta',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400',
    ingredients: [
      '400g spaghetti',
      '200g pancetta or guanciale',
      '4 large eggs',
      '100g Pecorino Romano cheese',
      '2 cloves garlic',
      'Black pepper',
      'Salt'
    ],
    instructions: [
      'Bring a large pot of salted water to boil and cook spaghetti according to package directions',
      'Cut pancetta into small cubes and cook in a large skillet until crispy',
      'In a bowl, whisk together eggs, grated cheese, and black pepper',
      'Drain pasta, reserving 1 cup of pasta water',
      'Add hot pasta to the skillet with pancetta',
      'Remove from heat and quickly stir in egg mixture, adding pasta water as needed',
      'Serve immediately with extra cheese and pepper'
    ],
    variants: [
      {
        id: '1-1',
        name: 'Vegetarian Version',
        description: 'Replace pancetta with mushrooms and add spinach',
        modifications: {
          ingredients: ['Replace pancetta with 200g mixed mushrooms', 'Add 100g fresh spinach'],
          instructions: ['Sauté mushrooms until golden', 'Add spinach in the last minute of cooking']
        }
      },
      {
        id: '1-2',
        name: 'Creamy Version',
        description: 'Add heavy cream for a richer texture',
        modifications: {
          ingredients: ['Add 100ml heavy cream'],
          instructions: ['Mix cream with egg mixture before adding to pasta']
        }
      }
    ],
    notes: [
      'The key is to work quickly to prevent the eggs from scrambling',
      'Use the pasta water to create a silky sauce',
      'Freshly grated cheese makes all the difference'
    ],
    rating: 4.8,
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    difficulty: 'Medium',
    tags: ['Italian', 'Pasta', 'Quick', 'Comfort Food'],
    author: 'Chef Marco',
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Orange Glazed Salmon',
    description: 'Pan-seared salmon with a sweet and tangy orange glaze',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
    ingredients: [
      '4 salmon fillets (6oz each)',
      '1 cup fresh orange juice',
      '2 tbsp honey',
      '2 tbsp soy sauce',
      '1 tbsp fresh ginger, grated',
      '2 cloves garlic, minced',
      '2 tbsp olive oil',
      'Salt and pepper',
      'Fresh herbs for garnish'
    ],
    instructions: [
      'Season salmon fillets with salt and pepper',
      'Heat olive oil in a large skillet over medium-high heat',
      'Cook salmon for 4-5 minutes per side until golden',
      'In a small saucepan, combine orange juice, honey, soy sauce, ginger, and garlic',
      'Simmer until reduced by half, about 10 minutes',
      'Brush glaze over salmon and serve with fresh herbs'
    ],
    variants: [
      {
        id: '2-1',
        name: 'Spicy Version',
        description: 'Add red pepper flakes and sriracha for heat',
        modifications: {
          ingredients: ['Add 1 tsp red pepper flakes', 'Add 1 tbsp sriracha'],
          instructions: ['Mix sriracha and red pepper flakes into the glaze']
        }
      }
    ],
    notes: [
      'Don\'t overcook the salmon - it should be slightly pink in the center',
      'The glaze can be made ahead and reheated',
      'Serve with rice or roasted vegetables'
    ],
    rating: 4.6,
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    difficulty: 'Easy',
    tags: ['Seafood', 'Healthy', 'Asian-inspired', 'Gluten-free'],
    author: 'Chef Sarah',
    createdAt: new Date('2024-01-20')
  },
  {
    id: '3',
    name: 'Chocolate Orange Cake',
    description: 'Rich chocolate cake with orange zest and orange glaze',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
    ingredients: [
      '2 cups all-purpose flour',
      '1 3/4 cups sugar',
      '3/4 cup cocoa powder',
      '2 tsp baking powder',
      '1 tsp baking soda',
      '1 tsp salt',
      '2 eggs',
      '1 cup milk',
      '1/2 cup vegetable oil',
      '2 tsp vanilla extract',
      'Zest of 2 oranges',
      '1 cup boiling water'
    ],
    instructions: [
      'Preheat oven to 350°F (175°C)',
      'Grease and flour two 9-inch round cake pans',
      'Mix dry ingredients in a large bowl',
      'Add eggs, milk, oil, vanilla, and orange zest',
      'Beat on medium speed for 2 minutes',
      'Stir in boiling water (batter will be thin)',
      'Pour into prepared pans and bake for 30-35 minutes',
      'Cool in pans for 10 minutes, then remove to wire racks'
    ],
    variants: [
      {
        id: '3-1',
        name: 'Vegan Version',
        description: 'Replace eggs and milk with plant-based alternatives',
        modifications: {
          ingredients: ['Replace eggs with 2 flax eggs', 'Replace milk with almond milk'],
          instructions: ['Mix 2 tbsp ground flaxseed with 6 tbsp water, let sit 5 minutes']
        }
      }
    ],
    notes: [
      'The boiling water makes the cake incredibly moist',
      'Orange zest adds a bright, fresh flavor',
      'Perfect for special occasions'
    ],
    rating: 4.9,
    prepTime: 20,
    cookTime: 35,
    servings: 12,
    difficulty: 'Medium',
    tags: ['Dessert', 'Chocolate', 'Baking', 'Special Occasion'],
    author: 'Chef Maria',
    createdAt: new Date('2024-01-25')
  }
];