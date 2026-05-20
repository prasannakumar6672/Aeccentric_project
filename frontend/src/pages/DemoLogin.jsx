import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { demoCredentials } from '../lib/demoCredentials';

// Simple demo login component – NOT for production use
const DemoLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = form;
    // Check against demo credentials
    const isAdmin = email === demoCredentials.admin.email && password === demoCredentials.admin.password;
    const isEmployee = email === demoCredentials.employee.email && password === demoCredentials.employee.password;
    if (isAdmin) {
      // In a real app you would set auth tokens – here we just navigate
      navigate('/dashboard/admin');
    } else if (isEmployee) {
      navigate('/dashboard/employee');
    } else {
      setError('Invalid demo credentials. Use admin/admin123 or employee/employee123');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--bg)]">
      <form onSubmit={handleSubmit} className="p-8 bg-[var(--bg-card)] rounded-lg shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">Demo Login</h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </div>
        <button type="submit" className="w-full bg-[var(--accent)] text-white py-2 rounded hover:bg-[var(--accent)-hover] transition">
          Sign In
        </button>
      </form>
    </div>
  );
};

export default DemoLogin;
