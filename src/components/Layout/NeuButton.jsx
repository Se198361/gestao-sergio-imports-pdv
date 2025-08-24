import React from 'react';
import { motion } from 'framer-motion';

export default function NeuButton({ 
  children, 
  onClick, 
  className = '', 
  darkMode, 
  variant = 'default', 
  size = 'md',
  disabled = false,
  neon = false,
  ...props 
}) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 text-sm';
      case 'lg':
        return 'px-6 py-4 text-lg';
      default:
        return 'px-4 py-3';
    }
  };

  const getVariantClasses = () => {
    if (neon) {
      return 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border border-neon-blue';
    }
    
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-blue-500 to-purple-600 text-white';
      case 'secondary':
        return 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
      case 'danger':
        return 'bg-gradient-to-r from-red-500 to-pink-600 text-white';
      case 'success':
        return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white';
      default:
        return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
    }
  };

  const getBoxShadow = () => {
    if (disabled) {
      return darkMode 
        ? 'inset 4px 4px 8px #1a1a1a, inset -4px -4px 8px #2e2e2e'
        : 'inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff';
    }

    if (neon) {
      return '0 0 20px rgba(0, 240, 255, 0.3), 4px 4px 8px rgba(0, 0, 0, 0.2)';
    }

    return darkMode 
      ? '4px 4px 8px #1a1a1a, -4px -4px 8px #2e2e2e'
      : '4px 4px 8px #bebebe, -4px -4px 8px #ffffff';
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`${getSizeClasses()} ${getVariantClasses()} rounded-lg font-medium transition-all duration-200 ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
      } ${className}`}
      style={{
        boxShadow: getBoxShadow()
      }}
      whileHover={!disabled ? { 
        scale: 1.02,
        boxShadow: neon 
          ? '0 0 30px rgba(0, 240, 255, 0.5), 6px 6px 12px rgba(0, 0, 0, 0.3)'
          : darkMode 
            ? '6px 6px 12px #1a1a1a, -6px -6px 12px #2e2e2e'
            : '6px 6px 12px #bebebe, -6px -6px 12px #ffffff'
      } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={{ duration: 0.1 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
