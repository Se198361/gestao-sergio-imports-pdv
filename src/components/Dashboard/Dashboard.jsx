import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Package, Users, DollarSign, ShoppingCart, AlertTriangle, Bell, Download } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import NeuCard from '../Layout/NeuCard';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Dashboard() {
  const { darkMode, products, clients, sales, cart, notifications } = useApp();

  // Função de teste PWA
  const testPWAInstall = () => {
    console.log('Teste PWA - Criando evento simulado');
    
    // Simular evento beforeinstallprompt
    const mockEvent = {
      preventDefault: () => console.log('preventDefault called'),
      prompt: () => {
        console.log('prompt called');
        return Promise.resolve();
      },
      userChoice: Promise.resolve({ outcome: 'accepted' })
    };
    
    // Disparar evento customizado
    const customEvent = new CustomEvent('beforeinstallprompt', {
      detail: mockEvent
    });
    
    window.dispatchEvent(customEvent);
    
    // Forçar exibição do modal
    sessionStorage.removeItem('pwa-prompt-dismissed');
    
    // Recarregar componente PWA
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  // Calculate statistics
  const totalProducts = products.length;
  const totalClients = clients.length;
  const totalSales = sales.length;
  const lowStockProducts = products.filter(p => p.stock <= p.minStock).length;
  
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const todaySales = sales.filter(sale => {
    const today = new Date();
    const saleDate = new Date(sale.date);
    return saleDate.toDateString() === today.toDateString();
  }).length;

  const topProducts = products
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 5);

  const recentSales = sales
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const stats = [
    {
      title: 'Total de Vendas',
      value: totalSales,
      icon: ShoppingCart,
      color: 'from-blue-500 to-blue-600',
      change: '+12%'
    },
    {
      title: 'Receita Total',
      value: totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      change: '+8%'
    },
    {
      title: 'Produtos',
      value: totalProducts,
      icon: Package,
      color: 'from-purple-500 to-purple-600',
      change: '+5%'
    },
    {
      title: 'Clientes',
      value: totalClients,
      icon: Users,
      color: 'from-orange-500 to-orange-600',
      change: '+15%'
    }
  ];

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Welcome Header */}
      <NeuCard darkMode={darkMode} neonBorder>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 animate-glow">
              Dashboard - Sérgio Imports
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Bem-vindo ao sistema de gestão. Aqui está um resumo do seu negócio.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </p>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Vendas hoje: {todaySales}
            </p>
            {/* Botão de teste PWA - remover em produção */}
            <button
              onClick={testPWAInstall}
              className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
            >
              <Download className="w-3 h-3 inline mr-1" />
              Testar PWA
            </button>
          </div>
        </div>
      </NeuCard>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <NeuCard darkMode={darkMode} hover>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-green-500 mt-1 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </NeuCard>
          </motion.div>
        ))}
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <NeuCard darkMode={darkMode} className="border-l-4 border-red-500">
            <div className="flex items-center">
              <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Alerta de Estoque
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {lowStockProducts} produto(s) com estoque baixo precisam de reposição
                </p>
              </div>
            </div>
          </NeuCard>
        </motion.div>
      )}

      {/* Notifications Summary */}
      {notifications.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <NeuCard darkMode={darkMode} className="border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bell className="w-6 h-6 text-blue-500 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Notificações Recentes
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {notifications.filter(n => !n.read).length} notificações não lidas de {notifications.length} total
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Última notificação:
                </p>
                <p className="text-xs text-gray-400">
                  {notifications.length > 0 && format(new Date(notifications[0].timestamp), "dd/MM 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
            </div>
          </NeuCard>
        </motion.div>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <NeuCard darkMode={darkMode}>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Produtos em Estoque
          </h3>
          <div className="space-y-3">
            {topProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200">{product.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{product.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{product.stock}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">unidades</p>
                </div>
              </div>
            ))}
          </div>
        </NeuCard>

        {/* Recent Sales */}
        <NeuCard darkMode={darkMode}>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Vendas Recentes
          </h3>
          <div className="space-y-3">
            {recentSales.map((sale) => (
              <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      Venda #{sale.id}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {format(new Date(sale.date), 'dd/MM/yyyy HH:mm')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                    {sale.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{sale.paymentMethod}</p>
                </div>
              </div>
            ))}
          </div>
        </NeuCard>
      </div>
    </motion.div>
  );
}
