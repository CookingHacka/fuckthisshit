import React from 'react';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import RecipeCarousel from './components/RecipeCarousel';
import RealtimeStatus from './components/RealtimeStatus';
import ErrorBoundary from './components/ErrorBoundary';
import { useRecipes } from './hooks/useRecipes';
import { useCuisines } from './hooks/useCuisines';

function App() {
  const { featuredRecipes, popularRecipes, quickRecipes, simpleRecipes } = useRecipes();
  const { cuisines } = useCuisines();

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-black text-white">
        <RealtimeStatus />
        <Navbar />
        
        <main className="pb-20">
          {/* Hero Section */}
          <motion.section 
            className="relative h-[70vh] bg-gradient-to-r from-orange-600/20 to-red-600/20 flex items-center justify-center mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center z-10">
              <motion.h1 
                className="text-6xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                SnackHack
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-300 max-w-2xl mx-auto"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Discover amazing recipes, master new techniques, and create culinary masterpieces
              </motion.p>
            </div>
            <div className="absolute inset-0 bg-black/40"></div>
          </motion.section>

          {/* Featured Recipes Carousel */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <RecipeCarousel 
              title="Featured Recipes" 
              items={featuredRecipes}
              priority={true}
            />
          </motion.div>

          {/* Most Popular Carousel */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <RecipeCarousel 
              title="Most Popular" 
              items={popularRecipes}
            />
          </motion.div>

          {/* Cuisine-based Carousels */}
          {cuisines.map((cuisine, index) => (
            <motion.div
              key={cuisine.id}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.0 + (index * 0.2), duration: 0.8 }}
            >
              <RecipeCarousel 
                title={`${cuisine.name} Cuisine`} 
                items={cuisine.recipes}
              />
            </motion.div>
          ))}

          {/* Quick Recipes Carousel */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
          >
            <RecipeCarousel 
              title="Under 30 Minutes" 
              items={quickRecipes}
            />
          </motion.div>

          {/* Simple Recipes Carousel */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.8 }}
          >
            <RecipeCarousel 
              title="4 Ingredients or Less" 
              items={simpleRecipes}
            />
          </motion.div>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;