import React from 'react';
import { motion } from 'framer-motion';

export default function NeuInput({ 
  label, 
  error, 
  darkMode, 
  className = '', 
  neon = false,
  ...props 
}) {
  const getBoxShadow = () => {
    if (neon) {
      return '0 0 10px rgba(0, 240, 255, 0.2), inset 4px 4px 8px rgba(0, 0, 0, 0.1)';
    }
    
    return darkMode 
      ? 'inset 4px 4px 8px #1a1a1a, inset -4px -4px 8px #2e2e2e'
      : 'inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <motion.input
        className={`w-full px-4 py-3 bg-gray-100 dark:bg-gray-900 border-0 rounded-lg text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
          error ? 'ring-2 ring-red-500' : ''
        } ${neon ? 'border border-neon-blue border-opacity-30' : ''}`}
        style={{
          boxShadow: getBoxShadow()
        }}
        whileFocus={{
          boxShadow: neon 
            ? '0 0 20px rgba(0, 240, 255, 0.4), inset 4px 4px 8px rgba(0, 0, 0, 0.1)'
            : darkMode 
              ? 'inset 6px 6px 12px #1a1a1a, inset -6px -6px 12px #2e2e2e, 0 0 0 2px #3b82f6'
              : 'inset 6px 6px 12px #bebebe, inset -6px -6px 12px #ffffff, 0 0 0 2px #3b82f6'
        }}
        transition={{ duration: 0.2 }}
        {...props}
      />
      {error && (
        <motion.p 
          className="text-sm text-red-500"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
