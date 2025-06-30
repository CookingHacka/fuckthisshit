import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import RecipeCard from './RecipeCard';
import RecipeModal from './RecipeModal';
import type { Recipe } from '../types/database';

interface RecipeCarouselProps {
  title: string;
  items: Recipe[];
  priority?: boolean;
}

const RecipeCarousel: React.FC<RecipeCarouselProps> = ({ 
  title, 
  items, 
  priority = false 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320; // Width of card + gap
      const currentScroll = scrollRef.current.scrollLeft;
      const targetScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      scrollRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  // Show placeholder cards when no items
  const displayItems = items.length > 0 ? items : Array(8).fill(null).map((_, index) => ({
    id: `placeholder-${index}`,
    title: 'Recipe Coming Soon',
    description: 'This recipe will be available soon',
    cuisine_id: null,
    meal_type: null,
    total_time_minutes: 30,
    servings: 4,
    notes: null,
    likes_count: 0,
    created_at: new Date().toISOString(),
    ingredient_count: null,
    cuisines: { name: 'Various' }
  }));

  return (
    <>
      <motion.section 
        className="mb-12 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <motion.h2 
              className="text-2xl font-bold text-white"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {title}
            </motion.h2>
            
            {/* Navigation Buttons */}
            <div className="hidden sm:flex space-x-2">
              <motion.button
                onClick={() => scroll('left')}
                className="p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-full transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="h-5 w-5 text-white" />
              </motion.button>
              <motion.button
                onClick={() => scroll('right')}
                className="p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-full transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight className="h-5 w-5 text-white" />
              </motion.button>
            </div>
          </div>

          {/* Carousel Container */}
          <div className="relative carousel-container">
            <div 
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {displayItems.map((recipe, index) => (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: priority ? index * 0.1 : index * 0.05,
                    duration: 0.5 
                  }}
                >
                  <RecipeCard 
                    recipe={recipe} 
                    onRecipeClick={handleRecipeClick}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Empty State Message */}
          {items.length === 0 && (
            <motion.div 
              className="text-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-gray-400 text-sm">
                No recipes found for this category yet
              </p>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Recipe Modal */}
      <RecipeModal
        recipe={selectedRecipe}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default RecipeCarousel;