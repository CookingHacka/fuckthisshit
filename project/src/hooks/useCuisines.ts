import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import type { Cuisine, Recipe } from '../types/database';

interface CuisineWithRecipes extends Cuisine {
  recipes: Recipe[];
}

interface UseCuisinesReturn {
  cuisines: CuisineWithRecipes[];
  loading: boolean;
  error: string | null;
}

export const useCuisines = (): UseCuisinesReturn => {
  const [cuisines, setCuisines] = useState<CuisineWithRecipes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCuisines = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch cuisines with their recipes
        const { data: cuisinesData, error: cuisinesError } = await supabase
          .from('cuisines')
          .select(`
            *,
            recipes (
              *,
              cuisines (name)
            )
          `)
          .limit(5);

        if (cuisinesError) throw cuisinesError;

        // Transform the data to match our interface
        const cuisinesWithRecipes: CuisineWithRecipes[] = (cuisinesData || []).map(cuisine => ({
          ...cuisine,
          recipes: (cuisine.recipes || []).slice(0, 10) // Limit to 10 recipes per cuisine
        }));

        setCuisines(cuisinesWithRecipes);
      } catch (err) {
        console.error('Error fetching cuisines:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch cuisines');
      } finally {
        setLoading(false);
      }
    };

    fetchCuisines();
  }, []);

  return {
    cuisines,
    loading,
    error
  };
};