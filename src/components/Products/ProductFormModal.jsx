import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Package, RefreshCw } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import NeuCard from '../Layout/NeuCard';
import NeuButton from '../Layout/NeuButton';
import NeuInput from '../Layout/NeuInput';
import toast from 'react-hot-toast';

export default function ProductFormModal({ product, onClose }) {
  const { darkMode, addProduct, updateProduct, products } = useApp();
  
  // Função para calcular dígito verificador EAN-13
  const calculateEAN13CheckDigit = (code) => {
    const digits = code.split('').map(Number);
    let sum = 0;
    
    for (let i = 0; i < 12; i++) {
      if (i % 2 === 0) {
        sum += digits[i];
      } else {
        sum += digits[i] * 3;
      }
    }
    
    const remainder = sum % 10;
    return remainder === 0 ? 0 : 10 - remainder;
  };
  
  // Função para gerar código de barras único
  const generateUniqueBarcode = () => {
    let attempts = 0;
    const maxAttempts = 1000;
    
    while (attempts < maxAttempts) {
      // Gerar 12 dígitos aleatórios (começando com 2 para produtos nacionais)
      const baseCode = '2' + Math.random().toString().slice(2, 12).padEnd(11, '0');
      
      // Calcular dígito verificador
      const checkDigit = calculateEAN13CheckDigit(baseCode);
      const fullBarcode = baseCode + checkDigit;
      
      // Verificar se já existe
      const exists = products.some(p => p.barcode === fullBarcode);
      
      if (!exists) {
        return fullBarcode;
      }
      
      attempts++;
    }
    
    // Fallback: usar timestamp
    const timestamp = Date.now().toString().slice(-11);
    const timestampCode = '2' + timestamp;
    const checkDigit = calculateEAN13CheckDigit(timestampCode);
    return timestampCode + checkDigit;
  };
  
  // Função para gerar novo código de barras
  const handleGenerateBarcode = () => {
    const newBarcode = generateUniqueBarcode();
    setFormData(prev => ({ ...prev, barcode: newBarcode }));
    toast.success('Código de barras gerado com sucesso!');
  };
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    cost: 0,
    stock: 0,
    minStock: 0,
    category: '',
    barcode: '',
    brand: '',
    model: '',
    supplier: '',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const imageInputRef = useRef(null);

  useEffect(() => {
    if (product) {
      setFormData(product);
      if (product.image) {
        setImagePreview(product.image);
      }
    } else {
      // Para produtos novos, gerar código de barras automaticamente
      const newBarcode = generateUniqueBarcode();
      setFormData(prev => ({ ...prev, barcode: newBarcode }));
    }
  }, [product, products]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (Number(value) || 0) : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error('A imagem deve ter no máximo 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (product) {
      updateProduct({ ...formData, id: product.id });
    } else {
      addProduct(formData);
    }
    onClose();
  };

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
          className="w-full max-w-4xl max-h-[90vh] overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <NeuCard darkMode={darkMode} neonBorder>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                {product ? 'Editar Produto' : 'Adicionar Produto'}
              </h2>
              <button onClick={onClose} className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto max-h-[75vh] pr-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-4">
                  <NeuInput darkMode={darkMode} label="Nome do Produto" name="name" value={formData.name} onChange={handleChange} required />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descrição</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full p-3 bg-gray-100 dark:bg-gray-900 border-0 rounded-lg text-gray-800 dark:text-gray-200" style={{ boxShadow: darkMode ? 'inset 4px 4px 8px #1a1a1a, inset -4px -4px 8px #2e2e2e' : 'inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff' }}></textarea>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="w-40 h-40 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center mb-2 overflow-hidden">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-16 h-16 text-gray-400" />
                    )}
                  </div>
                  <NeuButton type="button" onClick={() => imageInputRef.current?.click()} darkMode={darkMode} size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Carregar Imagem
                  </NeuButton>
                  <input ref={imageInputRef} type="file" name="image" onChange={handleImageChange} accept="image/*" className="hidden" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <NeuInput darkMode={darkMode} label="Preço de Venda" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} required />
                <NeuInput darkMode={darkMode} label="Preço de Custo" name="cost" type="number" step="0.01" value={formData.cost} onChange={handleChange} />
                <NeuInput darkMode={darkMode} label="Estoque Atual" name="stock" type="number" value={formData.stock} onChange={handleChange} required />
                <NeuInput darkMode={darkMode} label="Estoque Mínimo" name="minStock" type="number" value={formData.minStock} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NeuInput darkMode={darkMode} label="Categoria" name="category" value={formData.category} onChange={handleChange} />
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Código de Barras
                  </label>
                  <div className="flex gap-2">
                    <NeuInput 
                      darkMode={darkMode} 
                      name="barcode" 
                      value={formData.barcode} 
                      onChange={handleChange}
                      placeholder="Código será gerado automaticamente"
                      className="flex-1"
                    />
                    <NeuButton 
                      type="button" 
                      darkMode={darkMode} 
                      variant="secondary" 
                      size="sm"
                      onClick={handleGenerateBarcode}
                      title="Gerar novo código de barras"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </NeuButton>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Código EAN-13 válido gerado automaticamente
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <NeuInput darkMode={darkMode} label="Marca" name="brand" value={formData.brand} onChange={handleChange} />
                <NeuInput darkMode={darkMode} label="Modelo" name="model" value={formData.model} onChange={handleChange} />
                <NeuInput darkMode={darkMode} label="Fornecedor" name="supplier" value={formData.supplier} onChange={handleChange} />
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <NeuButton type="button" darkMode={darkMode} variant="secondary" onClick={onClose}>Cancelar</NeuButton>
                <NeuButton type="submit" darkMode={darkMode} variant="primary">{product ? 'Salvar Alterações' : 'Adicionar Produto'}</NeuButton>
              </div>
            </form>
          </NeuCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
