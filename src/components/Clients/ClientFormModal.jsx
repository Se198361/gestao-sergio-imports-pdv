import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import NeuCard from '../Layout/NeuCard';
import NeuButton from '../Layout/NeuButton';
import NeuInput from '../Layout/NeuInput';

export default function ClientFormModal({ client, onClose }) {
  const { darkMode, addClient, updateClient } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (client) {
      setFormData(client);
    }
  }, [client]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (client) {
      updateClient({ ...formData, id: client.id });
    } else {
      addClient(formData);
    }
    onClose();
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
          className="w-full max-w-lg"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <NeuCard darkMode={darkMode} neonBorder>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                {client ? 'Editar Cliente' : 'Adicionar Cliente'}
              </h2>
              <button onClick={onClose} className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <NeuInput darkMode={darkMode} label="Nome Completo" name="name" value={formData.name} onChange={handleChange} required />
              <NeuInput darkMode={darkMode} label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
              <NeuInput darkMode={darkMode} label="Telefone" name="phone" value={formData.phone} onChange={handleChange} />
              <NeuInput darkMode={darkMode} label="Endereço" name="address" value={formData.address} onChange={handleChange} />
              <div className="flex justify-end space-x-4 pt-4">
                <NeuButton type="button" darkMode={darkMode} variant="secondary" onClick={onClose}>Cancelar</NeuButton>
                <NeuButton type="submit" darkMode={darkMode} variant="primary">{client ? 'Salvar Alterações' : 'Adicionar Cliente'}</NeuButton>
              </div>
            </form>
          </NeuCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
