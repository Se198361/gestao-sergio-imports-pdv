import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Minus, Trash2, ShoppingCart, CreditCard } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import NeuCard from '../Layout/NeuCard';
import NeuButton from '../Layout/NeuButton';
import NeuInput from '../Layout/NeuInput';
import PaymentModal from './PaymentModal';
import ProductSelector from './ProductSelector';
import toast from 'react-hot-toast';

export default function PDV() {
  const { darkMode, products, cart, dispatch, processSale } = useApp();
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  const addToCart = (product) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      stock: product.stock
    };
    dispatch({ type: 'ADD_TO_CART', payload: cartItem });
    toast.success(`${product.name} adicionado ao carrinho`);
  };

  const updateQuantity = (id, newQuantity) => {
    const item = cart.find(item => item.id === id);
    if (newQuantity > item.stock) {
      toast.error('Quantidade indisponível em estoque');
      return;
    }
    if (newQuantity <= 0) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    } else {
      dispatch({ type: 'UPDATE_CART_ITEM', payload: { id, quantity: newQuantity } });
    }
  };

  const removeFromCart = (id) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    toast.success('Item removido do carrinho');
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    setDiscount(0);
    toast.success('Carrinho limpo');
  };

  const handlePayment = async (paymentData) => {
    try {
      const saleData = {
        date: new Date().toISOString(),
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity
        })),
        subtotal,
        discount: discountAmount,
        total,
        paymentMethod: paymentData.method,
        paymentDetails: paymentData,
        clientId: paymentData.clientId || null
      };

      await processSale(saleData);
      setShowPaymentModal(false);
      setDiscount(0);
      toast.success('Venda processada com sucesso!');
    } catch (error) {
      toast.error('Erro ao processar venda');
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode?.includes(searchTerm)
  );

  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Products Section */}
      <div className="lg:col-span-2 space-y-6">
        <NeuCard darkMode={darkMode} neonBorder>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 animate-glow">
              PDV - Ponto de Venda
            </h2>
            <NeuButton 
              darkMode={darkMode} 
              neon 
              onClick={() => setShowProductSelector(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Produto
            </NeuButton>
          </div>

          <NeuInput
            darkMode={darkMode}
            neon
            placeholder="Buscar produto por nome ou código de barras..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-6"
          />
        </NeuCard>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <NeuCard darkMode={darkMode} hover className="cursor-pointer" onClick={() => addToCart(product)}>
                <div className="flex items-center space-x-3">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {product.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 dark:text-gray-200 truncate">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Estoque: {product.stock}
                    </p>
                  </div>
                </div>
              </NeuCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Cart Section */}
      <div className="space-y-6">
        <NeuCard darkMode={darkMode}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Carrinho
            </h3>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <ShoppingCart className="w-5 h-5 mr-1" />
              <span>{cart.length}</span>
            </div>
          </div>

          {/* Cart Items */}
          <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
            {cart.map((item) => (
              <motion.div
                key={item.id}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3"
                layout
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                    {item.name}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {(item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Discount */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
            <NeuInput
              darkMode={darkMode}
              label="Desconto (%)"
              type="number"
              min="0"
              max="100"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value) || 0)}
              placeholder="0"
            />
          </div>

          {/* Totals */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
              <span className="font-medium">
                {subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-red-500">
                <span>Desconto ({discount}%):</span>
                <span>
                  -{discountAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold border-t border-gray-200 dark:border-gray-700 pt-2">
              <span>Total:</span>
              <span className="text-green-600">
                {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 mt-6">
            <NeuButton
              darkMode={darkMode}
              variant="primary"
              className="w-full"
              disabled={cart.length === 0}
              onClick={() => setShowPaymentModal(true)}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Finalizar Venda
            </NeuButton>
            <NeuButton
              darkMode={darkMode}
              variant="secondary"
              className="w-full"
              onClick={clearCart}
              disabled={cart.length === 0}
            >
              Limpar Carrinho
            </NeuButton>
          </div>
        </NeuCard>
      </div>

      {/* Modals */}
      {showProductSelector && (
        <ProductSelector
          onClose={() => setShowProductSelector(false)}
          onSelect={addToCart}
        />
      )}

      {showPaymentModal && (
        <PaymentModal
          onClose={() => setShowPaymentModal(false)}
          onConfirm={handlePayment}
          total={total}
        />
      )}
    </motion.div>
  );
}
