import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import EmployeeForm from '../../../components/forms/EmployeeForm';
import api from '../../../services/api';

const EmployeeCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError('');
    try {
      await api.post('/employees', formData);
      navigate('/dashboard/admin/employees');
    } catch (err) {
      setError(err?.response?.data?.message || 'Error creating employee profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard/admin/employees')}
            className="p-3 rounded-2xl bg-white border border-gray-100 text-slate-400 hover:text-[#2563EB] hover:shadow-md transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-[28px] font-black text-[#0F172A] tracking-tight">Onboard New Employee</h1>
            <p className="text-[#64748b] text-[14px] font-medium">Initialize a new staff account and profile</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-4xl mx-auto p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-[14px] font-bold flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center">!</div>
          {error}
        </div>
      )}

      <EmployeeForm 
        onSubmit={handleSubmit} 
        onCancel={() => navigate('/dashboard/admin/employees')}
        isLoading={loading}
      />
    </div>
  );
};

export default EmployeeCreate;
