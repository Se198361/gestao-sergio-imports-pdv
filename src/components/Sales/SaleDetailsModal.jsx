import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Calendar, CreditCard, Package, MapPin, Phone, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import NeuCard from '../Layout/NeuCard';
import NeuButton from '../Layout/NeuButton';

export default function SaleDetailsModal({ sale, isOpen, onClose, darkMode }) {
  if (!sale) return null;

  const getTotalItems = () => {
    return sale.items.reduce((acc, item) => acc + item.quantity, 0);
  };

  const getPaymentMethodColor = (method) => {
    const colors = {
      'Dinheiro': 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
      'Cartão de Crédito': 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
      'Cartão de Débito': 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
      'Pix': 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200',
      'Transferência': 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200'
    };
    return colors[method] || 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <NeuCard darkMode={darkMode} className="relative">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b dark:border-gray-600">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    Detalhes da Venda #{sale.id}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Informações completas da transação
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Informações Gerais */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                    Informações Gerais
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Data e Hora:</span>
                        <p className="font-medium text-gray-800 dark:text-gray-200">
                          {format(new Date(sale.date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-5 h-5 text-gray-500" />
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Forma de Pagamento:</span>
                        <p className="font-medium">
                          <span className={`px-2 py-1 rounded-full text-xs ${getPaymentMethodColor(sale.paymentMethod)}`}>
                            {sale.paymentMethod}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Package className="w-5 h-5 text-gray-500" />
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Total de Itens:</span>
                        <p className="font-medium text-gray-800 dark:text-gray-200">
                          {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'itens'}
                        </p>
                      </div>
                    </div>

                    {sale.discount > 0 && (
                      <div className="flex items-center space-x-3">
                        <span className="w-5 h-5 text-red-500 font-bold">%</span>
                        <div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">Desconto Aplicado:</span>
                          <p className="font-medium text-red-600 dark:text-red-400">
                            {sale.discount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Informações do Cliente */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                    Cliente
                  </h3>
                  
                  {sale.client ? (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-gray-500" />
                        <div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">Nome:</span>
                          <p className="font-medium text-gray-800 dark:text-gray-200">
                            {sale.client.name}
                          </p>
                        </div>
                      </div>

                      {sale.client.email && (
                        <div className="flex items-center space-x-3">
                          <Mail className="w-5 h-5 text-gray-500" />
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">E-mail:</span>
                            <p className="font-medium text-gray-800 dark:text-gray-200">
                              {sale.client.email}
                            </p>
                          </div>
                        </div>
                      )}

                      {sale.client.phone && (
                        <div className="flex items-center space-x-3">
                          <Phone className="w-5 h-5 text-gray-500" />
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Telefone:</span>
                            <p className="font-medium text-gray-800 dark:text-gray-200">
                              {sale.client.phone}
                            </p>
                          </div>
                        </div>
                      )}

                      {sale.client.address && (
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-5 h-5 text-gray-500" />
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Endereço:</span>
                            <p className="font-medium text-gray-800 dark:text-gray-200">
                              {sale.client.address}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Cliente não identificado</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Lista de Itens */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  Itens da Venda
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="px-6 py-3">Produto</th>
                        <th scope="col" className="px-6 py-3">Preço Unit.</th>
                        <th scope="col" className="px-6 py-3">Quantidade</th>
                        <th scope="col" className="px-6 py-3">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sale.items.map((item, index) => (
                        <tr key={index} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                          <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                            {item.name}
                          </td>
                          <td className="px-6 py-4">
                            {item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </td>
                          <td className="px-6 py-4">{item.quantity}</td>
                          <td className="px-6 py-4 font-semibold">
                            {(item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Resumo Financeiro */}
              <div className="mt-6 pt-6 border-t dark:border-gray-600">
                <div className="flex justify-end">
                  <div className="w-full max-w-sm space-y-2">
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Subtotal:</span>
                      <span>{(sale.total + (sale.discount || 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    </div>
                    {sale.discount > 0 && (
                      <div className="flex justify-between text-red-600 dark:text-red-400">
                        <span>Desconto:</span>
                        <span>-{sale.discount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold text-gray-800 dark:text-gray-200 pt-2 border-t dark:border-gray-600">
                      <span>Total:</span>
                      <span>{sale.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t dark:border-gray-600">
                <NeuButton 
                  darkMode={darkMode} 
                  variant="secondary"
                  onClick={onClose}
                >
                  Fechar
                </NeuButton>
              </div>
            </NeuCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}