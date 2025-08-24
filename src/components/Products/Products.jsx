import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import NeuCard from '../Layout/NeuCard';
import NeuButton from '../Layout/NeuButton';
import NeuInput from '../Layout/NeuInput';
import ProductList from './ProductList';
import ProductFormModal from './ProductFormModal';

export default function Products() {
  const { darkMode, products } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const openModal = (product = null) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode?.includes(searchTerm)
  );

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <NeuCard darkMode={darkMode} neonBorder>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 animate-glow">
              Gestão de Produtos
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Adicione, edite e gerencie todos os seus produtos.
            </p>
          </div>
          <NeuButton darkMode={darkMode} neon onClick={() => openModal()}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Produto
          </NeuButton>
        </div>
      </NeuCard>

      <NeuCard darkMode={darkMode}>
        <div className="flex items-center">
          <NeuInput
            darkMode={darkMode}
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Search className="w-5 h-5 text-gray-500 -ml-10" />
        </div>
      </NeuCard>

      <NeuCard darkMode={darkMode}>
        <ProductList products={filteredProducts} onEdit={openModal} />
      </NeuCard>

      {isModalOpen && (
        <ProductFormModal
          product={selectedProduct}
          onClose={closeModal}
        />
      )}
    </motion.div>
  );
}
