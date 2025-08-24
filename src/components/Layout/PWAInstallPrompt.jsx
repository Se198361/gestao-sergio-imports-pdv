import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import NeuButton from './NeuButton';
import NeuCard from './NeuCard';
import { useApp } from '../../contexts/AppContext';

export default function PWAInstallPrompt() {
  const { darkMode } = useApp();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => setShowPrompt(true), 5000);
    };

    const handleAppInstalled = () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  if (sessionStorage.getItem('pwa-prompt-dismissed')) return null;

  return (
    <AnimatePresence>
      {showPrompt && deferredPrompt && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <NeuCard darkMode={darkMode} className="text-center">
              <button
                onClick={handleDismiss}
                className="float-right text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Download className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                Instalar Sérgio PDV
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Instale nosso app para acesso rápido e trabalho offline!
              </p>

              <div className="flex space-x-3">
                <NeuButton
                  darkMode={darkMode}
                  variant="secondary"
                  onClick={handleDismiss}
                  className="flex-1"
                >
                  Agora não
                </NeuButton>
                <NeuButton
                  darkMode={darkMode}
                  variant="primary"
                  onClick={handleInstall}
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Instalar
                </NeuButton>
              </div>
            </NeuCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}