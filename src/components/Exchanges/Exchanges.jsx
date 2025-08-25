import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Plus, Eye, Printer, X, User, Package, DollarSign, Calendar, Trash2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import NeuCard from '../Layout/NeuCard';
import NeuButton from '../Layout/NeuButton';
import NeuInput from '../Layout/NeuInput';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const exchangeReasons = [
  'Defeito de fabricação',
  'Tamanho/Modelo incorreto',
  'Não gostei do produto',
  'Outro motivo'
];

const statusOptions = ['Pendente', 'Concluída', 'Cancelada'];

export default function Exchanges() {
  const { darkMode, exchanges, sales, addExchange, updateExchange, deleteExchange, settings } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [selectedExchange, setSelectedExchange] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [formData, setFormData] = useState({
    saleId: '',
    reason: exchangeReasons[0],
    description: '',
    status: 'Pendente',
    returnedValue: 0,
    receivedProduct: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (id, newStatus) => {
    updateExchange(id, newStatus);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addExchange({
      ...formData,
      date: new Date().toISOString(),
    });
    setFormData({ 
      saleId: '', 
      reason: exchangeReasons[0], 
      description: '', 
      status: 'Pendente',
      returnedValue: 0,
      receivedProduct: ''
    });
    setShowForm(false);
  };

  // Função para obter detalhes da venda
  const getSaleDetails = (saleId) => {
    return sales.find(sale => sale.id.toString() === saleId.toString());
  };

  // Função para mostrar detalhes da troca
  const showExchangeDetails = (exchange) => {
    setSelectedExchange(exchange);
  };

  // Função para imprimir recibo de troca
  const printExchangeReceipt = (exchange) => {
    setSelectedExchange(exchange);
    setShowReceiptModal(true);
  };

  // Função para excluir troca com confirmação
  const handleDeleteExchange = (exchange) => {
    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir a troca #${exchange.id}?\n\n` +
      `Motivo: ${exchange.reason}\n` +
      `Status: ${exchange.status}\n` +
      `Data: ${format(new Date(exchange.date), "dd/MM/yyyy", { locale: ptBR })}\n\n` +
      `Esta ação não pode ser desfeita.`
    );

    if (confirmDelete) {
      deleteExchange(exchange.id);
    }
  };

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
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white animate-glow">
              Sistema de Trocas
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Gerencie as trocas de produtos.
            </p>
          </div>
          <NeuButton darkMode={darkMode} neon onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            {showForm ? 'Cancelar Troca' : 'Registrar Nova Troca'}
          </NeuButton>
        </div>
      </NeuCard>

      {showForm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <NeuCard darkMode={darkMode}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-xl font-semibold dark:text-white">Nova Troca</h3>
              <NeuInput darkMode={darkMode} label="ID da Venda Original" name="saleId" value={formData.saleId} onChange={handleChange} required />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Motivo</label>
                <select name="reason" value={formData.reason} onChange={handleChange} className="w-full p-3 bg-gray-100 dark:bg-gray-900 border-0 rounded-lg dark:text-white" style={{ boxShadow: darkMode ? 'inset 4px 4px 8px #1a1a1a, inset -4px -4px 8px #2e2e2e' : 'inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff' }}>
                  {exchangeReasons.map(reason => <option key={reason} value={reason}>{reason}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descrição</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full p-3 bg-gray-100 dark:bg-gray-900 border-0 rounded-lg dark:text-white" style={{ boxShadow: darkMode ? 'inset 4px 4px 8px #1a1a1a, inset -4px -4px 8px #2e2e2e' : 'inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff' }}></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NeuInput 
                  darkMode={darkMode} 
                  label="Valor Devolvido (R$)" 
                  name="returnedValue" 
                  type="number" 
                  step="0.01"
                  value={formData.returnedValue} 
                  onChange={handleChange} 
                />
                <NeuInput 
                  darkMode={darkMode} 
                  label="Produto Recebido" 
                  name="receivedProduct" 
                  value={formData.receivedProduct} 
                  onChange={handleChange} 
                  placeholder="Nome do produto recebido na troca"
                />
              </div>
              <div className="flex justify-end">
                <NeuButton type="submit" darkMode={darkMode} variant="primary">Registrar Troca</NeuButton>
              </div>
            </form>
          </NeuCard>
        </motion.div>
      )}

      <NeuCard darkMode={darkMode}>
        <h3 className="text-xl font-semibold mb-4 dark:text-white">Histórico de Trocas</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Data</th>
                <th scope="col" className="px-6 py-3">ID Venda</th>
                <th scope="col" className="px-6 py-3">Motivo</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {exchanges.sort((a, b) => new Date(b.date) - new Date(a.date)).map((exchange) => (
                <tr key={exchange.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                  <td className="px-6 py-4 dark:text-white">{format(new Date(exchange.date), "dd/MM/yyyy", { locale: ptBR })}</td>
                  <td className="px-6 py-4 dark:text-white">#{exchange.saleId}</td>
                  <td className="px-6 py-4 dark:text-white">{exchange.reason}</td>
                  <td className="px-6 py-4">
                    <select
                      value={exchange.status}
                      onChange={(e) => handleStatusChange(exchange.id, e.target.value)}
                      className="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 dark:bg-gray-700 dark:text-white border-transparent focus:border-transparent focus:ring-0"
                    >
                      {statusOptions.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <NeuButton
                        darkMode={darkMode}
                        variant="secondary"
                        size="sm"
                        onClick={() => showExchangeDetails(exchange)}
                        title="Ver detalhes"
                      >
                        <Eye className="w-4 h-4" />
                      </NeuButton>
                      {exchange.status === 'Concluída' && (
                        <NeuButton
                          darkMode={darkMode}
                          variant="primary"
                          size="sm"
                          onClick={() => printExchangeReceipt(exchange)}
                          title="Imprimir recibo"
                        >
                          <Printer className="w-4 h-4" />
                        </NeuButton>
                      )}
                      <NeuButton
                        darkMode={darkMode}
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteExchange(exchange)}
                        title="Excluir troca"
                      >
                        <Trash2 className="w-4 h-4" />
                      </NeuButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {exchanges.length === 0 && (
            <div className="text-center py-8">
              <RefreshCw className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Nenhuma troca registrada.</p>
            </div>
          )}
        </div>
      </NeuCard>

      {/* Modal de Detalhes da Troca */}
      <AnimatePresence>
        {selectedExchange && !showReceiptModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedExchange(null)}
          >
            <motion.div
              className="w-full max-w-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <NeuCard darkMode={darkMode}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    Detalhes da Troca #{selectedExchange.id}
                  </h2>
                  <button 
                    onClick={() => setSelectedExchange(null)}
                    className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Informações da Troca */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                      <RefreshCw className="w-5 h-5 mr-2" />
                      Informações da Troca
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Data:</span>
                        <span className="ml-2 font-medium text-gray-800 dark:text-gray-200">
                          {format(new Date(selectedExchange.date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <Package className="w-4 h-4 mr-2 text-gray-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">ID Venda Original:</span>
                        <span className="ml-2 font-medium text-gray-800 dark:text-gray-200">
                          #{selectedExchange.saleId}
                        </span>
                      </div>
                      
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Motivo:</span>
                        <span className="ml-2 font-medium text-gray-800 dark:text-gray-200">
                          {selectedExchange.reason}
                        </span>
                      </div>
                      
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                          selectedExchange.status === 'Concluída' 
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                            : selectedExchange.status === 'Pendente'
                            ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                            : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                        }`}>
                          {selectedExchange.status}
                        </span>
                      </div>
                      
                      {selectedExchange.description && (
                        <div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">Descrição:</span>
                          <p className="mt-1 p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm text-gray-800 dark:text-gray-200">
                            {selectedExchange.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Detalhes da Venda Original */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                      <Package className="w-5 h-5 mr-2" />
                      Venda Original
                    </h3>
                    
                    {(() => {
                      const originalSale = getSaleDetails(selectedExchange.saleId);
                      if (!originalSale) {
                        return (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Venda não encontrada no sistema.
                          </p>
                        );
                      }
                      
                      return (
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2 text-gray-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Cliente:</span>
                            <span className="ml-2 font-medium text-gray-800 dark:text-gray-200">
                              {originalSale.client?.name || 'Não identificado'}
                            </span>
                          </div>
                          
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Total da Venda:</span>
                            <span className="ml-2 font-medium text-gray-800 dark:text-gray-200">
                              {originalSale.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </span>
                          </div>
                          
                          <div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Itens da Venda:</span>
                            <div className="mt-2 space-y-1">
                              {originalSale.items.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded">
                                  <span>{item.quantity}x {item.name}</span>
                                  <span className="font-medium">
                                    {item.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
                
                {/* Botões de Ação */}
                <div className="flex justify-end mt-6 space-x-3">
                  <NeuButton 
                    darkMode={darkMode} 
                    variant="secondary" 
                    onClick={() => setSelectedExchange(null)}
                  >
                    Fechar
                  </NeuButton>
                  {selectedExchange.status === 'Concluída' && (
                    <NeuButton 
                      darkMode={darkMode} 
                      variant="primary" 
                      onClick={() => printExchangeReceipt(selectedExchange)}
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      Imprimir Recibo
                    </NeuButton>
                  )}
                </div>
              </NeuCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Recibo de Troca */}
      <AnimatePresence>
        {showReceiptModal && selectedExchange && (
          <ExchangeReceiptModal 
            exchange={selectedExchange}
            originalSale={getSaleDetails(selectedExchange.saleId)}
            settings={settings}
            darkMode={darkMode}
            onClose={() => {
              setShowReceiptModal(false);
              setSelectedExchange(null);
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Componente de Recibo de Troca
function ExchangeReceiptModal({ exchange, originalSale, settings, darkMode, onClose }) {
  const receiptRef = React.useRef(null);

  const handlePrint = () => {
    if (!receiptRef.current) {
      return;
    }

    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      alert("Bloqueador de pop-up ativo. Permita pop-ups e tente novamente.");
      return;
    }

    const receiptContent = receiptRef.current.innerHTML;
    
    const printHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Recibo-Troca-${exchange.id}</title>
        <style>
          @page {
            size: 58mm 80mm;
            margin: 0;
          }
          @media print {
            body {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              margin: 0;
              padding: 0;
              width: 58mm;
              height: 80mm;
              overflow: hidden;
              background-color: #fff9e5;
            }
          }
          body {
            font-family: 'Courier New', monospace;
            margin: 0;
            padding: 0;
            width: 58mm;
            height: 80mm;
            overflow: hidden;
            background-color: #fff9e5;
          }
          .bg-receipt-yellow { background-color: #fff9e5 !important; }
          .text-black { color: #000000 !important; }
          .font-mono { font-family: 'Courier New', monospace !important; }
          .text-xs { font-size: 8px !important; }
          .leading-tight { line-height: 1.1 !important; }
          .overflow-hidden { overflow: hidden !important; }
          .text-center { text-align: center !important; }
          .font-bold { font-weight: bold !important; }
          .mx-auto { margin-left: auto !important; margin-right: auto !important; }
          .mb-1 { margin-bottom: 1mm !important; }
          .my-1 { margin-top: 1mm !important; margin-bottom: 1mm !important; }
          .flex { display: flex !important; }
          .justify-between { justify-content: space-between !important; }
          .text-right { text-align: right !important; }
          div[style*="borderTop"] {
            border-top: 1px dashed #000000 !important;
            width: 100% !important;
            height: 1px !important;
          }
        </style>
      </head>
      <body>
        ${receiptContent}
      </body>
      </html>
    `;
    
    printWindow.document.write(printHTML);
    printWindow.document.close();
    
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    };
  };

  const formatCurrency = (value) => {
    try {
      const numValue = typeof value === 'number' ? value : parseFloat(value) || 0;
      return numValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    } catch (error) {
      return 'R$ 0,00';
    }
  };

  const formatDate = (date) => {
    try {
      const exchangeDate = new Date(date);
      if (isNaN(exchangeDate.getTime())) {
        return new Date().toLocaleDateString('pt-BR');
      }
      return format(exchangeDate, "dd/MM/yyyy 'às' HH:mm:ss", { locale: ptBR });
    } catch (error) {
      return new Date().toLocaleDateString('pt-BR');
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <NeuCard darkMode={darkMode}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
              Recibo de Troca
            </h2>
            <button onClick={onClose} className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Preview do recibo - oculto para impressão */}
          <div className="absolute" style={{ left: '-9999px', top: '-9999px' }}>
            <div ref={receiptRef}>
              <ExchangeReceipt exchange={exchange} originalSale={originalSale} settings={settings} formatCurrency={formatCurrency} formatDate={formatDate} />
            </div>
          </div>
          
          {/* Preview visível */}
          <div className="max-h-[60vh] overflow-y-auto mb-6 p-2 bg-gray-200 dark:bg-gray-800 rounded-lg flex justify-center">
            <div className="transform scale-150 origin-top">
              <ExchangeReceipt exchange={exchange} originalSale={originalSale} settings={settings} formatCurrency={formatCurrency} formatDate={formatDate} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <NeuButton darkMode={darkMode} variant="secondary" onClick={onClose} className="w-full">
              Fechar
            </NeuButton>
            <NeuButton 
              darkMode={darkMode} 
              variant="primary" 
              onClick={handlePrint}
              className="w-full"
            >
              <Printer className="w-4 h-4 mr-2" />
              Imprimir
            </NeuButton>
          </div>
        </NeuCard>
      </motion.div>
    </motion.div>
  );
}

// Componente do Recibo de Troca
function ExchangeReceipt({ exchange, originalSale, settings, formatCurrency, formatDate }) {
  return (
    <div 
      className="bg-receipt-yellow text-black font-mono text-xs leading-tight overflow-hidden"
      style={{
        width: '58mm',
        height: '80mm',
        padding: '1mm',
        fontSize: '8px',
        lineHeight: '1.1'
      }}
    >
      {/* Cabeçalho da Empresa */}
      <div className="text-center mb-1">
        {settings.companyLogo && (
          <img 
            src={settings.companyLogo} 
            alt="Logo" 
            className="mx-auto" 
            style={{ width: '12mm', height: 'auto', maxHeight: '6mm' }}
          />
        )}
        <div className="font-bold" style={{ fontSize: '9px' }}>
          {settings.companyName || 'Sua Empresa'}
        </div>
        <div style={{ fontSize: '7px' }}>
          {settings.address || 'Seu Endereço'}
        </div>
        <div style={{ fontSize: '7px' }}>
          CNPJ: {settings.cnpj || '00.000.000/0001-00'}
        </div>
      </div>

      {/* Separador */}
      <div 
        className="my-1" 
        style={{
          borderTop: '1px dashed #000000',
          width: '100%',
          height: '1px',
          marginTop: '1mm',
          marginBottom: '1mm'
        }}
      ></div>

      {/* Título e Data */}
      <div className="text-center mb-1">
        <div className="font-bold" style={{ fontSize: '8px' }}>RECIBO DE TROCA</div>
        <div style={{ fontSize: '7px' }}>{formatDate(exchange.date)}</div>
      </div>

      {/* Informações da Troca */}
      <div className="mb-1" style={{ fontSize: '7px' }}>
        <div>Troca: #{exchange.id || 'N/A'}</div>
        <div>Venda Orig.: #{exchange.saleId || 'N/A'}</div>
        {originalSale?.client && (
          <div>Cliente: {originalSale.client.name.substring(0, 25)}</div>
        )}
      </div>

      {/* Separador */}
      <div 
        className="my-1" 
        style={{
          borderTop: '1px dashed #000000',
          width: '100%',
          height: '1px',
          marginTop: '1mm',
          marginBottom: '1mm'
        }}
      ></div>

      {/* Detalhes da Troca */}
      <div className="font-bold text-center mb-1" style={{ fontSize: '8px' }}>DETALHES</div>
      
      <div className="mb-1" style={{ fontSize: '7px' }}>
        <div>Motivo: {exchange.reason}</div>
        {exchange.receivedProduct && (
          <div>Produto Recebido: {exchange.receivedProduct.substring(0, 25)}</div>
        )}
      </div>

      {/* Separador */}
      <div 
        className="my-1" 
        style={{
          borderTop: '1px dashed #000000',
          width: '100%',
          height: '1px',
          marginTop: '1mm',
          marginBottom: '1mm'
        }}
      ></div>

      {/* Valores */}
      <div className="mb-1" style={{ fontSize: '7px' }}>
        {originalSale && (
          <div className="flex justify-between">
            <span>Venda Original:</span>
            <span>{formatCurrency(originalSale.total)}</span>
          </div>
        )}
        {exchange.returnedValue > 0 && (
          <div className="flex justify-between font-bold" style={{ fontSize: '8px' }}>
            <span>VALOR DEVOLVIDO:</span>
            <span>{formatCurrency(exchange.returnedValue)}</span>
          </div>
        )}
      </div>

      {/* Separador */}
      <div 
        className="my-1" 
        style={{
          borderTop: '1px dashed #000000',
          width: '100%',
          height: '1px',
          marginTop: '1mm',
          marginBottom: '1mm'
        }}
      ></div>

      {/* Status */}
      <div className="text-center mb-1" style={{ fontSize: '7px' }}>
        <div className="font-bold">STATUS: {exchange.status.toUpperCase()}</div>
      </div>

      {/* Separador */}
      <div 
        className="my-1" 
        style={{
          borderTop: '1px dashed #000000',
          width: '100%',
          height: '1px',
          marginTop: '1mm',
          marginBottom: '1mm'
        }}
      ></div>

      {/* Mensagem Final */}
      <div className="text-center" style={{ fontSize: '6px' }}>
        <div>Troca processada com sucesso!</div>
        <div>Obrigado pela compreensão.</div>
        {settings.receiptMessage1 && <div>{settings.receiptMessage1}</div>}
      </div>
    </div>
  );
}
