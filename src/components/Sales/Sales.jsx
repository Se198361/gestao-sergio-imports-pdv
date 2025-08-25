import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Search, Calendar, User, X, Eye, Trash2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import NeuCard from '../Layout/NeuCard';
import NeuInput from '../Layout/NeuInput';
import NeuButton from '../Layout/NeuButton';
import SaleDetailsModal from './SaleDetailsModal';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Sales() {
  const { darkMode, sales, deleteSale } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Função para filtrar vendas
  const filteredSales = useMemo(() => {
    return sales.filter(sale => {
      // Filtro por nome do cliente
      const clientMatch = !searchTerm || 
        (sale.client?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (!sale.client && 'não identificado'.includes(searchTerm.toLowerCase()));
      
      // Filtro por data
      const dateMatch = !dateFilter || 
        format(new Date(sale.date), 'yyyy-MM-dd') === dateFilter;
      
      return clientMatch && dateMatch;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [sales, searchTerm, dateFilter]);

  // Função para limpar filtros
  const clearFilters = () => {
    setSearchTerm('');
    setDateFilter('');
  };

  // Verificar se há filtros ativos
  const hasActiveFilters = searchTerm || dateFilter;

  // Função para abrir detalhes da venda
  const openSaleDetails = (sale) => {
    setSelectedSale(sale);
    setIsDetailsModalOpen(true);
  };

  // Função para fechar modal de detalhes
  const closeSaleDetails = () => {
    setSelectedSale(null);
    setIsDetailsModalOpen(false);
  };

  // Função para excluir venda com confirmação
  const handleDeleteSale = (sale) => {
    const totalItems = sale.items.reduce((acc, item) => acc + item.quantity, 0);
    const itemsList = sale.items.map(item => `• ${item.quantity}x ${item.name}`).join('\n');
    
    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir a venda #${sale.id}?\n\n` +
      `Cliente: ${sale.client?.name || 'Não identificado'}\n` +
      `Data: ${format(new Date(sale.date), "dd/MM/yyyy HH:mm", { locale: ptBR })}\n` +
      `Total: ${sale.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n` +
      `Itens (${totalItems}):\n${itemsList}\n\n` +
      `ATENÇÃO: O estoque dos produtos será restaurado automaticamente.\n` +
      `Esta ação não pode ser desfeita.`
    );

    if (confirmDelete) {
      deleteSale(sale.id);
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
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 animate-glow">
            Relatório de Vendas
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Visualize o histórico de todas as vendas realizadas.
          </p>
        </div>
      </NeuCard>

      {/* Seção de Filtros e Busca */}
      <NeuCard darkMode={darkMode}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Filtros de Busca
            </h2>
            <NeuButton 
              darkMode={darkMode} 
              variant="secondary"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Ocultar' : 'Mostrar'} Filtros
            </NeuButton>
          </div>
          
          {showFilters && (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {/* Busca por Cliente */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Buscar por Cliente
                </label>
                <NeuInput
                  darkMode={darkMode}
                  type="text"
                  placeholder="Digite o nome do cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Filtro por Data */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Filtrar por Data
                </label>
                <NeuInput
                  darkMode={darkMode}
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>
              
              {/* Botões de Ação */}
              <div className="flex items-end">
                <NeuButton 
                  darkMode={darkMode} 
                  variant="secondary"
                  onClick={clearFilters}
                  disabled={!hasActiveFilters}
                  className="w-full"
                >
                  <X className="w-4 h-4 mr-2" />
                  Limpar Filtros
                </NeuButton>
              </div>
            </motion.div>
          )}
          
          {/* Indicador de Filtros Ativos */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-2 border-t dark:border-gray-600">
              <span className="text-sm text-gray-600 dark:text-gray-400">Filtros ativos:</span>
              {searchTerm && (
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                  Cliente: {searchTerm}
                </span>
              )}
              {dateFilter && (
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs">
                  Data: {format(new Date(dateFilter), 'dd/MM/yyyy', { locale: ptBR })}
                </span>
              )}
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-xs">
                {filteredSales.length} resultado(s)
              </span>
            </div>
          )}
        </div>
      </NeuCard>

      <NeuCard darkMode={darkMode}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">ID Venda</th>
                <th scope="col" className="px-6 py-3">Data</th>
                <th scope="col" className="px-6 py-3">Cliente</th>
                <th scope="col" className="px-6 py-3">Itens</th>
                <th scope="col" className="px-6 py-3">Total</th>
                <th scope="col" className="px-6 py-3">Pagamento</th>
                <th scope="col" className="px-6 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => (
                <motion.tr
                  key={sale.id}
                  className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  layout
                >
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    #{sale.id}
                  </th>
                  <td className="px-6 py-4">{format(new Date(sale.date), "dd/MM/yyyy HH:mm", { locale: ptBR })}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      sale.client 
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      {sale.client?.name || 'Não identificado'}
                    </span>
                  </td>
                  <td className="px-6 py-4">{sale.items.reduce((acc, item) => acc + item.quantity, 0)}</td>
                  <td className="px-6 py-4 font-bold">{sale.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                      {sale.paymentMethod}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <NeuButton
                        darkMode={darkMode}
                        variant="primary"
                        size="sm"
                        onClick={() => openSaleDetails(sale)}
                        className="flex items-center space-x-1 text-xs"
                        title="Ver detalhes"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Detalhes</span>
                      </NeuButton>
                      <NeuButton
                        darkMode={darkMode}
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteSale(sale)}
                        className="flex items-center space-x-1 text-xs"
                        title="Excluir venda"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Excluir</span>
                      </NeuButton>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filteredSales.length === 0 && sales.length > 0 && (
            <div className="text-center py-8">
              <Search className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Nenhuma venda encontrada com os filtros aplicados.</p>
              <NeuButton 
                darkMode={darkMode} 
                variant="secondary"
                onClick={clearFilters}
                className="mt-4"
              >
                Limpar Filtros
              </NeuButton>
            </div>
          )}
          {sales.length === 0 && (
            <div className="text-center py-8">
              <BarChart3 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Nenhuma venda registrada.</p>
            </div>
          )}
        </div>
      </NeuCard>

      {/* Modal de Detalhes da Venda */}
      <SaleDetailsModal
        sale={selectedSale}
        isOpen={isDetailsModalOpen}
        onClose={closeSaleDetails}
        darkMode={darkMode}
      />
    </motion.div>
  );
}
