import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, Sun, Moon, Bell, User } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import NotificationsModal from './NotificationsModal';

export default function Header({ toggleSidebar, isCollapsed }) {
  const { darkMode, toggleDarkMode, notifications } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = () => {
    setShowNotifications(true);
  };

  return (
    <>
    <motion.header 
      className="fixed top-0 right-0 h-16 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 z-30"
      style={{
        left: isCollapsed ? '4rem' : '16rem',
        boxShadow: darkMode 
          ? '0 4px 16px rgba(26, 26, 26, 0.3)' 
          : '0 4px 16px rgba(190, 190, 190, 0.3)'
      }}
      animate={{
        left: isCollapsed ? '4rem' : '16rem'
      }}
      transition={{ duration: 0.3 }}
    >
      {/* Left side */}
      <div className="flex items-center space-x-4">
        <motion.button
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          style={{
            boxShadow: darkMode 
              ? '4px 4px 8px #1a1a1a, -4px -4px 8px #2e2e2e'
              : '4px 4px 8px #bebebe, -4px -4px 8px #ffffff'
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Menu className="w-5 h-5" />
        </motion.button>
        
        <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Sistema de Gestão
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <motion.button
          onClick={handleNotificationClick}
          className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors relative"
          style={{
            boxShadow: darkMode 
              ? '4px 4px 8px #1a1a1a, -4px -4px 8px #2e2e2e'
              : '4px 4px 8px #bebebe, -4px -4px 8px #ffffff'
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse font-medium">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </motion.button>

        {/* Dark Mode Toggle */}
        <motion.button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          style={{
            boxShadow: darkMode 
              ? '4px 4px 8px #1a1a1a, -4px -4px 8px #2e2e2e'
              : '4px 4px 8px #bebebe, -4px -4px 8px #ffffff'
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </motion.button>

        {/* User Profile */}
        <motion.button
          className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          style={{
            boxShadow: darkMode 
              ? '4px 4px 8px #1a1a1a, -4px -4px 8px #2e2e2e'
              : '4px 4px 8px #bebebe, -4px -4px 8px #ffffff'
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <User className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.header>

    {/* Notifications Modal */}
    <NotificationsModal 
      isOpen={showNotifications} 
      onClose={() => setShowNotifications(false)} 
    />
  </>
  );
}
