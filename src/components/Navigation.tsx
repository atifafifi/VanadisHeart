import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiSearch,
  FiBookmark,
  FiShoppingCart,
  FiLogOut,
} from "react-icons/fi";
import "../styles/navigations.css";

interface NavigationProps {
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({ className = "" }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const navItems = [
    {
      path: "/recommended",
      label: "Home",
      icon: <FiHome />,
    },
    {
      path: "/search",
      label: "Search",
      icon: <FiSearch />,
    },
    {
      path: "/my-recipes",
      label: "My Recipes",
      icon: <FiBookmark />,
    },
    {
      path: "/shopping-list",
      label: "Shopping List",
      icon: <FiShoppingCart />,
    },
  ];

  return (
    <nav className={`top-navbar ${className}`}>
      <div className="navbar-container">
        {/* Logo/Brand */}
        <div className="navbar-brand">
          <h1 className="navbar-logo">VanadisHeart</h1>
        </div>

        {/* Navigation Items */}
        <div className="navbar-nav">
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`navbar-link ${isActive(item.path) ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <span className="navbar-icon">{item.icon}</span>
              <span className="navbar-label">{item.label}</span>
            </button>
          ))}
        </div>

        {/* User Actions */}
        <div className="navbar-actions">
          <button
            className="navbar-logout"
            onClick={() => {
              // Handle logout
              navigate("/login");
            }}
          >
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;