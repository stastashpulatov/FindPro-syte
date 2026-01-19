import React, { useState, useEffect } from 'react';
import { ArrowLeft, MessageSquare, Tag, Clock, ChevronRight } from 'lucide-react';
import api from '../services/api';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const QuotesPage = ({ onNavigate }) => {
    const [quotes, setQuotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadQuotes();
    }, []);

    const loadQuotes = async () => {
        try {
            // In a real app, the backend should return quotes relevant to the current user
            const response = await api.getQuotes();
            setQuotes(response.data);
        } catch (error) {
            console.error('Error loading quotes:', error);
            toast.error('Не удалось загрузить предложения');
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'accepted': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'accepted': return 'Принято';
            case 'rejected': return 'Отклонено';
            case 'pending': return 'Ожидает';
            default: return status;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => onNavigate('home')}
                    className="flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Назад на главную
                </button>

                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Мои предложения</h1>
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
                        <span className="text-sm text-gray-500">Всего получено: </span>
                        <span className="font-bold text-blue-600">{quotes.length}</span>
                    </div>
                </div>

                {isLoading ? (
                    <div className="py-20 flex justify-center">
                        <Loader size="large" />
                    </div>
                ) : quotes.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageSquare size={32} />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Предложений пока нет</h3>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                            Как только специалисты откликнутся на ваши заявки, их предложения появятся здесь.
                        </p>
                        <button
                            onClick={() => onNavigate('my-requests')}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-all shadow-md hover:shadow-lg active:scale-95"
                        >
                            Проверить мои заявки
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {quotes.map((quote) => (
                            <div
                                key={quote.id}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group"
                            >
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                                <Tag size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">
                                                    Предложение по заявке #{quote.request_id}
                                                </h3>
                                                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={14} />
                                                        {new Date(quote.created_at).toLocaleDateString()}
                                                    </span>
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(quote.status)}`}>
                                                        {getStatusText(quote.status)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-black text-green-600">
                                                {quote.price.toLocaleString()} сум
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Срок: {quote.days_to_complete} дн.
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4 mb-4 text-gray-700 italic border-l-4 border-blue-200">
                                        "{quote.message}"
                                    </div>

                                    <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                                        <div className="text-sm text-gray-600 font-medium">
                                            Специалист ID: {quote.provider_id}
                                        </div>
                                        <button
                                            onClick={() => onNavigate('my-requests')}
                                            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold group/btn"
                                        >
                                            Подробнее в заявке
                                            <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuotesPage;
