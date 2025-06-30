import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import type { Recipe } from '../types/database';

interface UseRecipesReturn {
  featuredRecipes: Recipe[];
  popularRecipes: Recipe[];
  quickRecipes: Recipe[];
  simpleRecipes: Recipe[];
  loading: boolean;
  error: string | null;
}

export const useRecipes = (): UseRecipesReturn => {
  const [featuredRecipes, setFeaturedRecipes] = useState<Recipe[]>([]);
  const [popularRecipes, setPopularRecipes] = useState<Recipe[]>([]);
  const [quickRecipes, setQuickRecipes] = useState<Recipe[]>([]);
  const [simpleRecipes, setSimpleRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch featured recipes (first 10 recipes with highest likes)
        const { data: featured, error: featuredError } = await supabase
          .from('recipes')
          .select(`
            *,
            cuisines (name)
          `)
          .order('likes_count', { ascending: false })
          .limit(10);

        if (featuredError) throw featuredError;

        // Fetch popular recipes (recipes with most likes)
        const { data: popular, error: popularError } = await supabase
          .from('recipes')
          .select(`
            *,
            cuisines (name)
          `)
          .order('likes_count', { ascending: false })
          .range(10, 19);

        if (popularError) throw popularError;

        // Fetch quick recipes (under 30 minutes)
        const { data: quick, error: quickError } = await supabase
          .from('recipes')
          .select(`
            *,
            cuisines (name)
          `)
          .lte('total_time_minutes', 30)
          .not('total_time_minutes', 'is', null)
          .order('total_time_minutes', { ascending: true })
          .limit(10);

        if (quickError) throw quickError;

        // Fetch simple recipes (4 ingredients or less)
        const { data: simple, error: simpleError } = await supabase
          .from('recipes')
          .select(`
            *,
            cuisines (name)
          `)
          .lte('ingredient_count', 4)
          .not('ingredient_count', 'is', null)
          .order('ingredient_count', { ascending: true })
          .limit(10);

        if (simpleError) throw simpleError;

        setFeaturedRecipes(featured || []);
        setPopularRecipes(popular || []);
        setQuickRecipes(quick || []);
        setSimpleRecipes(simple || []);
      } catch (err) {
        console.error('Error fetching recipes:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch recipes');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  return {
    featuredRecipes,
    popularRecipes,
    quickRecipes,
    simpleRecipes,
    loading,
    error
  };
};