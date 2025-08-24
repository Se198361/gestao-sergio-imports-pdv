import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Smartphone, DollarSign, QrCode } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import NeuCard from '../Layout/NeuCard';
import NeuButton from '../Layout/NeuButton';
import NeuInput from '../Layout/NeuInput';

const paymentMethods = [
  { id: 'credit', name: 'Cartão de Crédito', icon: CreditCard },
  { id: 'debit', name: 'Cartão de Débito', icon: CreditCard },
  { id: 'pix', name: 'PIX', icon: QrCode },
  { id: 'cash', name: 'Dinheiro', icon: DollarSign },
];

const creditCardBrands = [
  'Visa', 'Mastercard', 'American Express', 'Elo', 'Hipercard'
];

export default function PaymentModal({ onClose, onConfirm, total }) {
  const { darkMode, settings, clients } = useApp();
  const [selectedMethod, setSelectedMethod] = useState('credit');
  const [installments, setInstallments] = useState(1);
  const [cardBrand, setCardBrand] = useState('Visa');
  const [cashAmount, setCashAmount] = useState(total);
  const [clientId, setClientId] = useState('');

  const installmentOptions = Array.from({ length: 12 }, (_, i) => i + 1);
  const installmentValue = total / installments;
  const change = cashAmount - total;

  const handleConfirm = () => {
    const paymentData = {
      method: selectedMethod,
      total,
      clientId: clientId ? parseInt(clientId, 10) : null,
      ...(selectedMethod === 'credit' && {
        installments,
        installmentValue,
        cardBrand
      }),
      ...(selectedMethod === 'cash' && {
        cashAmount,
        change
      })
    };

    onConfirm(paymentData);
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
          className="w-full max-w-2xl max-h-[90vh] flex flex-col"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <NeuCard darkMode={darkMode} neonBorder className="flex flex-col flex-grow overflow-hidden">
            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                Finalizar Pagamento
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-grow overflow-y-auto pr-4 -mr-4 space-y-6">
              {/* Total */}
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total a Pagar</p>
                <p className="text-3xl font-bold text-green-600">
                  {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Forma de Pagamento
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {paymentMethods.map((method) => (
                    <NeuButton
                      key={method.id}
                      darkMode={darkMode}
                      variant={selectedMethod === method.id ? 'primary' : 'secondary'}
                      onClick={() => setSelectedMethod(method.id)}
                      className="flex items-center justify-center p-4"
                    >
                      <method.icon className="w-5 h-5 mr-2" />
                      {method.name}
                    </NeuButton>
                  ))}
                </div>
              </div>

              {/* Credit Card Options */}
              {selectedMethod === 'credit' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bandeira
                      </label>
                      <select
                        value={cardBrand}
                        onChange={(e) => setCardBrand(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-900 border-0 rounded-lg text-gray-800 dark:text-gray-200"
                        style={{
                          boxShadow: darkMode 
                            ? 'inset 4px 4px 8px #1a1a1a, inset -4px -4px 8px #2e2e2e'
                            : 'inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff'
                        }}
                      >
                        {creditCardBrands.map(brand => (
                          <option key={brand} value={brand}>{brand}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Parcelas
                      </label>
                      <select
                        value={installments}
                        onChange={(e) => setInstallments(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-900 border-0 rounded-lg text-gray-800 dark:text-gray-200"
                        style={{
                          boxShadow: darkMode 
                            ? 'inset 4px 4px 8px #1a1a1a, inset -4px -4px 8px #2e2e2e'
                            : 'inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff'
                        }}
                      >
                        {installmentOptions.map(num => (
                          <option key={num} value={num}>
                            {num}x de {(total / num).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Cash Payment */}
              {selectedMethod === 'cash' && (
                <div>
                  <NeuInput
                    darkMode={darkMode}
                    label="Valor Recebido"
                    type="number"
                    step="0.01"
                    min={total}
                    value={cashAmount}
                    onChange={(e) => setCashAmount(Number(e.target.value) || 0)}
                  />
                  {change >= 0 && (
                    <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-green-700 dark:text-green-400 font-medium">
                        Troco: {change.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* PIX QR Code */}
              {selectedMethod === 'pix' && settings.pixQrCode && (
                <div className="text-center">
                  <img 
                    src={settings.pixQrCode} 
                    alt="QR Code PIX"
                    className="w-48 h-48 mx-auto mb-4 rounded-lg"
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Escaneie o QR Code para pagar via PIX
                  </p>
                </div>
              )}

              {/* Client Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cliente (Opcional)
                </label>
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-900 border-0 rounded-lg text-gray-800 dark:text-gray-200"
                  style={{
                    boxShadow: darkMode 
                      ? 'inset 4px 4px 8px #1a1a1a, inset -4px -4px 8px #2e2e2e'
                      : 'inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff'
                  }}
                >
                  <option value="">Anônimo</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name} (ID: {client.id})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex-shrink-0 flex space-x-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <NeuButton
                darkMode={darkMode}
                variant="secondary"
                onClick={onClose}
                className="flex-1"
              >
                Cancelar
              </NeuButton>
              <NeuButton
                darkMode={darkMode}
                variant="primary"
                onClick={handleConfirm}
                className="flex-1"
                disabled={selectedMethod === 'cash' && cashAmount < total}
              >
                Confirmar Pagamento
              </NeuButton>
            </div>
          </NeuCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
