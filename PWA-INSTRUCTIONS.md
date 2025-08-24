# 📱 PWA - Progressive Web App
## Sistema PDV Sérgio Imports

### 🚀 Como Instalar o PWA Localmente

#### **Método 1: Instalar via Navegador (Recomendado)**

1. **Abra o sistema** no navegador:
   - Desenvolvimento: `http://localhost:5174`
   - Produção: `http://localhost:4173`

2. **Aguarde o prompt de instalação** (aparece após 5 segundos)
   - Clique em "Instalar" quando o modal aparecer
   - Ou ignore clicando em "Agora não"

3. **Instalação manual** (se o prompt não aparecer):
   - **Chrome/Edge**: Clique no ícone de instalação na barra de endereços
   - **Firefox**: Menu → "Instalar esta aplicação"
   - **Safari**: Compartilhar → "Adicionar à Tela de Início"

#### **Método 2: Build Local**

```bash
# 1. Build para produção
npm run build

# 2. Preview da versão PWA
npm run preview

# 3. Acesse: http://localhost:4173
```

### ✨ Funcionalidades PWA

#### **🔄 Funciona Offline**
- Cache automático de todos os recursos
- Dados persistem localmente (IndexedDB)
- Funciona sem conexão à internet

#### **📱 Como App Nativo**
- Ícone na área de trabalho/menu iniciar
- Tela cheia (sem barra do navegador)
- Notificações do sistema
- Acesso rápido via atalho

#### **🔧 Recursos Avançados**
- Cache inteligente de imagens e fontes
- Atualizações automáticas em background
- Sincronização quando voltar online
- Otimizado para dispositivos móveis

### 📋 Requisitos do Sistema

#### **Navegadores Suportados**
- ✅ Chrome 67+
- ✅ Edge 79+
- ✅ Firefox 65+
- ✅ Safari 14+ (iOS/macOS)
- ✅ Samsung Internet 8.2+

#### **Sistemas Operacionais**
- ✅ Windows 10/11
- ✅ macOS 10.14+
- ✅ iOS 14+
- ✅ Android 8+
- ✅ Linux (Ubuntu/Debian)

### 🎯 Como Usar

#### **1. Primeira Execução**
- Dados de exemplo são criados automaticamente
- Sistema funciona completamente offline
- Todas as funcionalidades estão disponíveis

#### **2. Operação Diária**
- Use como um app normal no desktop/mobile
- Dados ficam salvos localmente
- Funciona mesmo sem internet

#### **3. Atualizações**
- App atualiza automaticamente quando há nova versão
- Dados locais são preservados
- Não perde nenhuma informação

### 🛠️ Solução de Problemas

#### **Problema: Prompt de instalação não aparece**
**Solução:**
```bash
# Limpar cache do navegador
Ctrl + Shift + Delete (Windows)
Cmd + Shift + Delete (Mac)

# Ou instalar manualmente via menu do navegador
```

#### **Problema: App não funciona offline**
**Solução:**
```bash
# Verificar se o Service Worker está ativo
F12 → Application → Service Workers
```

#### **Problema: Dados não persistem**
**Solução:**
```bash
# Verificar armazenamento local
F12 → Application → IndexedDB → gestao_pdv
```

### 📊 Arquivos PWA Gerados

```
dist/
├── manifest.webmanifest     # Configurações do PWA
├── sw.js                    # Service Worker (cache)
├── workbox-*.js            # Cache management
├── pwa-64x64.png           # Ícone 64x64
├── pwa-192x192.png         # Ícone 192x192
├── pwa-512x512.png         # Ícone 512x512
├── maskable-icon-*.png     # Ícone adaptativo
├── apple-touch-icon-*.png  # Ícone iOS
├── screenshot-*.png        # Screenshots para lojas
└── registerSW.js           # Registro do SW
```

### 🔐 Configurações de Segurança

#### **HTTPS Obrigatório**
- PWA só funciona em HTTPS ou localhost
- Para produção, use sempre HTTPS

#### **Permissões**
- Armazenamento local ilimitado
- Notificações (se habilitadas)
- Acesso offline aos dados

### 📈 Performance

#### **Tamanhos Otimizados**
- Bundle principal: ~1.4MB (comprimido: ~450KB)
- Cache total: ~1.8MB
- Tempo de carregamento: <3s (primeira vez)
- Tempo offline: <1s

#### **Otimizações Aplicadas**
- Code splitting automático
- Lazy loading de componentes
- Cache agressivo de recursos
- Compressão gzip ativa

### 🌐 Deploy PWA

#### **Netlify (Recomendado)**
```bash
# Build e deploy automático
npm run build
netlify deploy --prod --dir=dist
```

#### **Vercel**
```bash
# Deploy direto
vercel --prod
```

#### **GitHub Pages**
```bash
# Build e commit
npm run build
git add dist -f
git commit -m "Deploy PWA"
git subtree push --prefix dist origin gh-pages
```

### 📞 Suporte

Se tiver problemas com o PWA:

1. **Verifique os requisitos** do sistema
2. **Limpe o cache** do navegador
3. **Teste em modo incógnito**
4. **Reinstale** o PWA se necessário

---

**🎉 Pronto! Seu Sistema PDV agora é um PWA completo e funcional!**

📱 Instale na sua máquina e tenha acesso rápido ao sistema a qualquer momento!