import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Edit } from 'lucide-react';
import api from '../services/api';

const AdminPage = ({ onNavigate, categories }) => {
    const [providers, setProviders] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        user_id: '',
        company_name: '',
        description: '',
        service_area: '',
        is_verified: false,
        is_available: true,
        rating: 0,
        balance: 0,
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [providersRes, usersRes] = await Promise.all([
                api.getProviders(),
                api.getAllUsers()
            ]);
            setProviders(providersRes.data);
            setUsers(usersRes.data);
        } catch (error) {
            console.error('Error loading admin data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.createProvider({
                ...formData,
                user_id: parseInt(formData.user_id),
                rating: parseFloat(formData.rating),
                balance: parseFloat(formData.balance),
            });
            alert('Специалист успешно добавлен');
            setIsModalOpen(false);
            loadData();
            setFormData({
                user_id: '',
                company_name: '',
                description: '',
                service_area: '',
                is_verified: false,
                is_available: true,
                rating: 0,
                balance: 0,
            });
        } catch (error) {
            console.error('Error creating provider:', error);
            alert('Ошибка при создании специалиста: ' + (error.response?.data?.detail || error.message));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Вы уверены?')) return;
        try {
            await api.deleteProvider(id);
            loadData();
        } catch (error) {
            console.error('Error deleting provider:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => onNavigate('home')}
                    className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Назад
                </button>

                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Панель администратора</h1>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <Plus size={20} />
                        Добавить специалиста
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Компания / Имя</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Рейтинг</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Баланс</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {providers.map((provider) => (
                                <tr key={provider.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{provider.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{provider.company_name}</div>
                                        <div className="text-sm text-gray-500">{provider.user?.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{provider.rating?.toFixed(1)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{provider.balance?.toLocaleString()} сум</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${provider.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {provider.is_available ? 'Свободен' : 'Занят'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleDelete(provider.id)} className="text-red-600 hover:text-red-900 ml-4">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Provider Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Добавить специалиста</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Пользователь</label>
                                <select
                                    value={formData.user_id}
                                    onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    required
                                >
                                    <option value="">Выберите пользователя</option>
                                    {users.map(user => (
                                        <option key={user.id} value={user.id}>{user.email} ({user.full_name})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Название компании / Имя</label>
                                <input
                                    type="text"
                                    value={formData.company_name}
                                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    rows="3"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Район обслуживания</label>
                                    <input
                                        type="text"
                                        value={formData.service_area}
                                        onChange={(e) => setFormData({ ...formData, service_area: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Начальный рейтинг</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        max="5"
                                        value={formData.rating}
                                        onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_verified}
                                        onChange={(e) => setFormData({ ...formData, is_verified: e.target.checked })}
                                        className="rounded text-blue-600"
                                    />
                                    <span className="text-sm text-gray-700">Проверен</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_available}
                                        onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                                        className="rounded text-blue-600"
                                    />
                                    <span className="text-sm text-gray-700">Свободен</span>
                                </label>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Отмена
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Создать
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPage;
