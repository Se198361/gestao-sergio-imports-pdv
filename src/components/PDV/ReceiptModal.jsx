import React, { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Printer, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useApp } from '../../contexts/AppContext';
import NeuCard from '../Layout/NeuCard';
import NeuButton from '../Layout/NeuButton';
import Receipt from './Receipt';
import toast from 'react-hot-toast';

export default function ReceiptModal({ sale, onClose }) {
  const { darkMode } = useApp();
  const componentToPrintRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handlePrint = useCallback(async () => {
    if (!componentToPrintRef.current) {
      toast.error("Erro ao preparar impressão. Tente novamente.");
      return;
    }

    try {
      // Cria uma nova janela para impressão
      const printWindow = window.open('', '_blank');
      
      if (!printWindow) {
        toast.error("Bloqueador de pop-up ativo. Permita pop-ups e tente novamente.");
        return;
      }

      // Obter o conteúdo HTML do recibo
      const receiptContent = componentToPrintRef.current.innerHTML;
      
      // HTML completo para a janela de impressão
      const printHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Recibo-Venda-${sale.id}</title>
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
              }
              * {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
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
            
            /* Garantir que todas as classes sejam aplicadas */
            .bg-receipt-yellow {
              background-color: #fff9e5 !important;
            }
            .text-black {
              color: #000000 !important;
            }
            .font-mono {
              font-family: 'Courier New', monospace !important;
            }
            .text-xs {
              font-size: 8px !important;
            }
            .leading-tight {
              line-height: 1.1 !important;
            }
            .overflow-hidden {
              overflow: hidden !important;
            }
            .text-center {
              text-align: center !important;
            }
            .font-bold {
              font-weight: bold !important;
            }
            .mx-auto {
              margin-left: auto !important;
              margin-right: auto !important;
            }
            .mb-1 {
              margin-bottom: 1mm !important;
            }
            .my-1 {
              margin-top: 1mm !important;
              margin-bottom: 1mm !important;
            }
            .border-t {
              border-top: 1px dashed #000000 !important;
            }
            .border-dashed {
              border-style: dashed !important;
            }
            .border-black {
              border-color: #000000 !important;
            }
            
            /* Garantir linhas divisórias consistentes */
            div[style*="borderTop"] {
              border-top: 1px dashed #000000 !important;
              width: 100% !important;
              height: 1px !important;
            }
            
            /* Garantir que o texto da política de troca seja exibido completamente */
            div[style*="textAlign: justify"] {
              text-align: justify !important;
              word-wrap: break-word !important;
              hyphens: auto !important;
              overflow-wrap: break-word !important;
            }
            .flex {
              display: flex !important;
            }
            .justify-between {
              justify-content: space-between !important;
            }
            .flex-shrink-0 {
              flex-shrink: 0 !important;
            }
            .flex-1 {
              flex: 1 !important;
            }
            .truncate {
              overflow: hidden !important;
              text-overflow: ellipsis !important;
              white-space: nowrap !important;
            }
            .px-1 {
              padding-left: 1mm !important;
              padding-right: 1mm !important;
            }
            .w-6 {
              width: 6mm !important;
            }
            .text-right {
              text-align: right !important;
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
      
      // Aguarda o carregamento e imprime
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 250);
      };
      
      toast.success("Enviado para impressão!");
    } catch (error) {
      console.error("Erro ao imprimir:", error);
      toast.error("Ocorreu um erro ao tentar imprimir.");
    }
  }, [sale.id]);

  const handleDownloadPdf = async () => {
    if (!componentToPrintRef.current) {
      toast.error("Erro ao preparar PDF. Tente novamente.");
      return;
    }
    setIsDownloading(true);
    toast.loading('Gerando PDF...', { id: 'pdf-toast' });

    try {
      const canvas = await html2canvas(componentToPrintRef.current, {
        scale: 3, // Aumenta a resolução
        backgroundColor: '#fff9e5',
        useCORS: true,
        width: 219, // 58mm em pixels (58mm * 3.78 pixels/mm)
        height: 302, // 80mm em pixels (80mm * 3.78 pixels/mm)
      });

      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [58, 80] // Dimensões exatas do recibo
      });

      // Adiciona a imagem ocupando toda a página
      pdf.addImage(imgData, 'PNG', 0, 0, 58, 80);
      pdf.save(`recibo-venda-${sale.id}.pdf`);
      
      toast.success('PDF gerado com sucesso!', { id: 'pdf-toast' });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error('Falha ao gerar o PDF.', { id: 'pdf-toast' });
    } finally {
      setIsDownloading(false);
    }
  };

  if (!sale) {
    return null;
  }

  return (
    <>
      {/* Componente para impressão - sempre presente mas oculto */}
      <div className="absolute" style={{ left: '-9999px', top: '-9999px' }}>
        <div ref={componentToPrintRef}>
          <Receipt sale={sale} />
        </div>
      </div>

      <AnimatePresence>
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
                  Recibo da Venda
                </h2>
                <button onClick={onClose} className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* Preview do recibo - usando o mesmo componente */}
              <div className="max-h-[60vh] overflow-y-auto mb-6 p-2 bg-gray-200 dark:bg-gray-800 rounded-lg flex justify-center">
                <div className="transform scale-150 origin-top">
                  <Receipt sale={sale} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                <NeuButton 
                  darkMode={darkMode} 
                  variant="success" 
                  onClick={handleDownloadPdf}
                  className="w-full"
                  disabled={isDownloading}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isDownloading ? 'Baixando...' : 'PDF'}
                </NeuButton>
              </div>
            </NeuCard>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
