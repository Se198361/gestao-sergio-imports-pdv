import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Package } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import NeuCard from '../Layout/NeuCard';
import NeuButton from '../Layout/NeuButton';
import NeuInput from '../Layout/NeuInput';

export default function ProductSelector({ onClose, onSelect }) {
  const { darkMode, products } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode?.includes(searchTerm)
  );

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-4xl max-h-[80vh] overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <NeuCard darkMode={darkMode} neonBorder>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                Selecionar Produto
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <NeuInput
              darkMode={darkMode}
              neon
              placeholder="Buscar produto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-6"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <NeuCard 
                    darkMode={darkMode} 
                    hover 
                    className="cursor-pointer"
                    onClick={() => {
                      onSelect(product);
                      onClose();
                    }}
                  >
                    <div className="space-y-3">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <Package className="w-8 h-8 text-white" />
                        </div>
                      )}
                      
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {product.category}
                        </p>
                        <p className="text-lg font-bold text-green-600 mt-2">
                          {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                        <p className="text-sm text-gray-500">
                          Estoque: {product.stock} unidades
                        </p>
                      </div>
                    </div>
                  </NeuCard>
                </motion.div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Nenhum produto encontrado
                </p>
              </div>
            )}
          </NeuCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
