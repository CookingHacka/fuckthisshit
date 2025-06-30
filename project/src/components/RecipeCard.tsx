import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChefHat, Heart, Play, Users } from 'lucide-react';
import { getRecipeImageWithFallback } from '../utils/imageUtils';
import type { Recipe } from '../types/database';

interface RecipeCardProps {
  recipe: Recipe;
  onRecipeClick?: (recipe: Recipe) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onRecipeClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isInMyList, setIsInMyList] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageLoading, setImageLoading] = useState(true);

  const handleAddToList = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsInMyList(!isInMyList);
    // TODO: Implement save/unsave functionality with authentication
  };

  const handleCardClick = () => {
    if (onRecipeClick) {
      onRecipeClick(recipe);
    }
  };

  // Load the recipe image from Supabase Storage
  useEffect(() => {
    const loadImage = async () => {
      try {
        setImageLoading(true);
        const url = await getRecipeImageWithFallback(recipe.title);
        setImageUrl(url);
      } catch (error) {
        console.error('Error loading recipe image:', error);
        // Fallback to local generic image if Supabase fails
        setImageUrl('/recipes-images/GenericRecipeImage.png');
      } finally {
        setImageLoading(false);
      }
    };

    loadImage();
  }, [recipe.title]);

  const getDifficultyFromTime = (timeMinutes: number | null): string => {
    if (!timeMinutes) return 'Medium';
    if (timeMinutes <= 15) return 'Easy';
    if (timeMinutes <= 45) return 'Medium';
    return 'Hard';
  };

  const formatTime = (minutes: number | null): string => {
    if (!minutes) return '30min';
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  return (
    <motion.div
      className="recipe-card group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      {/* Recipe Image */}
      <div className="relative w-full h-full overflow-hidden rounded-lg">
        {imageLoading ? (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              // Final fallback to local image if Supabase image fails to load
              const target = e.target as HTMLImageElement;
              target.src = '/recipes-images/GenericRecipeImage.png';
            }}
          />
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Recipe Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
            {recipe.title}
          </h3>
          
          <div className="flex items-center space-x-4 text-gray-300 text-sm">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{formatTime(recipe.total_time_minutes)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ChefHat className="h-4 w-4" />
              <span>{getDifficultyFromTime(recipe.total_time_minutes)}</span>
            </div>
            {recipe.servings && (
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{recipe.servings}</span>
              </div>
            )}
          </div>
          
          {recipe.cuisines && (
            <div className="mt-1">
              <span className="text-orange-400 text-sm">{recipe.cuisines.name}</span>
            </div>
          )}
        </div>

        {/* Hover Overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute inset-0 bg-black/60 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col items-center space-y-3">
                {/* Play Button */}
                <motion.button
                  className="bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick();
                  }}
                >
                  <Play className="h-6 w-6 text-white fill-white" />
                </motion.button>

                {/* Add to My List Button */}
                <motion.button
                  onClick={handleAddToList}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isInMyList
                      ? 'bg-red-600 text-white'
                      : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart 
                    className={`h-4 w-4 ${isInMyList ? 'fill-white' : ''}`} 
                  />
                  <span>{isInMyList ? 'In My List' : 'Add to My List'}</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default RecipeCard;