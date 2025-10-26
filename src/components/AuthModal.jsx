import React, { useState } from 'react';
import api from '../services/api';

const AuthModal = ({ open, onClose, onAuthed }) => {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ email: '', password: '', full_name: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    setLoading(true); setError('');
    try {
      const { data } = await api.login(form.email, form.password);
      localStorage.setItem('token', data.access_token);
      onAuthed && onAuthed();
      onClose();
    } catch (e) {
      setError(e?.response?.data?.detail || 'Ошибка входа');
    } finally { setLoading(false); }
  };

  const handleRegister = async () => {
    if (!form.email || !form.password) { setError('Заполните email и пароль'); return; }
    setLoading(true); setError('');
    try {
      await api.register({ email: form.email, password: form.password, full_name: form.full_name || null });
      // авто-вход
      await handleLogin();
    } catch (e) {
      setError(e?.response?.data?.detail || 'Ошибка регистрации');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">
            {mode === 'login' ? 'Вход' : 'Регистрация'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="flex gap-2 mb-4">
          <button onClick={() => setMode('login')} className={`flex-1 py-2 rounded-lg border ${mode==='login'?'bg-blue-600 text-white border-blue-600':'bg-white text-gray-700'}`}>Войти</button>
          <button onClick={() => setMode('register')} className={`flex-1 py-2 rounded-lg border ${mode==='register'?'bg-blue-600 text-white border-blue-600':'bg-white text-gray-700'}`}>Регистрация</button>
        </div>

        {error && (
          <div className="mb-3 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">{error}</div>
        )}

        {mode === 'register' && (
          <div className="mb-3">
            <label className="block text-sm text-gray-700 mb-1">Имя</label>
            <input name="full_name" value={form.full_name} onChange={onChange} className="w-full px-3 py-2 border rounded-lg" placeholder="Иван Иванов"/>
          </div>
        )}

        <div className="mb-3">
          <label className="block text-sm text-gray-700 mb-1">Email</label>
          <input name="email" value={form.email} onChange={onChange} type="email" className="w-full px-3 py-2 border rounded-lg" placeholder="you@example.com"/>
        </div>
        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-1">Пароль</label>
          <input name="password" value={form.password} onChange={onChange} type="password" className="w-full px-3 py-2 border rounded-lg" placeholder="••••••••"/>
        </div>

        <button
          disabled={loading}
          onClick={mode==='login' ? handleLogin : handleRegister}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Подождите...' : (mode==='login' ? 'Войти' : 'Зарегистрироваться')}
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
