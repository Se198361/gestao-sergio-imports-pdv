import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Users } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import NeuCard from '../Layout/NeuCard';
import NeuButton from '../Layout/NeuButton';
import NeuInput from '../Layout/NeuInput';
import ClientList from './ClientList';
import ClientFormModal from './ClientFormModal';

export default function Clients() {
  const { darkMode, clients } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const openModal = (client = null) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedClient(null);
    setIsModalOpen(false);
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

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
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 animate-glow">
              Gestão de Clientes
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Gerencie sua base de clientes.
            </p>
          </div>
          <NeuButton darkMode={darkMode} neon onClick={() => openModal()}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Cliente
          </NeuButton>
        </div>
      </NeuCard>

      <NeuCard darkMode={darkMode}>
        <div className="flex items-center">
          <NeuInput
            darkMode={darkMode}
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Search className="w-5 h-5 text-gray-500 -ml-10" />
        </div>
      </NeuCard>

      <NeuCard darkMode={darkMode}>
        <ClientList clients={filteredClients} onEdit={openModal} />
      </NeuCard>

      {isModalOpen && (
        <ClientFormModal
          client={selectedClient}
          onClose={closeModal}
        />
      )}
    </motion.div>
  );
}
