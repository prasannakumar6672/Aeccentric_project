import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import EmployeeForm from '../../../components/forms/EmployeeForm';
import api from '../../../services/api';

const EmployeeEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await api.get(`/employees/${id}`);
        setEmployee(res.data.employee);
      } catch (err) {
        setError('Failed to load employee data');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id]);

  const handleSubmit = async (formData) => {
    setSaving(true);
    setError('');
    try {
      await api.put(`/employees/${id}`, formData);
      navigate('/dashboard/admin/employees');
    } catch (err) {
      setError(err?.response?.data?.message || 'Error updating employee profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-slate-100 border-t-[#2563EB] rounded-full animate-spin" />
        <p className="text-[14px] font-bold text-slate-400 tracking-widest uppercase">Loading Profile...</p>
      </div>
    );
  }

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
            <h1 className="text-[28px] font-black text-[#0F172A] tracking-tight">Edit Employee</h1>
            <p className="text-[#64748b] text-[14px] font-medium">Update profile for {employee?.fullName}</p>
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
        initialData={employee}
        onSubmit={handleSubmit} 
        onCancel={() => navigate('/dashboard/admin/employees')}
        isLoading={saving}
      />
    </div>
  );
};

export default EmployeeEdit;
