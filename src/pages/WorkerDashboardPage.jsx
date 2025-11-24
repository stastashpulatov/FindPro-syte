import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Calendar, DollarSign } from 'lucide-react';
import api from '../services/api';

const WorkerDashboardPage = ({ onNavigate, currentUser }) => {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        setIsLoading(true);
        try {
            const response = await api.getRequests();
            // Filter requests to show only those assigned to this provider (not created by them)
            // If the user is both a customer and a provider, this separates their "jobs" from their "orders"
            const assignedRequests = response.data.filter(req => req.user_id !== currentUser?.id);
            setRequests(assignedRequests);
        } catch (error) {
            console.error('Error loading requests:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'in_progress': return 'bg-blue-100 text-blue-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending': return 'Ожидает';
            case 'in_progress': return 'В работе';
            case 'completed': return 'Завершен';
            case 'cancelled': return 'Отменен';
            default: return status;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Панель специалиста</h1>
                    <div className="text-sm text-gray-500">
                        Добро пожаловать, {currentUser?.full_name || 'Специалист'}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Ваши задачи</h2>
                    <p className="text-gray-600">
                        Здесь отображаются заявки, назначенные вам для выполнения.
                    </p>
                </div>

                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Загрузка задач...</p>
                    </div>
                ) : requests.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <p className="text-gray-600 mb-4">У вас пока нет назначенных заявок.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {requests.map((request) => (
                            <div key={request.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-1">{request.title}</h3>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                            {getStatusText(request.status)}
                                        </span>
                                    </div>
                                    {request.price && (
                                        <div className="flex items-center text-lg font-bold text-green-600">
                                            <DollarSign size={20} />
                                            {request.price.toLocaleString()} сум
                                        </div>
                                    )}
                                </div>

                                <p className="text-gray-600 mb-4">{request.description}</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className="flex items-center text-gray-500">
                                        <Calendar size={18} className="mr-2" />
                                        <span>Создано: {new Date(request.created_at).toLocaleDateString()}</span>
                                    </div>
                                    {/* Placeholder for address if we had it */}
                                    <div className="flex items-center text-gray-500">
                                        <MapPin size={18} className="mr-2" />
                                        <span>Координаты: {request.latitude || 'N/A'}, {request.longitude || 'N/A'}</span>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4 border-t border-gray-100">
                                    <button
                                        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium transition-colors"
                                        onClick={() => alert('Функционал связи с заказчиком в разработке')}
                                    >
                                        Связаться с заказчиком
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WorkerDashboardPage;
