import { useState, useEffect } from 'react';
import { getRecipeImageWithFallback } from '../utils/imageUtils';

interface UseRecipeImageReturn {
  imageUrl: string;
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook to manage recipe image loading from Supabase Storage
 * @param recipeTitle - The title of the recipe to load image for
 * @returns Object containing imageUrl, loading state, and error
 */
export const useRecipeImage = (recipeTitle: string): UseRecipeImageReturn => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadImage = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const url = await getRecipeImageWithFallback(recipeTitle);
        
        if (isMounted) {
          setImageUrl(url);
        }
      } catch (err) {
        console.error('Error loading recipe image:', err);
        
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load image');
          // Fallback to local generic image
          setImageUrl('/recipes-images/GenericRecipeImage.png');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (recipeTitle) {
      loadImage();
    }

    return () => {
      isMounted = false;
    };
  }, [recipeTitle]);

  return {
    imageUrl,
    loading,
    error
  };
};