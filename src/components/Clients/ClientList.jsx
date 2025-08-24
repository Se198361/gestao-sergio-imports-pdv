import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, User } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import NeuButton from '../Layout/NeuButton';

export default function ClientList({ clients, onEdit }) {
  const { darkMode, deleteClient } = useApp();

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja remover este cliente?')) {
      deleteClient(id);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">ID</th>
            <th scope="col" className="px-6 py-3">Nome</th>
            <th scope="col" className="px-6 py-3">Email</th>
            <th scope="col" className="px-6 py-3">Telefone</th>
            <th scope="col" className="px-6 py-3">Ações</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <motion.tr
              key={client.id}
              className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <td className="px-6 py-4 font-mono text-xs">{client.id}</td>
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                {client.name}
              </th>
              <td className="px-6 py-4">{client.email}</td>
              <td className="px-6 py-4">{client.phone}</td>
              <td className="px-6 py-4">
                <div className="flex space-x-2">
                  <NeuButton darkMode={darkMode} size="sm" onClick={() => onEdit(client)}>
                    <Edit className="w-4 h-4" />
                  </NeuButton>
                  <NeuButton darkMode={darkMode} size="sm" variant="danger" onClick={() => handleDelete(client.id)}>
                    <Trash2 className="w-4 h-4" />
                  </NeuButton>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
      {clients.length === 0 && (
        <div className="text-center py-8">
          <User className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Nenhum cliente encontrado.</p>
        </div>
      )}
    </div>
  );
}
