import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Grid, List, Download } from 'lucide-react';
import EmployeeTable from '../../../components/tables/EmployeeTable';
import EmployeeCard from '../../../components/employees/EmployeeCard';
import api from '../../../services/api';
import { useNavigate } from 'react-router-dom';
import DeleteConfirmationModal from '../../../components/modals/DeleteConfirmationModal';

const EmployeeList = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ role: '', department: '', status: '' });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        search,
        ...filters
      }).toString();
      const res = await api.get(`/employees?${queryParams}`);
      setEmployees(res.data.employees);
    } catch (err) {
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchEmployees, 500);
    return () => clearTimeout(timer);
  }, [search, filters]);

  const handleDelete = async () => {
    if (!selectedEmployee) return;
    setIsDeleting(true);
    try {
      await api.delete(`/employees/${selectedEmployee._id}`);
      fetchEmployees();
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error('Error deleting employee:', err);
    } finally {
      setIsDeleting(false);
      setSelectedEmployee(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-[32px] font-black text-[#0F172A] tracking-tight">Employee Directory</h1>
          <p className="text-[#64748b] text-[15px] mt-1 font-medium">Manage and monitor all AECCENTRIC staff members</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard/admin/employees/create')}
          className="flex items-center justify-center gap-2 px-8 py-4 rounded-[20px] bg-[#0B1A2B] text-white text-[14px] font-black tracking-widest hover:shadow-2xl hover:-translate-y-1 transition-all uppercase"
          style={{ boxShadow: '0 8px 30px -4px rgba(37,99,235,0.3)' }}
        >
          <Plus size={20} />
          ADD NEW EMPLOYEE
        </button>
      </div>

      {/* Controls Section */}
      <div className="bg-white p-4 rounded-[28px] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search by name, ID or designation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-50 border-none text-[14px] font-medium outline-none focus:ring-2 focus:ring-[#2563EB]/10 transition-all"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select 
            value={filters.department}
            onChange={(e) => setFilters({...filters, department: e.target.value})}
            className="h-14 px-4 rounded-2xl bg-slate-50 border-none text-[13px] font-bold text-slate-500 outline-none focus:ring-2 focus:ring-[#2563EB]/10"
          >
            <option value="">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Design">Design</option>
            <option value="HR">HR</option>
            <option value="Marketing">Marketing</option>
          </select>

          <select 
            value={filters.role}
            onChange={(e) => setFilters({...filters, role: e.target.value})}
            className="h-14 px-4 rounded-2xl bg-slate-50 border-none text-[13px] font-bold text-slate-500 outline-none focus:ring-2 focus:ring-[#2563EB]/10"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="employee">Employee</option>
          </select>

          <div className="h-14 p-1.5 bg-slate-50 rounded-2xl flex items-center gap-1">
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-[#2563EB]' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <List size={20} />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#2563EB]' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Grid size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* List/Grid Content */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-4 border-slate-100 border-t-[#2563EB] rounded-full animate-spin" />
          <p className="text-[14px] font-bold text-slate-400 tracking-widest uppercase">Fetching Talent...</p>
        </div>
      ) : employees.length > 0 ? (
        viewMode === 'list' ? (
          <EmployeeTable 
            employees={employees} 
            onEdit={(emp) => navigate(`/dashboard/admin/employees/edit/${emp._id}`)}
            onDelete={(emp) => { setSelectedEmployee(emp); setIsDeleteModalOpen(true); }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {employees.map(emp => (
              <EmployeeCard key={emp._id} employee={emp} />
            ))}
          </div>
        )
      ) : (
        <div className="bg-white rounded-[32px] border border-gray-100 p-20 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-[24px] flex items-center justify-center mx-auto mb-6 text-slate-300">
            <Users size={40} />
          </div>
          <h3 className="text-[20px] font-black text-[#0F172A] mb-2">No employees found</h3>
          <p className="text-slate-400 max-w-sm mx-auto">Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      )}

      {/* Delete Modal */}
      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        title="Remove Employee"
        message={`Are you sure you want to remove ${selectedEmployee?.fullName}? Their access to the portal will be revoked immediately.`}
      />
    </div>
  );
};

export default EmployeeList;
