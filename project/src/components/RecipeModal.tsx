import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, ChefHat, Users, Heart, Bookmark } from 'lucide-react';
import { useRecipeDetails } from '../hooks/useRecipeDetails';
import type { Recipe } from '../types/database';

interface RecipeModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
}

const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, isOpen, onClose }) => {
  const { 
    recipe: detailedRecipe, 
    loading, 
    error, 
    toggleLike, 
    toggleSaved, 
    isLiked, 
    isSaved 
  } = useRecipeDetails(recipe?.id || null);

  if (!isOpen || !recipe) return null;

  const formatTime = (minutes: number | null): string => {
    if (!minutes) return '30 minutes';
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const getDifficultyFromTime = (timeMinutes: number | null): string => {
    if (!timeMinutes) return 'Medium';
    if (timeMinutes <= 15) return 'Easy';
    if (timeMinutes <= 45) return 'Medium';
    return 'Hard';
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-6 border-b border-gray-800">
            <div className="flex justify-between items-start">
              <div className="flex-1 pr-4">
                <h2 className="text-3xl font-bold text-white mb-2">{recipe.title}</h2>
                {recipe.description && (
                  <p className="text-gray-300 text-lg">{recipe.description}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-2"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Recipe Stats */}
            <div className="flex items-center space-x-6 mt-4 text-gray-300">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>{formatTime(recipe.total_time_minutes)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <ChefHat className="h-5 w-5" />
                <span>{getDifficultyFromTime(recipe.total_time_minutes)}</span>
              </div>
              {recipe.servings && (
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>{recipe.servings} servings</span>
                </div>
              )}
              {recipe.cuisines && (
                <div>
                  <span className="text-orange-400">{recipe.cuisines.name}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4 mt-4">
              <motion.button
                onClick={toggleLike}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isLiked
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart className={`h-5 w-5 ${isLiked ? 'fill-white' : ''}`} />
                <span>{isLiked ? 'Liked' : 'Like'}</span>
                <span className="text-sm">({recipe.likes_count})</span>
              </motion.button>

              <motion.button
                onClick={toggleSaved}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isSaved
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-white' : ''}`} />
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                <p className="text-gray-400 mt-2">Loading recipe details...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-8">
                <p className="text-red-400">Error loading recipe details: {error}</p>
              </div>
            )}

            {detailedRecipe && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Ingredients */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Ingredients</h3>
                  {detailedRecipe.recipe_ingredients && detailedRecipe.recipe_ingredients.length > 0 ? (
                    <ul className="space-y-2">
                      {detailedRecipe.recipe_ingredients
                        .sort((a, b) => (a.is_optional ? 1 : 0) - (b.is_optional ? 1 : 0))
                        .map((ingredient, index) => (
                          <li key={index} className="flex items-start space-x-2 text-gray-300">
                            <span className="text-orange-400 mt-1">•</span>
                            <span>
                              {ingredient.amount && `${ingredient.amount} `}
                              {ingredient.descriptor && `${ingredient.descriptor} `}
                              <span className="font-medium">{ingredient.ingredients.name}</span>
                              {ingredient.is_optional && (
                                <span className="text-gray-500 text-sm ml-1">(optional)</span>
                              )}
                            </span>
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400">No ingredients listed</p>
                  )}

                  {/* Tools */}
                  {detailedRecipe.recipe_tools && detailedRecipe.recipe_tools.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold text-white mb-2">Equipment</h4>
                      <div className="flex flex-wrap gap-2">
                        {detailedRecipe.recipe_tools.map((tool, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm"
                          >
                            {tool.tools.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Instructions */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Instructions</h3>
                  {detailedRecipe.recipe_steps && detailedRecipe.recipe_steps.length > 0 ? (
                    <ol className="space-y-4">
                      {detailedRecipe.recipe_steps
                        .sort((a, b) => (a.step_number || 0) - (b.step_number || 0))
                        .map((step, index) => (
                          <li key={index} className="flex space-x-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                              {step.step_number || index + 1}
                            </span>
                            <p className="text-gray-300 leading-relaxed">{step.instruction}</p>
                          </li>
                        ))}
                    </ol>
                  ) : (
                    <p className="text-gray-400">No instructions available</p>
                  )}
                </div>
              </div>
            )}

            {/* Tags */}
            {detailedRecipe?.recipe_tags && detailedRecipe.recipe_tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-800">
                <h4 className="text-lg font-semibold text-white mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {detailedRecipe.recipe_tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-orange-600/20 text-orange-400 rounded-full text-sm border border-orange-600/30"
                    >
                      {tag.tags.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {recipe.notes && (
              <div className="mt-8 pt-6 border-t border-gray-800">
                <h4 className="text-lg font-semibold text-white mb-3">Notes</h4>
                <p className="text-gray-300 leading-relaxed">{recipe.notes}</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RecipeModal;