import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Package } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import NeuButton from '../Layout/NeuButton';

export default function ProductList({ products, onEdit }) {
  const { darkMode, deleteProduct } = useApp();

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja remover este produto?')) {
      deleteProduct(id);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">Produto</th>
            <th scope="col" className="px-6 py-3">Categoria</th>
            <th scope="col" className="px-6 py-3">Preço</th>
            <th scope="col" className="px-6 py-3">Estoque</th>
            <th scope="col" className="px-6 py-3">Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <motion.tr
              key={product.id}
              className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap flex items-center">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-10 h-10 rounded-md object-cover mr-3" />
                ) : (
                  <div className="w-10 h-10 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                    <Package className="w-5 h-5 text-gray-500" />
                  </div>
                )}
                {product.name}
              </th>
              <td className="px-6 py-4">{product.category}</td>
              <td className="px-6 py-4">{product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
              <td className="px-6 py-4">{product.stock}</td>
              <td className="px-6 py-4">
                <div className="flex space-x-2">
                  <NeuButton darkMode={darkMode} size="sm" onClick={() => onEdit(product)}>
                    <Edit className="w-4 h-4" />
                  </NeuButton>
                  <NeuButton darkMode={darkMode} size="sm" variant="danger" onClick={() => handleDelete(product.id)}>
                    <Trash2 className="w-4 h-4" />
                  </NeuButton>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
      {products.length === 0 && (
        <div className="text-center py-8">
          <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Nenhum produto encontrado.</p>
        </div>
      )}
    </div>
  );
}
