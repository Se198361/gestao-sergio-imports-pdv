import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import NeuCard from '../Layout/NeuCard';
import NeuButton from '../Layout/NeuButton';
import NeuInput from '../Layout/NeuInput';

export default function OpenCashModal({ isOpen, onClose, onConfirm, darkMode }) {
  const [openingAmount, setOpeningAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const amount = parseFloat(openingAmount.replace(',', '.'));
    if (isNaN(amount) || amount < 0) {
      alert('Por favor, insira um valor válido');
      return;
    }

    setLoading(true);
    try {
      await onConfirm(amount);
      setOpeningAmount('');
      onClose();
    } catch (error) {
      console.error('Erro ao abrir caixa:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpeningAmount('');
    onClose();
  };

  const formatCurrency = (value) => {
    const numericValue = value.replace(/\D/g, '');
    const formattedValue = (parseFloat(numericValue) / 100).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return formattedValue === 'NaN' ? '' : formattedValue;
  };

  const handleAmountChange = (e) => {
    const formatted = formatCurrency(e.target.value);
    setOpeningAmount(formatted);
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
              handleClose();
            }
          }}
        >
          <motion.div
            className="w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <NeuCard darkMode={darkMode} className="relative">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b dark:border-gray-600">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                      Abrir Caixa PDV
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Informe o valor inicial do caixa
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Informações */}
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-200">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Data e Hora: {format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </span>
                </div>
              </div>

              {/* Formulário */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <NeuInput
                    darkMode={darkMode}
                    label="Valor de Abertura"
                    type="text"
                    value={openingAmount}
                    onChange={handleAmountChange}
                    placeholder="0,00"
                    required
                    className="text-lg font-semibold text-center"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                    Informe o valor em dinheiro disponível no caixa
                  </p>
                </div>

                {/* Valores Sugeridos */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setOpeningAmount('50,00')}
                    className="p-2 text-sm text-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    R$ 50,00
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpeningAmount('100,00')}
                    className="p-2 text-sm text-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    R$ 100,00
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpeningAmount('200,00')}
                    className="p-2 text-sm text-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    R$ 200,00
                  </button>
                </div>

                {/* Botões de Ação */}
                <div className="flex space-x-3 pt-4 border-t dark:border-gray-600">
                  <NeuButton 
                    darkMode={darkMode} 
                    variant="secondary"
                    onClick={handleClose}
                    disabled={loading}
                    className="flex-1"
                  >
                    Cancelar
                  </NeuButton>
                  <NeuButton 
                    darkMode={darkMode} 
                    variant="primary"
                    type="submit"
                    disabled={loading || !openingAmount}
                    className="flex-1"
                  >
                    {loading ? 'Abrindo...' : 'Abrir Caixa'}
                  </NeuButton>
                </div>
              </form>
            </NeuCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}