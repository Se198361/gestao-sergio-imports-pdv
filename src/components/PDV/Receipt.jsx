import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Receipt = ({ sale }) => {
  const { settings } = useApp();

  // Validação para evitar erros se sale não estiver definido
  if (!sale) {
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
        <div className="text-center">
          <p>Erro: Dados da venda não encontrados</p>
        </div>
      </div>
    );
  }

  // Formata a data de forma segura
  const formatDate = (date) => {
    try {
      const saleDate = new Date(date);
      if (isNaN(saleDate.getTime())) {
        return new Date().toLocaleDateString('pt-BR');
      }
      return format(saleDate, "dd/MM/yyyy 'às' HH:mm:ss", { locale: ptBR });
    } catch (error) {
      return new Date().toLocaleDateString('pt-BR');
    }
  };

  // Formata moeda de forma segura
  const formatCurrency = (value) => {
    try {
      const numValue = typeof value === 'number' ? value : parseFloat(value) || 0;
      return numValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    } catch (error) {
      return 'R$ 0,00';
    }
  };

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
      {/* Cabeçalho da Empresa - Compacto */}
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

      {/* Data e Título */}
      <div className="text-center mb-1">
        <div className="font-bold" style={{ fontSize: '8px' }}>CUPOM FISCAL</div>
        <div style={{ fontSize: '7px' }}>{formatDate(sale.date)}</div>
      </div>

      {/* Informações da Venda */}
      <div className="mb-1" style={{ fontSize: '7px' }}>
        <div>Venda: #{sale.id || 'N/A'}</div>
        <div>Cliente: {(sale.client?.name || 'Não identificado').substring(0, 25)}</div>
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

      {/* Itens - Compacto */}
      <div className="font-bold text-center mb-1" style={{ fontSize: '8px' }}>ITENS</div>
      
      <div className="mb-1">
        {(sale.items || []).map((item, index) => (
          <div key={index} className="flex justify-between" style={{ fontSize: '7px', lineHeight: '1.2' }}>
            <span className="flex-shrink-0 w-6">{item.quantity || 0}x</span>
            <span className="flex-1 truncate px-1">{(item.name || 'Item').substring(0, 20)}</span>
            <span className="flex-shrink-0 text-right">
              {formatCurrency(item.total || 0).replace('R$', '').trim()}
            </span>
          </div>
        ))}
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

      {/* Totais */}
      <div className="mb-1" style={{ fontSize: '7px' }}>
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{formatCurrency(sale.subtotal || 0).replace('R$', '').trim()}</span>
        </div>
        {(sale.discount || 0) > 0 && (
          <div className="flex justify-between">
            <span>Desconto:</span>
            <span>-{formatCurrency(sale.discount || 0).replace('R$', '').trim()}</span>
          </div>
        )}
        <div className="flex justify-between font-bold" style={{ fontSize: '8px' }}>
          <span>TOTAL:</span>
          <span>{formatCurrency(sale.total || 0)}</span>
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

      {/* Pagamento */}
      <div className="mb-1" style={{ fontSize: '7px' }}>
        <div className="font-bold text-center" style={{ fontSize: '8px' }}>PAGAMENTO</div>
        <div className="flex justify-between">
          <span>Forma:</span>
          <span>{sale.paymentMethod || 'N/A'}</span>
        </div>
        {sale.paymentMethod === 'credit' && sale.paymentDetails && (
          <div className="flex justify-between" style={{ fontSize: '6px' }}>
            <span>Parcelas:</span>
            <span>{sale.paymentDetails.installments || 1}x</span>
          </div>
        )}
      </div>

      {/* QR Code PIX - Removido para economizar espaço na versão compacta */}
      
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

      {/* Política de Troca - Otimizada */}
      <div className="text-center mb-1" style={{ fontSize: '6px' }}>
        <div className="font-bold" style={{ fontSize: '7px' }}>POLÍTICA DE TROCA</div>
        <div className="font-bold">PRAZO: {settings.exchangeDeadline || 7} DIAS</div>
        {settings.exchangePolicy && (
          <div 
            style={{ 
              fontSize: '5px', 
              lineHeight: '1.1',
              textAlign: 'justify',
              wordWrap: 'break-word',
              hyphens: 'auto'
            }}
          >
            {settings.exchangePolicy}
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

      {/* Mensagem Final */}
      <div className="text-center" style={{ fontSize: '6px' }}>
        <div>{settings.receiptMessage1 || 'Obrigado!'}</div>
        <div>{settings.receiptMessage2 || 'Volte sempre!'}</div>
        {settings.receiptMessage3 && <div>{settings.receiptMessage3}</div>}
        {settings.receiptFooter && (
          <div style={{ fontSize: '5px', marginTop: '1mm' }}>
            {settings.receiptFooter}
          </div>
        )}
      </div>
    </div>
  );
};

export default Receipt;
