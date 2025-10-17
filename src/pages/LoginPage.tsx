import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FoodImageCollage from '../components/FoodImageCollage';
import '../styles/LoginPage.css';


const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: 'admin@gmail.com',
    password: 'admin'
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      // Check for admin credentials
      if (formData.email === 'admin@gmail.com' && formData.password === 'admin') {
        navigate('/recommended');
      } else {
        // For demo purposes, any other email/password combination also works
        if (formData.email && formData.password) {
          navigate('/recommended');
        }
      }
    }, 1000);
  };

  return (
    <div className="login-wrapper">
      {/* Animated background elements */}
      <div className="login-background">
        <div className="login-background-circle login-background-circle-top"></div>
        <div className="login-background-circle login-background-circle-bottom"></div>
      </div>
      
      <div className="login-container">
        <div className="login-header">
          <div className="login-logo">
            <svg className="login-logo-icon" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <h2 className="login-title">Welcome to VanadisHeart</h2>
          <p className="login-subtitle">Your culinary journey starts here</p>
          <p className="login-description">Discover, cook, and share amazing recipes</p>
        </div>

        <div className="login-card">
          <div className="card-body">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="form-group transform transition-all duration-300 focus-within:scale-102">
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="form-input transition-all duration-300 focus:shadow-lg focus:border-primary-pastel focus:ring-2 focus:ring-primary-pastel/50"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group transform transition-all duration-300 focus-within:scale-102">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="form-input transition-all duration-300 focus:shadow-lg focus:border-primary-pastel focus:ring-2 focus:ring-primary-pastel/50"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-pastel focus:ring-primary-pastel border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-primary-pastel hover:text-primary-pastel-dark">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary w-full"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 icon-md text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </div>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <a href="#" className="font-medium text-primary-pastel hover:text-primary-pastel-dark">
                    Sign up here
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Demo: Use admin@gmail.com / admin or any email and password to sign in
          </p>
        </div>
      </div>

      {/* Add the food image collage */}
      <FoodImageCollage />
    </div>
  );
};

export default LoginPage;