import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import LoginPage from './pages/LoginPage';
import RecommendedRecipesPage from './pages/RecommendedRecipesPage';
import RecipeDetailsPage from './pages/RecipeDetailsPage';
import SearchRecipesPage from './pages/SearchRecipesPage';
import MyRecipesPage from './pages/MyRecipesPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex">
        <Navigation />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/recommended" element={<RecommendedRecipesPage />} />
            <Route path="/recipe/:id" element={<RecipeDetailsPage />} />
            <Route path="/search" element={<SearchRecipesPage />} />
            <Route path="/my-recipes" element={<MyRecipesPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;