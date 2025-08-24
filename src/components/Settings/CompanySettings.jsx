import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Building2, Save, Upload, Receipt } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import NeuCard from '../Layout/NeuCard';
import NeuButton from '../Layout/NeuButton';
import NeuInput from '../Layout/NeuInput';
import toast from 'react-hot-toast';

export default function CompanySettings() {
  const { darkMode, settings, updateSettings } = useApp();
  const [formData, setFormData] = useState({});
  const [logoPreview, setLogoPreview] = useState(null);
  const [qrPreview, setQrPreview] = useState(null);

  const logoInputRef = useRef(null);
  const qrInputRef = useRef(null);

  useEffect(() => {
    setFormData(settings);
    if (settings.companyLogo) setLogoPreview(settings.companyLogo);
    if (settings.pixQrCode) setQrPreview(settings.pixQrCode);
  }, [settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, field, previewSetter) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) { // 1MB limit
        toast.error('A imagem deve ter no máximo 1MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result }));
        previewSetter(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings(formData);
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
            Configurações da Empresa
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Atualize os dados cadastrais da sua empresa.
          </p>
        </div>
      </NeuCard>

      <form onSubmit={handleSubmit}>
        <NeuCard darkMode={darkMode}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <NeuInput darkMode={darkMode} label="Razão Social" name="companyLegalName" value={formData.companyLegalName || ''} onChange={handleChange} />
              <NeuInput darkMode={darkMode} label="Nome Fantasia" name="companyName" value={formData.companyName || ''} onChange={handleChange} />
              <NeuInput darkMode={darkMode} label="CNPJ" name="cnpj" value={formData.cnpj || ''} onChange={handleChange} />
              <NeuInput darkMode={darkMode} label="Endereço Completo" name="address" value={formData.address || ''} onChange={handleChange} />
              <NeuInput darkMode={darkMode} label="Telefone" name="phone" value={formData.phone || ''} onChange={handleChange} />
              <NeuInput darkMode={darkMode} label="Email" name="email" type="email" value={formData.email || ''} onChange={handleChange} />
            </div>
            <div className="space-y-6">
              <div className="text-center">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Logo da Empresa</label>
                <div className="w-32 h-32 mx-auto rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center mb-2 overflow-hidden">
                  {logoPreview ? <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" /> : <Building2 className="w-12 h-12 text-gray-400" />}
                </div>
                <NeuButton type="button" onClick={() => logoInputRef.current?.click()} size="sm" darkMode={darkMode}>
                  <Upload className="w-4 h-4 mr-2" /> Carregar Logo
                </NeuButton>
                <input ref={logoInputRef} type="file" onChange={(e) => handleFileChange(e, 'companyLogo', setLogoPreview)} accept="image/*" className="hidden" />
              </div>
              <div className="text-center">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">QR Code PIX</label>
                <div className="w-32 h-32 mx-auto rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center mb-2 overflow-hidden">
                  {qrPreview ? <img src={qrPreview} alt="QR Code" className="w-full h-full object-contain" /> : <Building2 className="w-12 h-12 text-gray-400" />}
                </div>
                <NeuButton type="button" onClick={() => qrInputRef.current?.click()} size="sm" darkMode={darkMode}>
                  <Upload className="w-4 h-4 mr-2" /> Carregar QR Code
                </NeuButton>
                <input ref={qrInputRef} type="file" onChange={(e) => handleFileChange(e, 'pixQrCode', setQrPreview)} accept="image/*" className="hidden" />
              </div>
              <NeuInput darkMode={darkMode} label="Chave PIX" name="pixKey" value={formData.pixKey || ''} onChange={handleChange} />
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <NeuButton type="submit" darkMode={darkMode} variant="primary">
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </NeuButton>
          </div>
        </NeuCard>
      </form>

      {/* Nova seção para configurações do recibo */}
      <form onSubmit={handleSubmit}>
        <NeuCard darkMode={darkMode}>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center">
              <Receipt className="w-6 h-6 mr-2" />
              Configurações do Recibo
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Configure as informações que aparecerão nos recibos de venda.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <NeuInput 
                darkMode={darkMode} 
                label="Mensagem de Agradecimento (Linha 1)" 
                name="receiptMessage1" 
                value={formData.receiptMessage1 || 'Obrigado!'} 
                onChange={handleChange} 
                placeholder="Obrigado pela preferência"
              />
              <NeuInput 
                darkMode={darkMode} 
                label="Mensagem de Agradecimento (Linha 2)" 
                name="receiptMessage2" 
                value={formData.receiptMessage2 || 'Volte sempre!'} 
                onChange={handleChange} 
                placeholder="Volte sempre!"
              />
              <NeuInput 
                darkMode={darkMode} 
                label="Mensagem de Agradecimento (Linha 3)" 
                name="receiptMessage3" 
                value={formData.receiptMessage3 || ''} 
                onChange={handleChange} 
                placeholder="Mensagem adicional (opcional)"
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Política de Troca
                </label>
                <textarea
                  name="exchangePolicy"
                  value={formData.exchangePolicy || 'Trocas em até 7 dias com nota fiscal.'}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Digite a política de troca da empresa..."
                />
              </div>
              
              <NeuInput 
                darkMode={darkMode} 
                label="Prazo para Troca (dias)" 
                name="exchangeDeadline" 
                type="number" 
                value={formData.exchangeDeadline || '7'} 
                onChange={handleChange} 
                min="1" 
                max="365"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Informações Adicionais
                </label>
                <textarea
                  name="receiptFooter"
                  value={formData.receiptFooter || ''}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Informações adicionais no rodapé do recibo (opcional)"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <NeuButton type="submit" darkMode={darkMode} variant="primary">
              <Save className="w-4 h-4 mr-2" />
              Salvar Configurações do Recibo
            </NeuButton>
          </div>
        </NeuCard>
      </form>
    </motion.div>
  );
}
