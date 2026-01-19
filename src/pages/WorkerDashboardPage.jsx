import React, { useState, useEffect } from 'react';
import { Briefcase, Search, Calendar, MapPin } from 'lucide-react';
import api from '../services/api';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const WorkerDashboardPage = ({ onNavigate, currentUser }) => {
    const [activeTab, setActiveTab] = useState('my-jobs'); // 'my-jobs' or 'find-work'
    const [myJobs, setMyJobs] = useState([]);
    const [openRequests, setOpenRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [applyingId, setApplyingId] = useState(null);
    const [quoteData, setQuoteData] = useState({ price: '', days_to_complete: '', message: '' });

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const response = await api.getRequests();
            const allRequests = response.data;

            // Filter requests
            const my = allRequests.filter(req => req.provider_id === currentUser?.provider?.id);
            const open = allRequests.filter(req => !req.provider_id && req.user_id !== currentUser?.id);

            setMyJobs(my);
            setOpenRequests(open);
        } catch (error) {
            console.error('Error loading requests:', error);
            toast.error('Не удалось загрузить задачи');
        } finally {
            setIsLoading(false);
        }
    };

    const handleApply = async (requestId) => {
        if (!quoteData.price || !quoteData.days_to_complete) {
            toast.error('Пожалуйста, укажите цену и сроки');
            return;
        }

        try {
            await api.createQuote({
                request_id: requestId,
                provider_id: currentUser.provider.id,
                price: parseFloat(quoteData.price),
                days_to_complete: parseInt(quoteData.days_to_complete),
                message: quoteData.message
            });
            toast.success('Предложение отправлено!');
            setApplyingId(null);
            setQuoteData({ price: '', days_to_complete: '', message: '' });
            loadData();
        } catch (error) {
            console.error('Error creating quote:', error);
            toast.error(error.response?.data?.detail || 'Ошибка при отправке предложения');
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
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Панель специалиста</h1>
                        <p className="text-gray-500 mt-1">
                            Добро пожаловать, {currentUser?.full_name || 'Специалист'}
                        </p>
                    </div>
                    <div className="flex bg-white p-1 rounded-lg shadow-sm border border-gray-200">
                        <button
                            onClick={() => setActiveTab('my-jobs')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'my-jobs'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50'
                                } `}
                        >
                            Мои задачи
                        </button>
                        <button
                            onClick={() => setActiveTab('find-work')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'find-work'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50'
                                } `}
                        >
                            Найти работу
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="py-20">
                        <Loader size="large" />
                    </div>
                ) : (
                    <>
                        {activeTab === 'my-jobs' && (
                            <div className="space-y-6">
                                {myJobs.length === 0 ? (
                                    <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
                                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Briefcase className="text-blue-600" size={32} />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Нет активных задач</h3>
                                        <p className="text-gray-500 mb-6">У вас пока нет назначенных задач. Перейдите во вкладку "Найти работу", чтобы откликнуться на заявки.</p>
                                        <button
                                            onClick={() => setActiveTab('find-work')}
                                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                                        >
                                            Найти работу
                                        </button>
                                    </div>
                                ) : (
                                    myJobs.map((job) => (
                                        <div key={job.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)} `}>
                                                        {getStatusText(job.status)}
                                                    </span>
                                                </div>
                                                {job.price && (
                                                    <div className="text-lg font-bold text-green-600 bg-green-50 px-3 py-1 rounded-lg">
                                                        {job.price.toLocaleString()} сум
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>
                                            <div className="flex items-center gap-4 text-sm text-gray-500 pt-4 border-t border-gray-50">
                                                <div className="flex items-center">
                                                    <Calendar size={16} className="mr-1.5" />
                                                    {new Date(job.created_at).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center">
                                                    <MapPin size={16} className="mr-1.5" />
                                                    {job.latitude ? 'На карте' : 'Адрес не указан'}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {activeTab === 'find-work' && (
                            <div className="space-y-6">
                                {openRequests.length === 0 ? (
                                    <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Search className="text-gray-400" size={32} />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Нет доступных заявок</h3>
                                        <p className="text-gray-500">Сейчас нет новых заявок. Загляните позже!</p>
                                    </div>
                                ) : (
                                    openRequests.map((req) => (
                                        <div key={req.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{req.title}</h3>
                                                    <div className="flex items-center gap-2">
                                                        <span className="bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full text-xs font-medium">
                                                            Новая заявка
                                                        </span>
                                                    </div>
                                                </div>
                                                {req.price && (
                                                    <div className="text-lg font-bold text-gray-900">
                                                        ~{req.price.toLocaleString()} сум
                                                    </div>
                                                )}
                                            </div>

                                            <p className="text-gray-600 mb-6">{req.description}</p>

                                            {applyingId === req.id ? (
                                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 animate-in fade-in slide-in-from-top-2">
                                                    <h4 className="font-medium text-gray-900 mb-3">Ваше предложение</h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Стоимость (сум)</label>
                                                            <input
                                                                type="number"
                                                                value={quoteData.price}
                                                                onChange={(e) => setQuoteData({ ...quoteData, price: e.target.value })}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                placeholder="0"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Срок (дней)</label>
                                                            <input
                                                                type="number"
                                                                value={quoteData.days_to_complete}
                                                                onChange={(e) => setQuoteData({ ...quoteData, days_to_complete: e.target.value })}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                placeholder="1"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="mb-4">
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Комментарий</label>
                                                        <textarea
                                                            value={quoteData.message}
                                                            onChange={(e) => setQuoteData({ ...quoteData, message: e.target.value })}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            rows="2"
                                                            placeholder="Почему стоит выбрать вас?"
                                                        />
                                                    </div>
                                                    <div className="flex gap-3">
                                                        <button
                                                            onClick={() => setApplyingId(null)}
                                                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white font-medium"
                                                        >
                                                            Отмена
                                                        </button>
                                                        <button
                                                            onClick={() => handleApply(req.id)}
                                                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                                                        >
                                                            Отправить предложение
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                                        <div className="flex items-center">
                                                            <Calendar size={16} className="mr-1.5" />
                                                            {new Date(req.created_at).toLocaleDateString()}
                                                        </div>
                                                        <div className="flex items-center">
                                                            <MapPin size={16} className="mr-1.5" />
                                                            {req.latitude ? 'На карте' : 'Адрес не указан'}
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            setApplyingId(req.id);
                                                            setQuoteData({ price: req.price || '', days_to_complete: '', message: '' });
                                                        }}
                                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm"
                                                    >
                                                        Откликнуться
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default WorkerDashboardPage;
