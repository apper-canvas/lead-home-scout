import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import ViewToggle from "@/components/molecules/ViewToggle";
import Button from "@/components/atoms/Button";
import { AuthContext } from "../../App";

const Header = ({ 
  onSearch, 
  currentView, 
  onViewChange, 
  savedCount = 0,
  className 
}) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout } = useContext(AuthContext);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const navigation = [
    { name: "Browse", href: "/browse", icon: "Home" },
    { name: "Map View", href: "/map", icon: "Map" },
    { name: "Saved", href: "/saved", icon: "Heart", count: savedCount }
  ];

  const isActive = (href) => {
    return location.pathname === href || (href === "/browse" && location.pathname === "/");
  };

  return (
    <header className={cn("bg-white shadow-sm sticky top-0 z-50 backdrop-blur-sm", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Home" className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-gray-900">
              HomeScout
            </span>
          </Link>

          {/* Desktop Navigation */}
<div className="flex items-center space-x-4">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive(item.href)
                      ? "bg-primary-50 text-primary"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <ApperIcon name={item.icon} className="w-4 h-4" />
                  <span>{item.name}</span>
                  {item.count > 0 && (
                    <span className="ml-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {item.count}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            {/* User Menu and Logout */}
            {isAuthenticated && (
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.firstName?.charAt(0) || user?.emailAddress?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-700">
                    {user?.firstName || user?.emailAddress}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="flex items-center space-x-2"
                >
                  <ApperIcon name="LogOut" className="w-4 h-4" />
                  <span>Logout</span>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          >
            <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar and View Toggle */}
        <div className="pb-4 space-y-4">
          <SearchBar onSearch={onSearch} />
          <div className="flex items-center justify-between">
            <ViewToggle
              currentView={currentView}
              onViewChange={onViewChange}
            />
            <div className="text-sm text-gray-600">
              {/* Property count will be displayed here */}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <nav className="px-4 py-2 space-y-1">
{navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive(item.href)
                    ? "bg-primary-50 text-primary"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                <ApperIcon name={item.icon} className="w-4 h-4" />
                <span>{item.name}</span>
                {item.count > 0 && (
                  <span className="ml-auto bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {item.count}
                  </span>
                )}
              </Link>
            ))}
            
            {/* Mobile User Info and Logout */}
            {isAuthenticated && (
              <>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex items-center space-x-3 px-3 py-2">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user?.firstName?.charAt(0) || user?.emailAddress?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-700">
                      {user?.firstName || user?.emailAddress}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-left text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
                  >
                    <ApperIcon name="LogOut" className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;