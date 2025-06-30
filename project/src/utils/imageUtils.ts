import { supabase } from '../services/supabaseClient';

/**
 * Generates the public URL for a recipe image from Supabase Storage
 * @param recipeTitle - The title of the recipe
 * @returns Promise<string> - The public URL of the image or fallback to GenericRecipeImage.png
 */
export const getRecipeImageUrl = async (recipeTitle: string): Promise<string> => {
  try {
    // Clean the recipe title to match file naming convention
    const cleanTitle = recipeTitle.trim();
    const imageName = `${cleanTitle}.png`;
    
    // First, check if the specific recipe image exists
    const { data: imageExists } = await supabase.storage
      .from('recipe-images')
      .list('', {
        search: imageName
      });

    if (imageExists && imageExists.length > 0) {
      // Get the public URL for the recipe-specific image
      const { data } = supabase.storage
        .from('recipe-images')
        .getPublicUrl(imageName);
      
      return data.publicUrl;
    } else {
      // Fallback to generic image
      const { data } = supabase.storage
        .from('recipe-images')
        .getPublicUrl('GenericRecipeImage.png');
      
      return data.publicUrl;
    }
  } catch (error) {
    console.error('Error fetching recipe image:', error);
    
    // Final fallback to generic image
    const { data } = supabase.storage
      .from('recipe-images')
      .getPublicUrl('GenericRecipeImage.png');
    
    return data.publicUrl;
  }
};

/**
 * Preloads an image to check if it exists and is accessible
 * @param url - The image URL to check
 * @returns Promise<boolean> - True if image loads successfully
 */
export const checkImageExists = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

/**
 * Gets the recipe image URL with fallback handling
 * @param recipeTitle - The title of the recipe
 * @returns Promise<string> - The final image URL to use
 */
export const getRecipeImageWithFallback = async (recipeTitle: string): Promise<string> => {
  try {
    const imageUrl = await getRecipeImageUrl(recipeTitle);
    
    // Check if the image actually exists and is accessible
    const imageExists = await checkImageExists(imageUrl);
    
    if (imageExists) {
      return imageUrl;
    } else {
      // If the image doesn't load, use the generic fallback
      const { data } = supabase.storage
        .from('recipe-images')
        .getPublicUrl('GenericRecipeImage.png');
      
      return data.publicUrl;
    }
  } catch (error) {
    console.error('Error in getRecipeImageWithFallback:', error);
    
    // Final fallback
    const { data } = supabase.storage
      .from('recipe-images')
      .getPublicUrl('GenericRecipeImage.png');
    
    return data.publicUrl;
  }
};