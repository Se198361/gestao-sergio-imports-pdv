# Como manter o aplicativo sempre ativo

## ✅ Solução Implementada

Agora você tem **duas opções** para executar o aplicativo:

### 1. 🚀 **Servidor Independente (RECOMENDADO)**
- **URL**: http://localhost:3001
- **Comando**: `npm start`
- **Vantagem**: Roda independentemente, pode fechar o terminal depois

### 2. 🔧 **Servidor de Desenvolvimento**
- **URL**: http://localhost:3000  
- **Comando**: `npm run dev`
- **Vantagem**: Para desenvolvimento com hot-reload

## 📋 Instruções de Uso

### Para usar o aplicativo de forma permanente:

1. **Abra o terminal** na pasta do projeto
2. **Execute o comando**:
   ```bash
   npm start
   ```
3. **Aguarde a mensagem**:
   ```
   🚀 Aplicativo rodando em http://localhost:3001
   📱 PWA pronto para instalação!
   ⚡ Servidor independente ativo - pode fechar o terminal após iniciar
   ```
4. **Acesse**: http://localhost:3001
5. **IMPORTANTE**: Depois que o aplicativo abrir, você pode **fechar o terminal** e o aplicativo continuará funcionando!

### Para instalar como PWA (App nativo):

1. **No Chrome/Edge**: Clique no ícone de instalação na barra de endereço
2. **Ou**: Vá em Menu → Instalar aplicativo
3. **O aplicativo ficará disponível como um programa independente**

## 🔄 Para parar o servidor

Se precisar parar o servidor independente:

```bash
# No Windows
taskkill /F /IM node.exe

# Ou use Ctrl+C no terminal se ainda estiver aberto
```

## 📁 Arquivos Criados

- `server.js` - Servidor Express independente
- `dist/` - Build de produção (versão otimizada)
- Atualizado `package.json` com script "start"

## 🎯 Benefícios da Solução

✅ **Aplicativo sempre ativo** - Não precisa ficar com terminal aberto
✅ **Performance otimizada** - Usa build de produção
✅ **PWA completo** - Pode instalar como app nativo
✅ **Fácil de usar** - Um comando só: `npm start`
✅ **Independente** - Roda sem precisar do Vite

---

**Agora seu aplicativo PDV está pronto para uso profissional! 🚀**