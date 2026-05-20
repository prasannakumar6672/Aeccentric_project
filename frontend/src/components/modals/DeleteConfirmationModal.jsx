import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const DeleteConfirmationModal = ({ isOpen, onConfirm, onCancel, title, message, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 mb-6 mx-auto">
            <AlertTriangle size={32} />
          </div>
          
          <h3 className="text-[20px] font-black text-[#0F172A] text-center mb-3">
            {title || 'Delete Confirmation'}
          </h3>
          <p className="text-[#64748b] text-[15px] text-center leading-relaxed mb-8">
            {message || 'Are you sure you want to delete this record? This action cannot be undone.'}
          </p>

          <div className="flex gap-3">
            <button 
              onClick={onCancel}
              className="flex-1 py-4 rounded-2xl text-[14px] font-black tracking-widest text-slate-500 hover:bg-slate-50 transition-all uppercase"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 py-4 rounded-2xl bg-rose-600 text-white text-[14px] font-black tracking-widest hover:bg-rose-700 hover:shadow-lg transition-all uppercase disabled:opacity-50"
            >
              {isLoading ? 'DELETING...' : 'DELETE'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
