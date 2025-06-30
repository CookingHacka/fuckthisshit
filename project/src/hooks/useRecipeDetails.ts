import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import type { Recipe } from '../types/database';

interface UseRecipeDetailsReturn {
  recipe: Recipe | null;
  loading: boolean;
  error: string | null;
  toggleLike: () => Promise<void>;
  toggleSaved: () => Promise<void>;
  isLiked: boolean;
  isSaved: boolean;
}

export const useRecipeDetails = (recipeId: string | null): UseRecipeDetailsReturn => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!recipeId) {
      setRecipe(null);
      return;
    }

    const fetchRecipeDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('recipes')
          .select(`
            *,
            cuisines (name),
            recipe_ingredients (
              amount,
              descriptor,
              is_optional,
              ingredients (name)
            ),
            recipe_steps (
              step_number,
              instruction
            ),
            recipe_tags (
              tags (name)
            ),
            recipe_tools (
              tools (name)
            )
          `)
          .eq('id', recipeId)
          .single();

        if (fetchError) throw fetchError;

        setRecipe(data);
      } catch (err) {
        console.error('Error fetching recipe details:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch recipe details');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [recipeId]);

  const toggleLike = async () => {
    if (!recipe) return;

    try {
      // Note: This would require authentication to work properly
      // For now, just toggle the local state
      setIsLiked(!isLiked);
      console.log('Like toggled for recipe:', recipe.id);
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const toggleSaved = async () => {
    if (!recipe) return;

    try {
      // Note: This would require authentication to work properly
      // For now, just toggle the local state
      setIsSaved(!isSaved);
      console.log('Saved toggled for recipe:', recipe.id);
    } catch (err) {
      console.error('Error toggling saved:', err);
    }
  };

  return {
    recipe,
    loading,
    error,
    toggleLike,
    toggleSaved,
    isLiked,
    isSaved
  };
};