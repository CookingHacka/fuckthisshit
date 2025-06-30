export interface Database {
  public: {
    Tables: {
      recipes: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          cuisine_id: string | null;
          meal_type: string | null;
          total_time_minutes: number | null;
          servings: number | null;
          notes: string | null;
          likes_count: number;
          created_at: string | null;
          ingredient_count: number | null;
        };
        Insert: Omit<Database['public']['Tables']['recipes']['Row'], 'id' | 'created_at' | 'likes_count'>;
        Update: Partial<Database['public']['Tables']['recipes']['Insert']>;
      };
      cuisines: {
        Row: {
          id: string;
          name: string;
        };
        Insert: Omit<Database['public']['Tables']['cuisines']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['cuisines']['Insert']>;
      };
      ingredients: {
        Row: {
          id: string;
          name: string;
        };
        Insert: Omit<Database['public']['Tables']['ingredients']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['ingredients']['Insert']>;
      };
      recipe_ingredients: {
        Row: {
          recipe_id: string;
          ingredient_id: string;
          amount: string | null;
          descriptor: string | null;
          is_optional: boolean | null;
        };
        Insert: Database['public']['Tables']['recipe_ingredients']['Row'];
        Update: Partial<Database['public']['Tables']['recipe_ingredients']['Insert']>;
      };
      recipe_steps: {
        Row: {
          id: string;
          recipe_id: string | null;
          step_number: number | null;
          instruction: string | null;
        };
        Insert: Omit<Database['public']['Tables']['recipe_steps']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['recipe_steps']['Insert']>;
      };
      recipe_likes: {
        Row: {
          id: string;
          recipe_id: string | null;
          user_id: string | null;
          liked_at: string;
        };
        Insert: Omit<Database['public']['Tables']['recipe_likes']['Row'], 'id' | 'liked_at'>;
        Update: Partial<Database['public']['Tables']['recipe_likes']['Insert']>;
      };
      user_saved_recipes: {
        Row: {
          id: string;
          user_id: string | null;
          recipe_id: string | null;
          saved_at: string;
        };
        Insert: Omit<Database['public']['Tables']['user_saved_recipes']['Row'], 'id' | 'saved_at'>;
        Update: Partial<Database['public']['Tables']['user_saved_recipes']['Insert']>;
      };
      tags: {
        Row: {
          id: string;
          name: string;
        };
        Insert: Omit<Database['public']['Tables']['tags']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['tags']['Insert']>;
      };
      tools: {
        Row: {
          id: string;
          name: string;
        };
        Insert: Omit<Database['public']['Tables']['tools']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['tools']['Insert']>;
      };
    };
  };
}

export type Recipe = Database['public']['Tables']['recipes']['Row'] & {
  cuisines?: { name: string } | null;
  recipe_ingredients?: Array<{
    amount: string | null;
    descriptor: string | null;
    is_optional: boolean | null;
    ingredients: { name: string };
  }>;
  recipe_steps?: Array<{
    step_number: number | null;
    instruction: string | null;
  }>;
  recipe_tags?: Array<{
    tags: { name: string };
  }>;
  recipe_tools?: Array<{
    tools: { name: string };
  }>;
};

export type Cuisine = Database['public']['Tables']['cuisines']['Row'];
export type Ingredient = Database['public']['Tables']['ingredients']['Row'];
export type Tag = Database['public']['Tables']['tags']['Row'];
export type Tool = Database['public']['Tables']['tools']['Row'];