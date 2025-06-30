import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface RealtimeStatus {
  isConnected: boolean;
  lastUpdate: Date | null;
  connectionCount: number;
}

interface UseRealtimeDataReturn {
  status: RealtimeStatus;
  subscribe: (table: string, callback: (payload: any) => void) => RealtimeChannel | null;
  unsubscribe: (channel: RealtimeChannel) => void;
}

export const useRealtimeData = (): UseRealtimeDataReturn => {
  const [status, setStatus] = useState<RealtimeStatus>({
    isConnected: false,
    lastUpdate: null,
    connectionCount: 0
  });

  const [channels, setChannels] = useState<RealtimeChannel[]>([]);

  useEffect(() => {
    const initializeRealtime = () => {
      try {
        // Subscribe to recipe changes for live updates
        const recipesChannel = supabase
          .channel('recipes-changes')
          .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'recipes' },
            (payload) => {
              console.log('Recipe updated:', payload);
              setStatus(prev => ({
                ...prev,
                lastUpdate: new Date()
              }));
            }
          )
          .on('postgres_changes',
            { event: '*', schema: 'public', table: 'recipe_likes' },
            (payload) => {
              console.log('Recipe likes updated:', payload);
              setStatus(prev => ({
                ...prev,
                lastUpdate: new Date()
              }));
            }
          )
          .on('CHANNEL_STATE', (state) => {
            console.log('Channel state changed:', state);
            if (state === 'SUBSCRIBED') {
              setStatus(prev => ({
                ...prev,
                isConnected: true,
                connectionCount: prev.connectionCount + 1
              }));
            } else if (state === 'CLOSED' || state === 'ERRORED') {
              setStatus(prev => ({
                ...prev,
                isConnected: false
              }));
            }
          })
          .subscribe();

        setChannels([recipesChannel]);

        return () => {
          recipesChannel.unsubscribe();
        };
      } catch (error) {
        console.error('Failed to initialize realtime connection:', error);
      }
    };

    const cleanup = initializeRealtime();
    return cleanup;
  }, []);

  const subscribe = (table: string, callback: (payload: any) => void): RealtimeChannel | null => {
    try {
      const channel = supabase
        .channel(`${table}-changes`)
        .on('postgres_changes', 
          { event: '*', schema: 'public', table },
          callback
        )
        .subscribe();

      setChannels(prev => [...prev, channel]);
      return channel;
    } catch (error) {
      console.error(`Failed to subscribe to ${table}:`, error);
      return null;
    }
  };

  const unsubscribe = (channel: RealtimeChannel) => {
    try {
      channel.unsubscribe();
      setChannels(prev => prev.filter(c => c !== channel));
    } catch (error) {
      console.error('Failed to unsubscribe from channel:', error);
    }
  };

  return {
    status,
    subscribe,
    unsubscribe
  };
};