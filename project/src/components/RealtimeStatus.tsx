import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, Database } from 'lucide-react';
import { useRealtimeData } from '../hooks/useRealtimeData';

const RealtimeStatus: React.FC = () => {
  const { status } = useRealtimeData();
  const [showStatus, setShowStatus] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowStatus(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {showStatus && (
        <motion.div
          className="fixed top-20 right-4 z-40 bg-gray-900/90 backdrop-blur-sm rounded-lg p-3 border border-gray-700"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              {status.isConnected ? (
                <>
                  <Wifi className="h-4 w-4 text-green-500" />
                  <Database className="h-4 w-4 text-green-500" />
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-gray-500" />
                  <Database className="h-4 w-4 text-gray-500" />
                </>
              )}
            </div>
            <div className="text-sm">
              <div className={`font-medium ${status.isConnected ? 'text-green-400' : 'text-gray-400'}`}>
                {status.isConnected ? 'Connected' : 'Connecting...'}
              </div>
              <div className="text-xs text-gray-500">
                Supabase {status.isConnected ? 'realtime active' : 'initializing'}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RealtimeStatus;