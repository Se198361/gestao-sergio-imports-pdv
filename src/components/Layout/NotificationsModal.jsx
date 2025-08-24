import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, ShoppingCart, RefreshCw, Package, Check, Trash2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import NeuCard from './NeuCard';
import NeuButton from './NeuButton';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const getNotificationIcon = (type) => {
  switch (type) {
    case 'low_stock':
      return <AlertTriangle className="w-5 h-5 text-red-500" />;
    case 'sale':
      return <ShoppingCart className="w-5 h-5 text-green-500" />;
    case 'exchange':
      return <RefreshCw className="w-5 h-5 text-blue-500" />;
    default:
      return <Package className="w-5 h-5 text-gray-500" />;
  }
};

const getNotificationBgColor = (type, read, darkMode) => {
  if (read) {
    return darkMode ? 'bg-gray-800' : 'bg-gray-100';
  }
  
  switch (type) {
    case 'low_stock':
      return darkMode ? 'bg-red-900/20' : 'bg-red-50';
    case 'sale':
      return darkMode ? 'bg-green-900/20' : 'bg-green-50';
    case 'exchange':
      return darkMode ? 'bg-blue-900/20' : 'bg-blue-50';
    default:
      return darkMode ? 'bg-gray-800' : 'bg-gray-100';
  }
};

export default function NotificationsModal({ isOpen, onClose }) {
  const { 
    darkMode, 
    notifications, 
    markNotificationRead, 
    removeNotification, 
    clearAllNotifications 
  } = useApp();

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (notificationId) => {
    markNotificationRead(notificationId);
  };

  const handleRemove = (notificationId) => {
    removeNotification(notificationId);
  };

  const handleClearAll = () => {
    clearAllNotifications();
  };

  const sortedNotifications = [...notifications].sort((a, b) => {
    // Primeiro por não lidas, depois por timestamp
    if (a.read !== b.read) {
      return a.read ? 1 : -1;
    }
    return new Date(b.timestamp) - new Date(a.timestamp);
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 pt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-md mx-4"
            initial={{ scale: 0.9, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <NeuCard darkMode={darkMode} className="max-h-[80vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                    Notificações
                  </h2>
                  {unreadCount > 0 && (
                    <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Actions */}
              {notifications.length > 0 && (
                <div className="flex gap-2 mb-4">
                  <NeuButton
                    darkMode={darkMode}
                    variant="secondary"
                    size="sm"
                    onClick={handleClearAll}
                    className="flex-1"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Limpar Todas
                  </NeuButton>
                </div>
              )}

              {/* Notifications List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {sortedNotifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Nenhuma notificação no momento
                    </p>
                  </div>
                ) : (
                  sortedNotifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      className={`p-4 rounded-lg border transition-all ${getNotificationBgColor(
                        notification.type,
                        notification.read,
                        darkMode
                      )} ${
                        notification.read
                          ? 'border-gray-200 dark:border-gray-700'
                          : 'border-current'
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className={`text-sm font-medium ${
                                notification.read 
                                  ? 'text-gray-600 dark:text-gray-400' 
                                  : 'text-gray-800 dark:text-gray-200'
                              }`}>
                                {notification.title}
                              </h3>
                              <p className={`text-xs mt-1 ${
                                notification.read 
                                  ? 'text-gray-500 dark:text-gray-500' 
                                  : 'text-gray-600 dark:text-gray-300'
                              }`}>
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-2">
                                {format(new Date(notification.timestamp), "dd/MM/yyyy 'às' HH:mm", { 
                                  locale: ptBR 
                                })}
                              </p>
                            </div>
                            <div className="flex items-center space-x-1 ml-2">
                              {!notification.read && (
                                <button
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  className="p-1 rounded text-green-500 hover:bg-green-100 dark:hover:bg-green-900 transition-colors"
                                  title="Marcar como lida"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => handleRemove(notification.id)}
                                className="p-1 rounded text-red-500 hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                                title="Remover notificação"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </NeuCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}