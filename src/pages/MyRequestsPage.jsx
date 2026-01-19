import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, Star, MessageSquare, X } from 'lucide-react';
import api from '../services/api';
import QuotesList from '../components/QuotesList';
import ConfirmModal from '../components/ConfirmModal';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const MyRequestsPage = ({ onNavigate }) => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [quotesModalOpen, setQuotesModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [confirmModal, setConfirmModal] = useState({ open: false, request: null });

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const response = await api.getRequests();
      setRequests(response.data);
    } catch (error) {
      console.error('Error loading requests:', error);
      toast.error('Не удалось загрузить заявки');
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = (request) => {
    setConfirmModal({ open: true, request });
  };

  const confirmComplete = async () => {
    const request = confirmModal.request;
    if (!request) return;

    try {
      await api.completeRequest(request.id);
      loadRequests();
      setSelectedRequest(request);
      setReviewModalOpen(true);
      toast.success('Заявка завершена!');
    } catch (error) {
      console.error('Error completing request:', error);
      toast.error('Ошибка при завершении заявки');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await api.createReview({
        request_id: selectedRequest.id,
        rating: reviewData.rating,
        comment: reviewData.comment
      });
      toast.success('Спасибо за ваш отзыв!');
      setReviewModalOpen(false);
      setReviewData({ rating: 5, comment: '' });
    } catch (error) {
      console.error('Error creating review:', error);
      toast.error('Ошибка при отправке отзыва');
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
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Назад
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Мои заявки</h1>

        {isLoading ? (
          <div className="py-12">
            <Loader size="large" />
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 mb-4">У вас пока нет активных заявок</p>
            <button
              onClick={() => onNavigate('request')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Создать заявку
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map((request) => (
              <div key={request.id} className="bg-white rounded-lg shadow p-6 border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{request.title}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {getStatusText(request.status)}
                    </span>
                  </div>
                  {request.price && (
                    <div className="text-lg font-bold text-gray-900">
                      {request.price.toLocaleString()} сум
                    </div>
                  )}
                </div>

                <p className="text-gray-600 mb-4">{request.description}</p>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-500">
                    Создано: {new Date(request.created_at).toLocaleDateString()}
                  </div>

                  <div className="flex gap-3">
                    {request.status === 'pending' && (
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          setQuotesModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium transition-colors"
                      >
                        <MessageSquare size={16} />
                        Предложения
                      </button>
                    )}

                    {request.status !== 'completed' && request.status !== 'cancelled' && request.provider_id && (
                      <button
                        onClick={() => handleComplete(request)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
                      >
                        <CheckCircle size={16} />
                        Завершить работу
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quotes Modal */}
      {quotesModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Предложения специалистов</h2>
                <p className="text-sm text-gray-500 mt-1">для заявки "{selectedRequest.title}"</p>
              </div>
              <button
                onClick={() => setQuotesModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <QuotesList
                requestId={selectedRequest.id}
                onQuoteAccepted={() => {
                  setQuotesModalOpen(false);
                  loadRequests();
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Оцените работу</h2>
            <p className="text-gray-600 mb-6">
              Пожалуйста, оцените работу специалиста по заявке "{selectedRequest?.title}"
            </p>

            <form onSubmit={handleSubmitReview}>
              <div className="flex justify-center mb-6 gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewData({ ...reviewData, rating: star })}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      size={32}
                      className={star <= reviewData.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                    />
                  </button>
                ))}
              </div>

              <textarea
                value={reviewData.comment}
                onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                placeholder="Напишите ваш отзыв..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-6 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="4"
              />

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Позже
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Отправить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        open={confirmModal.open}
        onClose={() => setConfirmModal({ ...confirmModal, open: false })}
        onConfirm={confirmComplete}
        title="Завершить работу?"
        message="Вы уверены, что хотите завершить эту заявку? Средства будут переведены исполнителю."
        confirmText="Завершить"
        variant="success"
      />
    </div>
  );
};

export default MyRequestsPage;
