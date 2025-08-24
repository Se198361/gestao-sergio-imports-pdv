import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { dbService } from '../services/database';
import toast from 'react-hot-toast';
import { faker } from '@faker-js/faker';

const AppContext = createContext();

const initialState = {
  darkMode: false,
  products: [],
  clients: [],
  sales: [],
  exchanges: [],
  settings: {},
  cart: [],
  loading: true,
  searchTerm: '',
  lastCompletedSale: null,
  notifications: [],
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_DARK_MODE':
      return { ...state, darkMode: action.payload };
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'SET_CLIENTS':
      return { ...state, clients: action.payload };
    case 'SET_SALES':
      return { ...state, sales: action.payload };
    case 'SET_EXCHANGES':
      return { ...state, exchanges: action.payload };
    case 'SET_SETTINGS':
      return { ...state, settings: action.payload };
    case 'SET_CART':
      return { ...state, cart: action.payload };
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      }
      return { ...state, cart: [...state.cart, action.payload] };
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(item => item.id !== action.payload) };
    case 'UPDATE_CART_ITEM':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id ? { ...item, ...action.payload } : item
        )
      };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'SET_LAST_COMPLETED_SALE':
      return { ...state, lastCompletedSale: action.payload };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] };
    case 'REMOVE_NOTIFICATION':
      return { ...state, notifications: state.notifications.filter(n => n.id !== action.payload) };
    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => 
          n.id === action.payload ? { ...n, read: true } : n
        )
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(state.darkMode));
  }, [state.darkMode]);

  // UseEffect para verificar estoque baixo quando produtos mudam
  useEffect(() => {
    if (state.products && state.products.length > 0 && !state.loading) {
      const timeoutId = setTimeout(() => {
        const lowStockItems = state.products.filter(product => product.stock < 2);
        
        lowStockItems.forEach(product => {
          // Verifica se já existe uma notificação de estoque baixo para este produto
          const existingNotification = state.notifications.find(
            n => n.type === 'low_stock' && n.productId === product.id && !n.read
          );
          
          if (!existingNotification) {
            const newNotification = {
              id: Date.now() + Math.random(),
              timestamp: new Date().toISOString(),
              read: false,
              type: 'low_stock',
              title: 'Estoque Baixo',
              message: `O produto "${product.name}" está com estoque baixo (${product.stock} unidades restantes)`,
              productId: product.id,
              priority: 'high'
            };
            dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });
          }
        });
      }, 2000); // Aumentei o delay para 2 segundos
      return () => clearTimeout(timeoutId);
    }
  }, [state.products.length, state.loading]); // Dependência melhorada

  const initializeApp = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await dbService.init();
      const darkModeStored = localStorage.getItem('darkMode');
      if (darkModeStored) {
        dispatch({ type: 'SET_DARK_MODE', payload: JSON.parse(darkModeStored) });
      }
      await loadAllData(false);
      await initializeSampleData();
    } catch (error) {
      console.error('Error initializing app:', error);
      toast.error('Erro ao inicializar aplicação');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadAllData = async (showLoading = true) => {
    if(showLoading) dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const [products, clients, sales, exchanges, settings] = await Promise.all([
        dbService.getAll('products'),
        dbService.getAll('clients'),
        dbService.getAll('sales'),
        dbService.getAll('exchanges'),
        dbService.getAll('settings')
      ]);

      dispatch({ type: 'SET_PRODUCTS', payload: products || [] });
      dispatch({ type: 'SET_CLIENTS', payload: clients || [] });
      dispatch({ type: 'SET_SALES', payload: sales || [] });
      dispatch({ type: 'SET_EXCHANGES', payload: exchanges || [] });
      
      const settingsObj = {};
      settings?.forEach(setting => {
        settingsObj[setting.key] = setting.value;
      });
      dispatch({ type: 'SET_SETTINGS', payload: settingsObj });
      
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      if(showLoading) dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const initializeSampleData = async () => {
    const isDataInitialized = await dbService.get('settings', 'isDataInitialized');
    if (isDataInitialized) return;

    try {
        const companySettings = [
          { key: 'companyName', value: 'Sérgio Imports' },
          { key: 'companyLegalName', value: 'Sérgio Imports Ltda.' },
          { key: 'cnpj', value: '12.345.678/0001-90' },
          { key: 'address', value: 'Rua das Importações, 123, Centro' },
          { key: 'city', value: 'São Paulo, SP' },
          { key: 'phone', value: '(11) 99999-9999' },
          { key: 'email', value: 'contato@sergioimports.com' },
          { key: 'pixKey', value: 'contato@sergioimports.com' },
          { key: 'exchangePolicy', value: 'Trocas em até 7 dias com nota fiscal. Produtos devem estar em perfeito estado. Não aceitamos trocas de produtos íntimos.' },
          { key: 'exchangeDeadline', value: '7' },
          // Novas configurações do recibo
          { key: 'receiptMessage1', value: 'Obrigado!' },
          { key: 'receiptMessage2', value: 'Volte sempre!' },
          { key: 'receiptMessage3', value: '' },
          { key: 'receiptFooter', value: '' },
          { key: 'isDataInitialized', value: true }
        ];
        for (const setting of companySettings) await dbService.put('settings', setting);

        const sampleProducts = [
          { name: 'Smartphone Galaxy S24', description: 'Smartphone Samsung Galaxy S24 128GB', price: 2999.99, cost: 2000.00, stock: 15, minStock: 5, category: 'Eletrônicos', barcode: '1234567890123', brand: 'Samsung', model: 'Galaxy S24', supplier: 'Samsung Brasil', image: null },
          { name: 'iPhone 15 Pro', description: 'Apple iPhone 15 Pro 256GB', price: 8999.99, cost: 7000.00, stock: 8, minStock: 3, category: 'Eletrônicos', barcode: '2345678901234', brand: 'Apple', model: 'iPhone 15 Pro', supplier: 'Apple Brasil', image: null },
          { name: 'Notebook Dell Inspiron', description: 'Notebook Dell Inspiron 15 Intel i5', price: 3499.99, cost: 2800.00, stock: 12, minStock: 4, category: 'Informática', barcode: '3456789012345', brand: 'Dell', model: 'Inspiron 15', supplier: 'Dell Brasil', image: null }
        ];
        for (const product of sampleProducts) await dbService.add('products', product);

        for (let i = 0; i < 10; i++) {
          const client = {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
            address: faker.location.streetAddress(),
          };
          await dbService.add('clients', client);
        }
        await loadAllData(false);
    } catch (error) {
      console.error('Error initializing sample data:', error);
    }
  };

  const toggleDarkMode = () => {
    dispatch({ type: 'SET_DARK_MODE', payload: !state.darkMode });
  };

  const addProduct = async (product) => {
    try {
      await dbService.add('products', product);
      await loadAllData();
      toast.success('Produto adicionado com sucesso!');
    } catch (error) {
      toast.error('Erro ao adicionar produto');
    }
  };

  const updateProduct = async (product) => {
    try {
      await dbService.put('products', product);
      await loadAllData();
      toast.success('Produto atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar produto');
    }
  };

  const deleteProduct = async (id) => {
    try {
      await dbService.delete('products', id);
      await loadAllData();
      toast.success('Produto removido com sucesso!');
    } catch (error) {
      toast.error('Erro ao remover produto');
    }
  };

  const addClient = async (client) => {
    try {
      await dbService.add('clients', client);
      await loadAllData();
      toast.success('Cliente adicionado com sucesso!');
    } catch (error) {
      toast.error('Erro ao adicionar cliente');
    }
  };
  
  const updateClient = async (client) => {
    try {
      await dbService.put('clients', client);
      await loadAllData();
      toast.success('Cliente atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar cliente');
    }
  };

  const deleteClient = async (id) => {
    try {
      await dbService.delete('clients', id);
      await loadAllData();
      toast.success('Cliente removido com sucesso!');
    } catch (error) {
      toast.error('Erro ao remover cliente');
    }
  };

  const processSale = async (saleData) => {
    try {
      let clientInfo = null;
      if (saleData.clientId) {
        const client = await dbService.get('clients', saleData.clientId);
        if(client) clientInfo = { id: client.id, name: client.name };
      }
      
      const fullSaleData = { ...saleData, client: clientInfo };
      
      const saleId = await dbService.add('sales', fullSaleData);

      for (const item of saleData.items) {
        const product = await dbService.get('products', item.productId);
        if (product) {
          product.stock -= item.quantity;
          await dbService.put('products', product);
        }
      }
      await loadAllData();
      dispatch({ type: 'CLEAR_CART' });
      dispatch({ type: 'SET_LAST_COMPLETED_SALE', payload: { ...fullSaleData, id: saleId } });
      
      // Criar notificação de venda
      addSaleNotification({ ...fullSaleData, id: saleId });
      
      return { ...fullSaleData, id: saleId };
    } catch (error) {
      toast.error('Erro ao processar venda');
      throw error;
    }
  };

  const addExchange = async (exchange) => {
    try {
      const exchangeId = await dbService.add('exchanges', exchange);
      await loadAllData();
      
      // Criar notificação de troca
      addExchangeNotification({ ...exchange, id: exchangeId });
      
      toast.success('Troca registrada com sucesso!');
    } catch (error) {
      toast.error('Erro ao registrar troca');
    }
  };

  const updateExchange = async (id, newStatus) => {
    try {
      const exchange = await dbService.get('exchanges', id);
      if (exchange) {
        await dbService.put('exchanges', { ...exchange, status: newStatus });
        await loadAllData();
        toast.success('Status da troca atualizado!');
      }
    } catch (error) {
      toast.error('Erro ao atualizar status da troca.');
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      for (const [key, value] of Object.entries(newSettings)) {
        await dbService.put('settings', { key, value });
      }
      await loadAllData();
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar configurações');
    }
  };

  // Função para criar notificação
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });
  };

  // Função para marcar notificação como lida
  const markNotificationRead = (id) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  };

  // Função para remover notificação
  const removeNotification = (id) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  // Função para limpar todas as notificações
  const clearAllNotifications = () => {
    dispatch({ type: 'CLEAR_NOTIFICATIONS' });
  };

  // Função para verificar produtos com estoque baixo (agora mais simples)
  const checkLowStockProducts = () => {
    const lowStockItems = state.products.filter(product => product.stock < 2);
    return lowStockItems;
  };

  // Função para criar notificação de venda
  const addSaleNotification = (saleData) => {
    addNotification({
      type: 'sale',
      title: 'Nova Venda Realizada',
      message: `Venda concluída no valor de ${saleData.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
      saleId: saleData.id,
      priority: 'medium'
    });
  };

  // Função para criar notificação de troca
  const addExchangeNotification = (exchangeData) => {
    addNotification({
      type: 'exchange',
      title: 'Nova Troca Registrada',
      message: `Troca registrada para a venda #${exchangeData.saleId} - Motivo: ${exchangeData.reason}`,
      exchangeId: exchangeData.id,
      priority: 'medium'
    });
  };

  const value = {
    ...state,
    toggleDarkMode,
    dispatch,
    addProduct,
    updateProduct,
    deleteProduct,
    addClient,
    updateClient,
    deleteClient,
    processSale,
    addExchange,
    updateExchange,
    updateSettings,
    loadAllData,
    // Funções de notificação
    addNotification,
    markNotificationRead,
    removeNotification,
    clearAllNotifications,
    checkLowStockProducts
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
