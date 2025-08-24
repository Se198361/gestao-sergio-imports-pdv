import React from 'react';
import { motion } from 'framer-motion';

export default function NeuCard({ 
  children, 
  className = '', 
  darkMode, 
  hover = true, 
  inset = false,
  neonBorder = false,
  ...props 
}) {
  const getBoxShadow = () => {
    if (neonBorder) {
      return '0 0 20px rgba(0, 240, 255, 0.3), inset 0 0 20px rgba(0, 240, 255, 0.1)';
    }
    
    if (inset) {
      return darkMode 
        ? 'inset 8px 8px 16px #1a1a1a, inset -8px -8px 16px #2e2e2e'
        : 'inset 8px 8px 16px #bebebe, inset -8px -8px 16px #ffffff';
    }
    
    return darkMode 
      ? '8px 8px 16px #1a1a1a, -8px -8px 16px #2e2e2e'
      : '8px 8px 16px #bebebe, -8px -8px 16px #ffffff';
  };

  return (
    <motion.div
      className={`bg-gray-100 dark:bg-gray-900 rounded-xl p-6 transition-all duration-300 ${
        neonBorder ? 'border border-neon-blue border-opacity-50' : ''
      } ${className}`}
      style={{
        boxShadow: getBoxShadow()
      }}
      whileHover={hover ? { 
        scale: 1.02,
        boxShadow: neonBorder 
          ? '0 0 30px rgba(0, 240, 255, 0.5), inset 0 0 30px rgba(0, 240, 255, 0.2)'
          : darkMode 
            ? '12px 12px 24px #1a1a1a, -12px -12px 24px #2e2e2e'
            : '12px 12px 24px #bebebe, -12px -12px 24px #ffffff'
      } : {}}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
