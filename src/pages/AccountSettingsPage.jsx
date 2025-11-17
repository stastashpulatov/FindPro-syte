import React, { useState } from 'react';
import { Trash2, LogOut, UserCog } from 'lucide-react';
import api from '../services/api';

const AccountSettingsPage = ({ currentUser, onLogout, onAccountDeleted }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-lg p-8 text-center">
          <p className="text-gray-600">Загрузка данных профиля...</p>
        </div>
      </div>
    );
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Удалить аккаунт без возможности восстановления? Все заявки и предложения будут удалены.'
    );
    if (!confirmed) return;

    setIsDeleting(true);
    setError('');
    try {
      await api.deleteAccount();
      onAccountDeleted?.();
    } catch (e) {
      console.error(e);
      setError(e?.response?.data?.detail || e?.message || 'Не удалось удалить аккаунт');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-white rounded-2xl shadow p-6 md:p-8 flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-semibold">
            {(currentUser.full_name || currentUser.email)[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-sm uppercase text-gray-500 mb-1">Профиль</p>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <UserCog size={24} className="text-blue-600" />
              {currentUser.full_name || 'Без имени'}
            </h1>
            <p className="text-gray-600 mt-2">{currentUser.email}</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow divide-y divide-gray-100">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Управление сессией</h2>
            <p className="text-gray-600 text-sm mb-4">
              Выйдите из аккаунта на этом устройстве.
            </p>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              <LogOut size={18} />
              Выйти из аккаунта
            </button>
          </div>

          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2 text-red-700">Удаление аккаунта</h2>
            <p className="text-gray-600 text-sm mb-4">
              Все ваши данные (заявки, предложения, профиль) будут удалены без возможности восстановления.
            </p>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 size={18} />
              {isDeleting ? 'Удаление...' : 'Удалить аккаунт'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsPage;

