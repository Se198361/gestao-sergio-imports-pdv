import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Package, 
  Users, 
  ShoppingCart, 
  BarChart3, 
  RefreshCw, 
  Tag, 
  Settings,
  Building2
} from 'lucide-react';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'pdv', label: 'PDV', icon: ShoppingCart },
  { id: 'products', label: 'Produtos', icon: Package },
  { id: 'clients', label: 'Clientes', icon: Users },
  { id: 'sales', label: 'Vendas', icon: BarChart3 },
  { id: 'exchanges', label: 'Trocas', icon: RefreshCw },
  { id: 'labels', label: 'Etiquetas', icon: Tag },
  { id: 'company', label: 'Empresa', icon: Building2 },
  { id: 'settings', label: 'Configurações', icon: Settings },
];

export default function Sidebar({ activeSection, setActiveSection, isCollapsed, darkMode }) {
  return (
    <motion.div 
      className={`fixed left-0 top-0 h-full bg-gray-100 dark:bg-gray-900 transition-all duration-300 z-40 ${
        isCollapsed ? 'w-16' : 'w-64'
      } border-r border-gray-200 dark:border-gray-700`}
      style={{
        boxShadow: darkMode 
          ? '8px 0 16px rgba(26, 26, 26, 0.3), -2px 0 8px rgba(46, 46, 46, 0.1)' 
          : '8px 0 16px rgba(190, 190, 190, 0.3), -2px 0 8px rgba(255, 255, 255, 0.1)'
      }}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
        <motion.div 
          className="flex items-center space-x-2"
          animate={{ opacity: isCollapsed ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {!isCollapsed && (
            <>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SI</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-glow">
                Sérgio Imports
              </span>
            </>
          )}
        </motion.div>
      </div>

      {/* Menu Items */}
      <nav className="mt-8 px-2">
        {menuItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full flex items-center px-3 py-3 mb-2 rounded-lg transition-all duration-200 group ${
              activeSection === item.id
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
            }`}
            style={{
              boxShadow: activeSection === item.id 
                ? '0 0 20px rgba(59, 130, 246, 0.3)' 
                : darkMode
                  ? '4px 4px 8px #1a1a1a, -4px -4px 8px #2e2e2e'
                  : '4px 4px 8px #bebebe, -4px -4px 8px #ffffff'
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <item.icon className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
            {!isCollapsed && (
              <span className="font-medium">{item.label}</span>
            )}
            {activeSection === item.id && (
              <motion.div
                className="absolute right-0 w-1 h-8 bg-neon-blue rounded-l-full"
                layoutId="activeIndicator"
                style={{ boxShadow: '0 0 10px #00f0ff' }}
              />
            )}
          </motion.button>
        ))}
      </nav>
    </motion.div>
  );
}
