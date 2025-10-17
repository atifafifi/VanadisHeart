import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import LoginPage from './pages/LoginPage';
import RecommendedRecipesPage from './pages/RecommendedRecipesPage';
import RecipeDetailsPage from './pages/RecipeDetailsPage';
import SearchRecipesPage from './pages/SearchRecipesPage';
import MyRecipesPage from './pages/MyRecipesPage';
import ShoppingListPage from './pages/ShoppingListPage';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/recommended" element={<RecommendedRecipesPage />} />
            <Route path="/recipe/:id" element={<RecipeDetailsPage />} />
            <Route path="/search" element={<SearchRecipesPage />} />
            <Route path="/my-recipes" element={<MyRecipesPage />} />
            <Route path="/shopping-list" element={<ShoppingListPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;