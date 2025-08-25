import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Monitor } from 'lucide-react';
import NeuButton from './NeuButton';
import NeuCard from './NeuCard';
import { useApp } from '../../contexts/AppContext';

export default function PWAInstallPrompt() {
  const { darkMode } = useApp();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    // Debug: Verificar se está em standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        window.navigator.standalone === true ||
                        (window.navigator.standalone === false && window.outerHeight - window.innerHeight < 50);
    
    // Verificar se é Chrome ou Edge
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    const isEdge = /Edg/.test(navigator.userAgent);
    const isSupportedBrowser = isChrome || isEdge;
    
    console.log('PWA Debug Info:', {
      isStandalone,
      isChrome,
      isEdge,
      isSupportedBrowser,
      userAgent: navigator.userAgent,
      isSecure: location.protocol === 'https:' || location.hostname === 'localhost',
      hasServiceWorker: 'serviceWorker' in navigator,
      windowInfo: {
        outerHeight: window.outerHeight,
        innerHeight: window.innerHeight,
        difference: window.outerHeight - window.innerHeight
      }
    });

    // Se já está instalado, não mostrar prompt
    if (isStandalone) {
      console.log('App já está instalado como PWA');
      return;
    }

    // Função para verificar se o PWA é instálavel
    const checkPWAInstallability = () => {
      const hasManifest = document.querySelector('link[rel="manifest"]');
      const hasServiceWorker = 'serviceWorker' in navigator;
      const isHTTPS = location.protocol === 'https:' || location.hostname === 'localhost';
      
      console.log('PWA Installability Check:', {
        hasManifest: !!hasManifest,
        hasServiceWorker,
        isHTTPS,
        canInstall: hasManifest && hasServiceWorker && isHTTPS
      });
      
      return hasManifest && hasServiceWorker && isHTTPS;
    };

    // Verificar se atende aos critérios básicos
    const isPWACompatible = checkPWAInstallability();

    // Listener para beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      console.log('beforeinstallprompt event triggered');
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      setDebugInfo('Event captured');
      
      // Mostrar prompt após 3 segundos
      setTimeout(() => {
        console.log('Showing install prompt');
        setShowPrompt(true);
      }, 3000);
    };

    // Listener para quando app é instalado
    const handleAppInstalled = (e) => {
      console.log('App foi instalado!', e);
      setShowPrompt(false);
      setDeferredPrompt(null);
      setIsInstallable(false);
      
      // Toast de sucesso
      if (typeof window !== 'undefined') {
        const toast = document.createElement('div');
        toast.innerHTML = `
          <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
          ">
            ✅ App instalado com sucesso!
          </div>
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
          if (toast.parentNode) {
            toast.remove();
          }
        }, 3000);
      }
    };

    // Registrar listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Fallback: Chrome é mais restritivo, tentar múltiplas estratégias
    const fallbackTimer = setTimeout(() => {
      if (!deferredPrompt && !isStandalone && isPWACompatible) {
        console.log('Fallback: Mostrando prompt manual (sem evento beforeinstallprompt)');
        setDebugInfo('Manual prompt (no event detected)');
        setShowPrompt(true);
      }
    }, isChrome ? 5000 : 10000); // Chrome: 5s, outros: 10s

    // Fallback adicional para Chrome: tentar novamente após carregamento completo
    const additionalFallback = setTimeout(() => {
      if (!deferredPrompt && !isStandalone && isPWACompatible && isSupportedBrowser) {
        console.log('Fallback adicional: Forçando exibição do prompt');
        setDebugInfo('Forced manual prompt');
        setShowPrompt(true);
      }
    }, 15000);

    // Listener para quando a página termina de carregar completamente
    const handleLoad = () => {
      setTimeout(() => {
        if (!deferredPrompt && !isStandalone && isPWACompatible) {
          console.log('Página carregada: Verificando novamente possibilidade de instalação');
          // No Chrome, às vezes o evento demora mais
          if (isChrome) {
            setDebugInfo('Page loaded - Chrome retry');
            setShowPrompt(true);
          }
        }
      }, 3000);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('load', handleLoad);
      clearTimeout(fallbackTimer);
      clearTimeout(additionalFallback);
    };
  }, []);

  const handleInstall = async () => {
    console.log('handleInstall called', { deferredPrompt });
    
    if (deferredPrompt) {
      try {
        console.log('Prompting for install...');
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log('User choice:', outcome);
        
        setDeferredPrompt(null);
        setShowPrompt(false);
      } catch (error) {
        console.error('Erro ao instalar PWA:', error);
      }
    } else {
      // Fallback: Mostrar instruções manuais mais específicas
      console.log('Mostrando instruções manuais');
      const isChrome = /Chrome/.test(navigator.userAgent);
      const isEdge = /Edg/.test(navigator.userAgent);
      
      let instructions = '';
      if (isChrome) {
        instructions = `Para instalar no Chrome:\n\n` +
                      `1. Procure o ícone de instalação (➕ ou 📥) na barra de endereços\n` +
                      `2. Ou clique no menu (⋮) → "Instalar Sérgio PDV"\n` +
                      `3. Ou use Ctrl+Shift+A e procure "Instalar Sérgio PDV"\n\n` +
                      `Se não aparecer, verifique se:\n` +
                      `• Está usando HTTPS ou localhost\n` +
                      `• O site não foi visitado apenas uma vez\n` +
                      `• Não foi rejeitado anteriormente`;
      } else if (isEdge) {
        instructions = `Para instalar no Edge:\n\n` +
                      `1. Clique no menu (⋯) → "Aplicativos" → "Instalar este site como aplicativo"\n` +
                      `2. Ou procure o ícone + na barra de endereços`;
      } else {
        instructions = `Para instalar este app:\n\n` +
                      `Chrome/Edge: Menu (⋮) → "Instalar Sérgio PDV"\n` +
                      `Firefox: Menu → "Instalar esta aplicação"\n` +
                      `Safari: Compartilhar → "Adicionar à Tela de Início"`;
      }
      
      alert(instructions);
    }
  };

  const handleDismiss = () => {
    console.log('Prompt dismissed');
    setShowPrompt(false);
    // Não mostrar novamente nesta sessão
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  // Não mostrar se foi dismissado nesta sessão
  if (sessionStorage.getItem('pwa-prompt-dismissed')) {
    return null;
  }

  return (
    <>
      {/* Debug Info removido para produção */}

      <AnimatePresence>
        {showPrompt && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              // Só fechar se clicar no backdrop
              if (e.target === e.currentTarget) {
                handleDismiss();
              }
            }}
          >
            <motion.div
              className="w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <NeuCard darkMode={darkMode} className="text-center relative">
                <button
                  onClick={handleDismiss}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
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

                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <Smartphone className="w-4 h-4" />
                    <span>Acesso rápido</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <Monitor className="w-4 h-4" />
                    <span>Funciona offline</span>
                  </div>
                </div>

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

                {!deferredPrompt && (
                  <p className="text-xs text-gray-500 mt-3">
                    Ou use o menu do navegador para instalar
                  </p>
                )}
              </NeuCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}