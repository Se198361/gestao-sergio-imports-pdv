// 🔍 DIAGNÓSTICO PWA - Cole no Console do Chrome (F12)

console.log('🔍 === DIAGNÓSTICO PWA ===');

// 1. Verificar se beforeinstallprompt é suportado
if ('beforeinstallprompt' in window) {
  console.log('✅ beforeinstallprompt: SUPORTADO');
} else {
  console.log('❌ beforeinstallprompt: NÃO SUPORTADO');
}

// 2. Verificar se já está instalado
if (window.matchMedia('(display-mode: standalone)').matches) {
  console.log('✅ App: JÁ ESTÁ INSTALADO');
} else {
  console.log('❌ App: NÃO está instalado');
}

// 3. Verificar Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    if (registrations.length > 0) {
      console.log('✅ Service Worker: REGISTRADO', registrations[0]);
    } else {
      console.log('❌ Service Worker: NÃO registrado');
    }
  });
} else {
  console.log('❌ Service Worker: NÃO suportado');
}

// 4. Verificar Manifest
fetch('/manifest.webmanifest')
  .then(response => {
    if (response.ok) {
      console.log('✅ Manifest: CARREGADO');
      return response.json();
    } else {
      console.log('❌ Manifest: ERRO ao carregar');
    }
  })
  .then(manifest => {
    if (manifest) {
      console.log('📄 Manifest dados:', manifest);
    }
  })
  .catch(error => {
    console.log('❌ Manifest: ERRO', error);
  });

// 5. Verificar HTTPS
if (location.protocol === 'https:' || location.hostname === 'localhost') {
  console.log('✅ Protocolo: SEGURO (HTTPS/localhost)');
} else {
  console.log('❌ Protocolo: INSEGURO (HTTP)');
}

// 6. Verificar navegador
const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
const isEdge = /Edg/.test(navigator.userAgent);
console.log('🌐 Navegador:', {
  Chrome: isChrome,
  Edge: isEdge,
  UserAgent: navigator.userAgent
});

console.log('🔍 === FIM DO DIAGNÓSTICO ===');

// 7. Forçar instalação se possível
setTimeout(() => {
  console.log('🔄 Tentando detectar evento de instalação...');
  
  // Simular evento para teste
  window.dispatchEvent(new Event('beforeinstallprompt'));
}, 2000);