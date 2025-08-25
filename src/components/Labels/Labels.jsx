import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tag, Printer, Download, Check, X, Percent } from 'lucide-react';
import Barcode from 'react-barcode';
import JsBarcode from 'jsbarcode';
import jsPDF from 'jspdf';
import { useApp } from '../../contexts/AppContext';
import NeuCard from '../Layout/NeuCard';
import NeuButton from '../Layout/NeuButton';
import NeuInput from '../Layout/NeuInput';
import toast from 'react-hot-toast';

export default function Labels() {
  const { darkMode, products, settings } = useApp();
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [labelType, setLabelType] = useState('normal'); // 'normal' ou 'promo'
  const [promoDiscount, setPromoDiscount] = useState(10); // percentual de desconto

  // Função para calcular tamanho da fonte do preço baseado no comprimento
  const calculatePriceFontSize = (price) => {
    const priceText = price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const textLength = priceText.length;
    
    // Ajustar fonte baseado no comprimento do texto
    if (textLength <= 8) return '16px';
    if (textLength <= 10) return '14px';
    if (textLength <= 12) return '12px';
    return '10px';
  };

  // Função para calcular preço promocional
  const calculatePromoPrice = (originalPrice, discountPercent) => {
    return originalPrice * (1 - discountPercent / 100);
  };

  // Função para gerar código de barras como imagem base64
  const generateBarcodeImage = (barcodeValue) => {
    try {
      const canvas = document.createElement('canvas');
      JsBarcode(canvas, barcodeValue, {
        format: 'EAN13',
        width: 1.5,
        height: 30,
        fontSize: 10,
        margin: 0,
        background: '#ffffff',
        lineColor: '#000000',
        displayValue: true
      });
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.warn('Erro ao gerar código de barras:', error);
      return null;
    }
  };

  // Função customizada de impressão (compatível com React 19)
  const handlePrint = () => {
    const selectedProducts = getSelectedProducts();
    if (selectedProducts.length === 0) {
      toast.error("Selecione ao menos uma etiqueta para imprimir.");
      return;
    }

    try {
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      
      if (!printWindow) {
        toast.error("Pop-up bloqueado! Permita pop-ups para este site.");
        return;
      }

      const printContent = generatePrintContent(selectedProducts);
      
      printWindow.document.open();
      printWindow.document.write(printContent);
      printWindow.document.close();
      
      // Aguardar o carregamento completo antes de imprimir
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        
        // Aguardar a impressão antes de fechar
        setTimeout(() => {
          printWindow.close();
        }, 1000);
      }, 1000); // Reduzido para 1 segundo pois as imagens já estão pré-geradas
      
    } catch (error) {
      console.error('Erro ao abrir janela de impressão:', error);
      toast.error("Erro ao abrir janela de impressão. Verifique as configurações do navegador.");
    }
  };

  // Gerar conteúdo HTML para impressão
  const generatePrintContent = (selectedProducts) => {
    const labels = selectedProducts.map(({ product, quantity }) => {
      const barcodeValue = (product.barcode || '').replace(/\D/g, '').slice(0, 12);
      const isValidForEan13 = barcodeValue.length === 12;
      const barcodeImage = isValidForEan13 ? generateBarcodeImage(barcodeValue) : null;
      
      // Calcular preços para etiqueta promocional
      const originalPrice = product.price;
      const promoPrice = calculatePromoPrice(originalPrice, promoDiscount);
      const isPromo = labelType === 'promo';
      
      return Array(quantity).fill(0).map((_, index) => `
        <div style="
          width: ${isPromo ? '170px' : '180px'};
          height: ${isPromo ? '150px' : '120px'};
          background: ${isPromo ? 'linear-gradient(135deg, #fb923c 0%, #ef4444 100%)' : '#e5e7eb'};
          border-radius: 6px;
          padding: ${isPromo ? '12px' : '10px'};
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          color: ${isPromo ? 'white' : 'black'};
          page-break-inside: avoid;
          margin: 8px;
          float: left;
          position: relative;
          overflow: hidden;
        ">
          ${isPromo ? `
          <!-- Selo de Promoção -->
          <div style="
            position: absolute;
            top: 0px;
            right: 0px;
            background: #dc2626;
            color: white;
            padding: 1px 2px;
            border-radius: 2px;
            font-size: 5px;
            font-weight: bold;
            line-height: 1;
            z-index: 10;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          ">
            -${promoDiscount}%
          </div>
          ` : ''}
          
          <!-- Seção Superior: Logo e Nome -->
          <div style="
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            ${isPromo ? 'margin-bottom: 8px;' : 'margin-bottom: 8px;'}
            flex-shrink: 0;
          ">
            ${settings.companyLogo && !isPromo ? `<img src="${settings.companyLogo}" alt="Logo" style="height: ${isPromo ? '18px' : '18px'}; max-width: 80%; margin-bottom: ${isPromo ? '3px' : '3px'}; object-fit: contain;" />` : ''}
            ${isPromo ? `
            <div style="
              background: rgba(255, 255, 255, 0.95);
              color: #dc2626;
              padding: 2px 8px;
              border-radius: 4px;
              font-size: 12px;
              font-weight: bold;
              margin-bottom: 6px;
              line-height: 1;
            ">
              PROMOÇÃO
            </div>
            ` : ''}
            <p style="
              font-size: ${isPromo ? '14px' : '12px'};
              font-weight: 800;
              line-height: 1.25;
              margin: 0;
              padding: 0;
              text-align: center;
              word-wrap: break-word;
              max-height: ${isPromo ? '32px' : '30px'};
              overflow: hidden;
              display: -webkit-box;
              -webkit-line-clamp: ${isPromo ? '2' : '2'};
              -webkit-box-orient: vertical;
            ">
              ${product.name}
            </p>
          </div>
          
          <!-- Seção Central: Código de Barras -->
          <div style="
            width: 100%;
            height: ${isPromo ? '40px' : '45px'};
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            margin: ${isPromo ? '4px 0' : '0'};
          ">
            ${barcodeImage ? 
              `<img src="${barcodeImage}" alt="Código de barras" style="max-width: 100%; height: auto; object-fit: contain;" />` :
              `<div style="
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #ef4444;
                font-size: ${isPromo ? '9px' : '9px'};
                padding: 0 2px;
                font-weight: 600;
                text-align: center;
                line-height: 1;
              ">
                Código inválido
              </div>`
            }
          </div>

          <!-- Seção Inferior: Preço -->
          <div style="
            width: 100%;
            display: flex;
            ${isPromo ? 'flex-direction: column;' : ''}
            align-items: center;
            justify-content: center;
            ${isPromo ? 'padding: 0 4px;' : ''}
            flex-shrink: 0;
            overflow: hidden;
          ">
            ${isPromo ? `
            <p style="
              font-size: 9px;
              font-weight: 600;
              line-height: 1.25;
              margin: 0 0 2px 0;
              text-align: center;
              color: white;
              text-decoration: line-through;
              opacity: 0.9;
              max-width: 100%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            ">
              DE: ${originalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
            <p style="
              font-size: 11px;
              font-weight: 900;
              line-height: 1.25;
              margin: 0;
              text-align: center;
              color: white;
              text-shadow: 0 1px 2px rgba(0,0,0,0.1);
              max-width: 100%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            ">
              POR: ${promoPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
            ` : `
            <p style="
              font-size: ${calculatePriceFontSize(originalPrice)};
              font-weight: 900;
              line-height: 1;
              margin: 0;
              text-align: center;
              color: #000;
              max-width: 100%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            ">
              ${originalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
            `}
          </div>
        </div>
      `).join('');
    }).join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Etiquetas-${labelType === 'promo' ? 'Promocionais' : 'Produtos'}</title>
          <style>
            * { 
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            body { 
              margin: 0; 
              padding: 20px; 
              font-family: Arial, sans-serif;
              background: white;
            }
            @media print {
              body { 
                margin: 0;
                padding: 10px;
              }
              @page { 
                margin: 0.5cm;
                size: A4;
              }
            }
            .labels-container {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
              justify-content: flex-start;
              align-items: flex-start;
            }
          </style>
        </head>
        <body>
          <div class="labels-container">
            ${labels}
          </div>
        </body>
      </html>
    `;
  };

  // Obter produtos selecionados com suas quantidades
  const getSelectedProducts = () => {
    return Object.entries(selectedLabels)
      .filter(([_, data]) => data.selected && data.quantity > 0)
      .map(([productId, data]) => ({
        product: products.find(p => p.id.toString() === productId),
        quantity: parseInt(data.quantity)
      }))
      .filter(item => item.product);
  };

  // Selecionar/Deselecionar produto
  const toggleProductSelection = (productId) => {
    setSelectedLabels(prev => ({
      ...prev,
      [productId]: {
        selected: !prev[productId]?.selected,
        quantity: prev[productId]?.quantity || 1
      }
    }));
  };

  // Alterar quantidade
  const updateQuantity = (productId, quantity) => {
    const numQuantity = Math.max(1, parseInt(quantity) || 1);
    setSelectedLabels(prev => ({
      ...prev,
      [productId]: {
        selected: prev[productId]?.selected || false,
        quantity: numQuantity
      }
    }));
  };

  // Selecionar/Deselecionar todos
  const toggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    
    if (newSelectAll) {
      const allSelected = {};
      products.forEach(product => {
        allSelected[product.id] = {
          selected: true,
          quantity: selectedLabels[product.id]?.quantity || 1
        };
      });
      setSelectedLabels(allSelected);
    } else {
      setSelectedLabels({});
    }
  };

  // Verificar se todos estão selecionados
  React.useEffect(() => {
    const selectedCount = Object.values(selectedLabels).filter(item => item.selected).length;
    setSelectAll(selectedCount === products.length && products.length > 0);
  }, [selectedLabels, products]);

  const handleDownloadPdf = async () => {
    const selectedProducts = getSelectedProducts();
    if (selectedProducts.length === 0) {
      toast.error("Selecione ao menos uma etiqueta para gerar o PDF.");
      return;
    }
    
    setIsDownloading(true);
    toast.loading('Gerando PDF...', { id: 'pdf-labels-toast' });

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Configurações das etiquetas
      const labelWidth = 58; // mm
      const labelHeight = 35; // mm
      const margin = 5; // mm
      const labelsPerRow = 3;
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      let currentX = margin;
      let currentY = margin;
      let labelCount = 0;
      let isFirstPage = true;

      // Gerar etiquetas para cada produto selecionado
      for (const { product, quantity } of selectedProducts) {
        const barcodeValue = (product.barcode || '').replace(/\D/g, '').slice(0, 12);
        const isValidForEan13 = barcodeValue.length === 12;
        const originalPrice = product.price;
        const promoPrice = calculatePromoPrice(originalPrice, promoDiscount);
        const isPromo = labelType === 'promo';
        
        for (let i = 0; i < quantity; i++) {
          // Verificar se precisa de nova linha ou nova página
          if (labelCount > 0 && labelCount % labelsPerRow === 0) {
            currentX = margin;
            currentY += labelHeight + margin;
            
            // Verificar se precisa de nova página
            if (currentY + labelHeight > pageHeight - margin) {
              pdf.addPage();
              currentY = margin;
              isFirstPage = false;
            }
          }

          // Desenhar borda da etiqueta e fundo
          if (isPromo) {
            // Fundo promocional laranja/vermelho
            pdf.setFillColor(255, 107, 53); // Cor laranja/vermelha
            pdf.rect(currentX, currentY, labelWidth, labelHeight, 'F');
            // Borda vermelha
            pdf.setDrawColor(255, 68, 68);
            pdf.setLineWidth(0.5);
            pdf.rect(currentX, currentY, labelWidth, labelHeight);
          } else {
            // Fundo normal cinza
            pdf.setFillColor(229, 231, 235);
            pdf.rect(currentX, currentY, labelWidth, labelHeight, 'F');
            pdf.setDrawColor(200, 200, 200);
            pdf.rect(currentX, currentY, labelWidth, labelHeight);
          }
          
          // Selo de desconto (para etiquetas promocionais)
          if (isPromo) {
            pdf.setFillColor(255, 68, 68);
            pdf.roundedRect(currentX + labelWidth - 15, currentY + 2, 12, 6, 1, 1, 'F');
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(5);
            pdf.setFont('helvetica', 'bold');
            const discountText = `-${promoDiscount}%`;
            const discountWidth = pdf.getTextWidth(discountText);
            pdf.text(discountText, currentX + labelWidth - 9 - (discountWidth/2), currentY + 6);
          }
          
          // Adicionar logo da empresa (se existir)
          if (settings.companyLogo) {
            try {
              pdf.addImage(settings.companyLogo, 'JPEG', currentX + 2, currentY + 2, 12, 4);
            } catch (error) {
              console.warn('Erro ao adicionar logo:', error);
            }
          }
          
          // Badge "PROMOÇÃO" para etiquetas promocionais
          if (isPromo) {
            pdf.setFillColor(255, 255, 255);
            pdf.roundedRect(currentX + 2, currentY + 8, 25, 4, 2, 2, 'F');
            pdf.setTextColor(255, 68, 68);
            pdf.setFontSize(5);
            pdf.setFont('helvetica', 'bold');
            pdf.text('PROMOÇÃO', currentX + 4, currentY + 11);
          }
          
          // Adicionar nome do produto
          pdf.setFontSize(8);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(isPromo ? 255 : 0, isPromo ? 255 : 0, isPromo ? 255 : 0);
          
          const maxNameWidth = labelWidth - 4;
          const productName = product.name;
          const nameLines = pdf.splitTextToSize(productName, maxNameWidth);
          
          let nameY = currentY + (settings.companyLogo ? 8 : 4) + (isPromo ? 5 : 0);
          nameLines.slice(0, 2).forEach((line, index) => {
            pdf.text(line, currentX + 2, nameY + (index * 3));
          });
          
          // Adicionar código de barras real
          if (isValidForEan13) {
            try {
              // Criar canvas temporário para gerar o código de barras
              const canvas = document.createElement('canvas');
              JsBarcode(canvas, barcodeValue, {
                format: 'EAN13',
                width: 1,
                height: 20,
                fontSize: 8,
                margin: 0,
                background: '#ffffff',
                lineColor: '#000000'
              });
              
              const barcodeDataUrl = canvas.toDataURL('image/png');
              const barcodeY = currentY + labelHeight - 12;
              
              // Adicionar imagem do código de barras no PDF
              pdf.addImage(barcodeDataUrl, 'PNG', currentX + 3, barcodeY - 5, labelWidth - 6, 8);
            } catch (error) {
              console.warn('Erro ao gerar código de barras:', error);
              // Fallback: texto do código
              pdf.setFontSize(6);
              pdf.setFont('helvetica', 'normal');
              pdf.setTextColor(0, 0, 0);
              pdf.text(barcodeValue, currentX + (labelWidth/2) - 8, currentY + labelHeight - 8);
            }
          } else {
            pdf.setFontSize(5);
            pdf.setTextColor(255, 0, 0);
            pdf.text('Código inválido', currentX + 2, currentY + labelHeight - 8);
          }
          
          // Adicionar preço(s)
          if (isPromo) {
            // Preço original riscado
            pdf.setFontSize(2.5);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(255, 255, 255);
            const originalPriceText = `DE: ${originalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
            const originalPriceWidth = pdf.getTextWidth(originalPriceText);
            pdf.text(originalPriceText, currentX + (labelWidth/2) - (originalPriceWidth/2), currentY + labelHeight - 14);
            
            // Linha sobre o preço original
            pdf.setDrawColor(255, 255, 255);
            pdf.setLineWidth(0.1);
            pdf.line(
              currentX + (labelWidth/2) - (originalPriceWidth/2) - 1,
              currentY + labelHeight - 15,
              currentX + (labelWidth/2) + (originalPriceWidth/2) + 1,
              currentY + labelHeight - 15
            );
            
            // Preço promocional
            pdf.setFontSize(3.5);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(255, 255, 255);
            const promoText = `POR: ${promoPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
            const promoWidth = pdf.getTextWidth(promoText);
            pdf.text(promoText, currentX + (labelWidth/2) - (promoWidth/2), currentY + labelHeight - 7);
          } else {
            // Preço normal
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(0, 0, 0);
            const price = originalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            const priceWidth = pdf.getTextWidth(price);
            pdf.text(price, currentX + (labelWidth/2) - (priceWidth/2), currentY + labelHeight - 3);
          }
          
          // Próxima posição
          currentX += labelWidth + margin;
          labelCount++;
        }
      }
      
      pdf.save(`etiquetas-${labelType === 'promo' ? 'promocionais' : 'produtos'}.pdf`);
      
      toast.success('PDF gerado com sucesso!', { id: 'pdf-labels-toast' });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error('Falha ao gerar o PDF.', { id: 'pdf-labels-toast' });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <NeuCard darkMode={darkMode} neonBorder className="print:hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 animate-glow">
                Geração de Etiquetas
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Selecione as etiquetas, defina as quantidades e imprima.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <NeuButton 
                darkMode={darkMode} 
                variant="success"
                onClick={handleDownloadPdf} 
                disabled={products.length === 0 || isDownloading || getSelectedProducts().length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                {isDownloading ? 'Baixando...' : 'Baixar PDF'}
              </NeuButton>
              <NeuButton 
                darkMode={darkMode} 
                variant="primary"
                onClick={handlePrint} 
                disabled={products.length === 0 || getSelectedProducts().length === 0}
              >
                <Printer className="w-4 h-4 mr-2" />
                Imprimir Selecionadas
              </NeuButton>
            </div>
          </div>
        </NeuCard>

        {/* Controles de Tipo de Etiqueta */}
        <NeuCard darkMode={darkMode} className="print:hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Tipo de Etiqueta:</h3>
              
              {/* Botão Etiqueta Normal */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="labelType"
                  value="normal"
                  checked={labelType === 'normal'}
                  onChange={(e) => setLabelType(e.target.value)}
                  className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <Tag className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Normal</span>
              </label>
              
              {/* Botão Etiqueta Promocional */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="labelType"
                  value="promo"
                  checked={labelType === 'promo'}
                  onChange={(e) => setLabelType(e.target.value)}
                  className="w-4 h-4 text-orange-600 focus:ring-2 focus:ring-orange-500"
                />
                <Percent className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Promoção</span>
              </label>
            </div>
            
            {/* Controle de Desconto */}
            {labelType === 'promo' && (
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Desconto:</label>
                <NeuInput
                  darkMode={darkMode}
                  type="number"
                  min="1"
                  max="99"
                  value={promoDiscount}
                  onChange={(e) => setPromoDiscount(Math.max(1, Math.min(99, parseInt(e.target.value) || 10)))}
                  className="w-16 text-center"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">%</span>
              </div>
            )}
          </div>
        </NeuCard>

        {/* Controles de Seleção */}
        {products.length > 0 && (
          <NeuCard darkMode={darkMode} className="print:hidden">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Selecionar Todas ({products.length} etiquetas)
                  </span>
                </label>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold">{getSelectedProducts().length}</span> etiqueta(s) selecionada(s) • 
                <span className="font-semibold">{getSelectedProducts().reduce((sum, item) => sum + item.quantity, 0)}</span> para impressão
              </div>
            </div>
          </NeuCard>
        )}

        {/* Área de Preview das Etiquetas */}
        <div className="space-y-4">
          {products.length > 0 ? (
            <>
              {/* Lista de Produtos com Controles */}
              <div className="print:hidden space-y-3">
                {products.map((product) => {
                  const isSelected = selectedLabels[product.id]?.selected || false;
                  const quantity = selectedLabels[product.id]?.quantity || 1;
                  const barcodeValue = (product.barcode || '').replace(/\D/g, '').slice(0, 12);
                  const isValidForEan13 = barcodeValue.length === 12;

                  return (
                    <NeuCard key={product.id} darkMode={darkMode} className={`transition-all duration-200 ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
                      <div className="flex items-center gap-4">
                        {/* Checkbox de seleção */}
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleProductSelection(product.id)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          />
                        </label>

                        {/* Preview da etiqueta */}
                        <div className="flex-shrink-0">
                          <div
                            className={`rounded-md shadow-md flex flex-col items-center text-center relative ${
                              labelType === 'promo' 
                                ? 'bg-gradient-to-br from-orange-400 to-red-500 text-white border border-red-400 p-3 justify-center' 
                                : 'bg-gray-200 text-black p-3 justify-center'
                            }`}
                            style={{ width: labelType === 'promo' ? '160px' : '140px', height: labelType === 'promo' ? '110px' : '90px', overflow: 'hidden' }}
                          >
                            {labelType === 'promo' && (
                              <div className="absolute top-0 right-0 bg-red-600 text-white font-bold shadow-lg z-10" style={{ fontSize: '5px', padding: '1px 2px', borderRadius: '2px' }}>
                                -{promoDiscount}%
                              </div>
                            )}
                            
                            {/* Seção Superior: Logo e Nome */}
                            <div className={`w-full flex flex-col items-center justify-center ${
                              labelType === 'promo' ? 'mb-2' : 'mb-2'
                            }`}>
                              {settings.companyLogo && labelType !== 'promo' && (
                                <img src={settings.companyLogo} alt="Logo" className={`max-w-full object-contain ${
                                  labelType === 'promo' ? 'h-4 mb-1' : 'h-4 mb-1'
                                }`} />
                              )}
                              {labelType === 'promo' && (
                                <div className="bg-white bg-opacity-95 text-red-600 px-2 rounded font-bold" style={{ fontSize: '12px', lineHeight: '1', marginBottom: '6px' }}>
                                  PROMOÇÃO
                                </div>
                              )}
                              <p className={`font-extrabold leading-tight text-center break-words overflow-hidden ${
                                labelType === 'promo' ? 'text-xs max-h-4' : 'text-xs max-h-4'
                              }`} style={{ fontSize: labelType === 'promo' ? '14px' : '9px' }}>
                                {product.name.length > 20 ? product.name.substring(0, 20) + '...' : product.name}
                              </p>
                            </div>
                            
                            {/* Seção Central: Código de Barras */}
                            <div className={`w-full flex items-center justify-center my-1 ${
                              labelType === 'promo' ? 'h-10' : 'h-8'
                            }`}>
                              {isValidForEan13 ? (
                                <Barcode 
                                  value={barcodeValue} 
                                  format="EAN13"
                                  width={0.7}
                                  height={18}
                                  fontSize={6}
                                  margin={0}
                                  background="transparent"
                                />
                              ) : (
                                <div className="h-full flex items-center justify-center text-red-500 px-1 font-semibold text-center" style={{ fontSize: '9px' }}>
                                  Código inválido
                                </div>
                              )}
                            </div>

                            {/* Seção Inferior: Preço */}
                            <div className={`w-full flex items-center justify-center px-1 ${
                              labelType === 'promo' ? 'flex-col' : ''
                            }`}>
                              {labelType === 'promo' ? (
                                <>
                                  <p className="font-semibold leading-tight text-center text-white opacity-90 line-through overflow-hidden text-ellipsis whitespace-nowrap" style={{ fontSize: '9px', marginBottom: '2px', maxWidth: '100%' }}>
                                    DE: {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                  </p>
                                  <p className="font-black leading-tight text-center text-white shadow-sm overflow-hidden text-ellipsis whitespace-nowrap" style={{ fontSize: '11px', maxWidth: '100%' }}>
                                    POR: {calculatePromoPrice(product.price, promoDiscount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                  </p>
                                </>
                              ) : (
                                <p className="text-[10px] font-black leading-none text-center max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                                  {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Informações do produto */}
                        <div className="flex-grow">
                          <h3 className="font-semibold text-gray-800 dark:text-gray-200">{product.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Código: {product.barcode || 'N/A'}</p>
                          <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                            {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </p>
                        </div>

                        {/* Controle de quantidade */}
                        <div className="flex-shrink-0">
                          <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Qtd:</label>
                            <NeuInput
                              darkMode={darkMode}
                              type="number"
                              min="1"
                              max="99"
                              value={quantity}
                              onChange={(e) => updateQuantity(product.id, e.target.value)}
                              className="w-16 text-center"
                              disabled={!isSelected}
                            />
                          </div>
                        </div>
                      </div>
                    </NeuCard>
                  );
                })}
              </div>

              {/* Área visual para preview das etiquetas selecionadas */}
              {getSelectedProducts().length > 0 && (
                <NeuCard darkMode={darkMode}>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                    Preview das Etiquetas Selecionadas ({getSelectedProducts().reduce((sum, item) => sum + item.quantity, 0)} etiquetas)
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {getSelectedProducts().map(({ product, quantity }) => {
                      const barcodeValue = (product.barcode || '').replace(/\D/g, '').slice(0, 12);
                      const isValidForEan13 = barcodeValue.length === 12;

                      return Array(quantity).fill(0).map((_, index) => (
                        <div
                          key={`${product.id}-${index}`}
                          className={`rounded-md shadow-md flex flex-col items-center text-center relative ${
                            labelType === 'promo' 
                              ? 'bg-gradient-to-br from-orange-400 to-red-500 text-white border border-red-400 p-3 justify-center' 
                              : 'bg-gray-200 text-black p-3 justify-center'
                          }`}
                          style={{ width: labelType === 'promo' ? '160px' : '140px', height: labelType === 'promo' ? '110px' : '90px', overflow: 'hidden' }}
                        >
                          {labelType === 'promo' && (
                            <div className="absolute top-0 right-0 bg-red-600 text-white font-bold shadow-lg z-10" style={{ fontSize: '5px', padding: '1px 2px', borderRadius: '2px' }}>
                              -{promoDiscount}%
                            </div>
                          )}
                          
                          {/* Seção Superior: Logo e Nome */}
                          <div className={`w-full flex flex-col items-center justify-center ${
                            labelType === 'promo' ? 'mb-2' : 'mb-2'
                          }`}>
                            {settings.companyLogo && labelType !== 'promo' && (
                              <img src={settings.companyLogo} alt="Logo" className={`max-w-full object-contain ${
                                labelType === 'promo' ? 'h-4 mb-1' : 'h-4 mb-1'
                              }`} />
                            )}
                            {labelType === 'promo' && (
                              <div className="bg-white bg-opacity-95 text-red-600 px-2 rounded font-bold" style={{ fontSize: '12px', lineHeight: '1', marginBottom: '6px' }}>
                                PROMOÇÃO
                              </div>
                            )}
                            <p className={`font-extrabold leading-tight text-center break-words overflow-hidden ${
                              labelType === 'promo' ? 'text-xs max-h-4' : 'text-xs max-h-4'
                            }`} style={{ fontSize: labelType === 'promo' ? '14px' : '9px' }}>
                              {product.name.length > 20 ? product.name.substring(0, 20) + '...' : product.name}
                            </p>
                          </div>
                          
                          {/* Seção Central: Código de Barras */}
                          <div className={`w-full flex items-center justify-center my-1 ${
                            labelType === 'promo' ? 'h-10' : 'h-8'
                          }`}>
                            {isValidForEan13 ? (
                              <Barcode 
                                value={barcodeValue} 
                                format="EAN13"
                                width={0.7}
                                height={18}
                                fontSize={6}
                                margin={0}
                                background="transparent"
                              />
                            ) : (
                              <div className="h-full flex items-center justify-center text-red-500 px-1 font-semibold text-center" style={{ fontSize: '9px' }}>
                                Código inválido
                              </div>
                            )}
                          </div>

                          {/* Seção Inferior: Preço */}
                          <div className={`w-full flex items-center justify-center px-1 ${
                            labelType === 'promo' ? 'flex-col' : ''
                          }`}>
                            {labelType === 'promo' ? (
                              <>
                                <p className="font-semibold leading-tight text-center text-white opacity-90 line-through overflow-hidden text-ellipsis whitespace-nowrap" style={{ fontSize: '9px', marginBottom: '2px', maxWidth: '100%' }}>
                                  DE: {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </p>
                                <p className="font-black leading-tight text-center text-white shadow-sm overflow-hidden text-ellipsis whitespace-nowrap" style={{ fontSize: '11px', maxWidth: '100%' }}>
                                  POR: {calculatePromoPrice(product.price, promoDiscount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </p>
                              </>
                            ) : (
                              <p className="text-[10px] font-black leading-none text-center max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                                {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                              </p>
                            )}
                          </div>
                        </div>
                      ));
                    })}
                  </div>
                </NeuCard>
              )}
            </>
          ) : (
            <div className="print:hidden">
              <NeuCard darkMode={darkMode} inset>
                <div className="text-center py-12">
                  <Tag className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">Nenhuma etiqueta para gerar</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    Adicione produtos na seção 'Produtos' para visualizar as etiquetas aqui.
                  </p>
                </div>
              </NeuCard>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
