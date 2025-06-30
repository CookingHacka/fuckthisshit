import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Search, User, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-800"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left - Logo */}
          <motion.div 
            className="flex items-center space-x-2 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Lightbulb className="h-8 w-8 text-orange-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              SnackHack
            </span>
          </motion.div>

          {/* Center - Search (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <motion.div
                className={`flex items-center bg-gray-900 rounded-full transition-all duration-300 ${
                  isSearchFocused ? 'ring-2 ring-orange-500' : ''
                }`}
                animate={{ 
                  backgroundColor: isSearchFocused ? '#1f2937' : '#111827' 
                }}
              >
                <Search className="h-5 w-5 text-gray-400 ml-4" />
                <input
                  type="text"
                  placeholder="Search recipes, ingredients, cuisines..."
                  className="w-full bg-transparent text-white placeholder-gray-400 px-4 py-3 focus:outline-none"
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
              </motion.div>
            </div>
          </div>

          {/* Right - User Avatar & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Search Icon (Mobile) */}
            <button className="md:hidden p-2 text-gray-400 hover:text-white transition-colors">
              <Search className="h-6 w-6" />
            </button>

            {/* User Avatar */}
            <motion.button 
              className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <User className="h-6 w-6 text-gray-300" />
            </motion.button>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div 
            className="md:hidden border-t border-gray-800 py-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="space-y-4">
              <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search recipes..."
                  className="w-full bg-gray-900 text-white placeholder-gray-400 pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;