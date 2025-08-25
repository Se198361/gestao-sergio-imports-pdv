import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, RefreshCw, Package, FileText, Download, Calendar, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import NeuCard from '../Layout/NeuCard';
import NeuButton from '../Layout/NeuButton';
import jsPDF from 'jspdf';

export default function CloseCashModal({ isOpen, onClose, onConfirm, dailyReport, darkMode }) {
  const reportRef = useRef();

  const generatePDF = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;
    let yPosition = 20;

    // Configurar fonte
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    
    // Cabeçalho
    pdf.text('RELATÓRIO DE FECHAMENTO DE CAIXA', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;
    
    pdf.setFontSize(12);
    pdf.text('Sérgio Imports', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;

    // Informações do período
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    
    const openingDate = format(new Date(dailyReport.openingDate), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    const closingDate = format(new Date(dailyReport.closingDate), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    
    pdf.text(`Abertura: ${openingDate}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Fechamento: ${closingDate}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Valor de Abertura: ${dailyReport.openingAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`, 20, yPosition);
    yPosition += 15;

    // Resumo Financeiro
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('RESUMO FINANCEIRO', 20, yPosition);
    yPosition += 10;
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text(`Total de Vendas: ${dailyReport.totalSalesCount}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Valor Total Vendido: ${dailyReport.totalSales.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Total de Trocas: ${dailyReport.totalExchangesCount}`, 20, yPosition);
    yPosition += 6;
    
    const finalAmount = dailyReport.openingAmount + dailyReport.totalSales;
    pdf.text(`Valor Final Esperado: ${finalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`, 20, yPosition);
    yPosition += 15;

    // Vendas Detalhadas
    if (dailyReport.sales.length > 0) {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('VENDAS DO DIA', 20, yPosition);
      yPosition += 10;
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      
      dailyReport.sales.forEach((sale, index) => {
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }
        
        const saleTime = format(new Date(sale.date), 'HH:mm', { locale: ptBR });
        pdf.text(`${index + 1}. ${saleTime} - ${sale.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} (${sale.paymentMethod})`, 20, yPosition);
        yPosition += 5;
      });
      yPosition += 10;
    }

    // Produtos Vendidos
    if (Object.keys(dailyReport.productsSold).length > 0) {
      if (yPosition > 200) {
        pdf.addPage();
        yPosition = 20;
      }
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('PRODUTOS VENDIDOS', 20, yPosition);
      yPosition += 10;
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      
      Object.entries(dailyReport.productsSold).forEach(([product, quantity]) => {
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(`${product}: ${quantity} unidade(s)`, 20, yPosition);
        yPosition += 6;
      });
    }

    // Trocas
    if (dailyReport.exchanges.length > 0) {
      if (yPosition > 200) {
        pdf.addPage();
        yPosition = 20;
      }
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('TROCAS DO DIA', 20, yPosition);
      yPosition += 10;
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      
      dailyReport.exchanges.forEach((exchange, index) => {
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }
        const exchangeTime = format(new Date(exchange.date), 'HH:mm', { locale: ptBR });
        pdf.text(`${index + 1}. ${exchangeTime} - Venda #${exchange.saleId} - ${exchange.reason}`, 20, yPosition);
        yPosition += 6;
      });
    }

    // Salvar PDF
    const fileName = `relatorio-caixa-${format(new Date(), 'yyyy-MM-dd-HHmm')}.pdf`;
    pdf.save(fileName);
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  if (!dailyReport) return null;

  const finalAmount = dailyReport.openingAmount + dailyReport.totalSales;

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
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                      Relatório de Fechamento
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Resumo das atividades do dia
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div ref={reportRef} className="space-y-6">
                {/* Período */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-200 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium">Abertura</span>
                    </div>
                    <p className="text-sm">
                      {format(new Date(dailyReport.openingDate), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                    <p className="text-lg font-bold text-blue-800 dark:text-blue-200">
                      {dailyReport.openingAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center space-x-2 text-green-800 dark:text-green-200 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium">Fechamento</span>
                    </div>
                    <p className="text-sm">
                      {format(new Date(dailyReport.closingDate), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                    <p className="text-lg font-bold text-green-800 dark:text-green-200">
                      {finalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                  </div>
                </div>

                {/* Resumo */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                    <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                      {dailyReport.totalSalesCount}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Vendas</p>
                    <p className="text-lg font-semibold text-green-600">
                      {dailyReport.totalSales.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                    <RefreshCw className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                      {dailyReport.totalExchangesCount}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Trocas</p>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                    <Package className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                      {Object.keys(dailyReport.productsSold).length}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Produtos Únicos</p>
                  </div>
                </div>

                {/* Detalhes das Vendas */}
                {dailyReport.sales.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                      Vendas do Dia ({dailyReport.sales.length})
                    </h3>
                    <div className="max-h-48 overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th className="px-4 py-2 text-left">Hora</th>
                            <th className="px-4 py-2 text-left">Cliente</th>
                            <th className="px-4 py-2 text-left">Valor</th>
                            <th className="px-4 py-2 text-left">Pagamento</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dailyReport.sales.map((sale, index) => (
                            <tr key={index} className="border-b dark:border-gray-600">
                              <td className="px-4 py-2">
                                {format(new Date(sale.date), 'HH:mm', { locale: ptBR })}
                              </td>
                              <td className="px-4 py-2">
                                {sale.client?.name || 'N/A'}
                              </td>
                              <td className="px-4 py-2 font-semibold">
                                {sale.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                              </td>
                              <td className="px-4 py-2">
                                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
                                  {sale.paymentMethod}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Produtos Vendidos */}
                {Object.keys(dailyReport.productsSold).length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                      Produtos Vendidos
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-48 overflow-y-auto">
                      {Object.entries(dailyReport.productsSold).map(([product, quantity]) => (
                        <div key={product} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <span className="text-sm text-gray-800 dark:text-gray-200">{product}</span>
                          <span className="font-semibold text-blue-600 dark:text-blue-400">{quantity}x</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Botões de Ação */}
              <div className="flex space-x-3 mt-8 pt-6 border-t dark:border-gray-600">
                <NeuButton 
                  darkMode={darkMode} 
                  variant="secondary"
                  onClick={generatePDF}
                  className="flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Baixar PDF</span>
                </NeuButton>
                
                <div className="flex-1" />
                
                <NeuButton 
                  darkMode={darkMode} 
                  variant="secondary"
                  onClick={onClose}
                >
                  Cancelar
                </NeuButton>
                <NeuButton 
                  darkMode={darkMode} 
                  variant="primary"
                  onClick={handleConfirm}
                >
                  Fechar Caixa
                </NeuButton>
              </div>
            </NeuCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}