import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, DollarSign, User, Clock } from 'lucide-react';
import api from '../services/api';
import Loader from './Loader';
import ConfirmModal from './ConfirmModal';
import toast from 'react-hot-toast';

const QuotesList = ({ requestId, onQuoteAccepted }) => {
    const [quotes, setQuotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [confirmModal, setConfirmModal] = useState({ open: false, quoteId: null });

    useEffect(() => {
        loadQuotes();
    }, [requestId]);

    const loadQuotes = async () => {
        try {
            const response = await api.getQuotes({ request_id: requestId });
            setQuotes(response.data);
        } catch (error) {
            console.error('Error loading quotes:', error);
            toast.error('Не удалось загрузить предложения');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAccept = (quoteId) => {
        setConfirmModal({ open: true, quoteId });
    };

    const confirmAccept = async () => {
        const quoteId = confirmModal.quoteId;
        if (!quoteId) return;

        try {
            await api.acceptQuote(quoteId);
            toast.success('Предложение принято!');
            loadQuotes();
            if (onQuoteAccepted) onQuoteAccepted();
        } catch (error) {
            console.error('Error accepting quote:', error);
            toast.error('Ошибка при принятии предложения');
        }
    };

    const handleReject = async (quoteId) => {
        try {
            await api.rejectQuote(quoteId);
            toast.success('Предложение отклонено');
            loadQuotes();
        } catch (error) {
            console.error('Error rejecting quote:', error);
            toast.error('Ошибка при отклонении предложения');
        }
    };

    if (isLoading) return <Loader />;

    if (quotes.length === 0) {
        return (
            <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                Пока нет предложений от специалистов
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {quotes.map((quote) => (
                <div
                    key={quote.id}
                    className={`bg-white border rounded-lg p-4 transition-all ${quote.status === 'accepted' ? 'border-green-500 ring-1 ring-green-500' :
                        quote.status === 'rejected' ? 'opacity-50 bg-gray-50' : 'border-gray-200 hover:shadow-md'
                        }`}
                >
                    <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                <User size={20} className="text-gray-600" />
                            </div>
                            <div>
                                <div className="font-medium text-gray-900">
                                    Специалист #{quote.provider_id}
                                </div>
                                <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                    <Clock size={14} />
                                    {new Date(quote.created_at).toLocaleDateString()}
                                </div>
                                <div className="mt-2 text-gray-700">{quote.message}</div>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="text-lg font-bold text-green-600 flex items-center justify-end gap-1">
                                <DollarSign size={16} />
                                {quote.price.toLocaleString()} сум
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                                {quote.days_to_complete} дн.
                            </div>
                        </div>
                    </div>

                    {quote.status === 'pending' && (
                        <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-gray-100">
                            <button
                                onClick={() => handleReject(quote.id)}
                                className="flex items-center gap-1 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-md text-sm font-medium transition-colors"
                            >
                                <XCircle size={16} />
                                Отклонить
                            </button>
                            <button
                                onClick={() => handleAccept(quote.id)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white hover:bg-green-700 rounded-md text-sm font-medium transition-colors shadow-sm"
                            >
                                <CheckCircle size={16} />
                                Принять
                            </button>
                        </div>
                    )}

                    {quote.status === 'accepted' && (
                        <div className="mt-3 text-center py-1 bg-green-50 text-green-700 text-sm font-medium rounded">
                            Предложение принято
                        </div>
                    )}
                </div>
            ))}

            <ConfirmModal
                open={confirmModal.open}
                onClose={() => setConfirmModal({ ...confirmModal, open: false })}
                onConfirm={confirmAccept}
                title="Принять предложение?"
                message="Вы уверены, что хотите принять это предложение? Другие предложения по этой заявке будут автоматически отклонены."
                confirmText="Принять"
                variant="success"
            />
        </div>
    );
};

export default QuotesList;
