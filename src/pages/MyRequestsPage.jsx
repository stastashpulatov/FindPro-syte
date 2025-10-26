import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Eye, Trash2 } from 'lucide-react';
import api from '../services/api';

const MyRequestsPage = ({ setCurrentPage, allRequests, setAllRequests }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const response = await api.getRequests();
      setAllRequests(response.data);
    } catch (error) {
      console.error('Error loading requests:', error);
      if (error.response?.status === 401) {
        alert('Необходимо войти в систему');
        setCurrentPage('home');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadQuotes = async (requestId) => {
    try {
      const response = await api.getQuotes({ request_id: requestId });
      setQuotes(response.data);
    } catch (error) {
      console.error('Error loading quotes:', error);
    }
  };

  const handleViewRequest = async (request) => {
    setSelectedRequest(request);
    await loadQuotes(request.id);
  };

  const handleDeleteRequest = async (requestId) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту заявку?')) {
      return;
    }

    try {
      await api.deleteRequest(requestId);
      setAllRequests(allRequests.filter((r) => r.id !== requestId));
      if (selectedRequest?.id === requestId) {
        setSelectedRequest(null);
      }
      alert('Заявка успешно удалена');
    } catch (error) {
      console.error('Error deleting request:', error);
      alert('Ошибка при удалении заявки');
    }
  };

  const handleAcceptQuote = async (quoteId) => {
    if (!window.confirm('Вы уверены, что хотите принять это предложение?')) {
      return;
    }

    try {
      await api.acceptQuote(quoteId);
      await loadQuotes(selectedRequest.id);
      await loadRequests();
      alert('Предложение принято!');
    } catch (error) {
      console.error('Error accepting quote:', error);
      alert('Ошибка при принятии предложения');
    }
  };

  const handleRejectQuote = async (quoteId) => {
    try {
      await api.rejectQuote(quoteId);
      await loadQuotes(selectedRequest.id);
      alert('Предложение отклонено');
    } catch (error) {
      console.error('Error rejecting quote:', error);
      alert('Ошибка при отклонении предложения');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Ожидает' },
      in_progress: { color: 'bg-blue-100 text-blue-800', icon: Clock, text: 'В работе' },
      completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Завершено' },
      cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Отменено' },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <Icon size={16} />
        {config.text}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка заявок...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Мои заявки</h1>
          <button
            onClick={() => setCurrentPage('request')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Создать новую заявку
          </button>
        </div>

        {allRequests.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 mb-4">У вас пока нет заявок</p>
            <button
              onClick={() => setCurrentPage('request')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Создать первую заявку
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Список заявок */}
            <div className="space-y-4">
              {allRequests.map((request) => (
                <div
                  key={request.id}
                  className={`bg-white rounded-lg shadow p-6 cursor-pointer transition-all ${
                    selectedRequest?.id === request.id ? 'ring-2 ring-blue-500' : 'hover:shadow-lg'
                  }`}
                  onClick={() => handleViewRequest(request)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{request.title}</h3>
                    {getStatusBadge(request.status)}
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{request.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>
                      {new Date(request.created_at).toLocaleDateString('ru-RU')}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewRequest(request);
                        }}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRequest(request.id);
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Детали заявки и предложения */}
            <div className="lg:sticky lg:top-4 h-fit">
              {selectedRequest ? (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {selectedRequest.title}
                  </h2>
                  <div className="mb-4">{getStatusBadge(selectedRequest.status)}</div>
                  <p className="text-gray-600 mb-6">{selectedRequest.description}</p>

                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Предложения ({quotes.length})
                  </h3>

                  {quotes.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      Пока нет предложений от специалистов
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {quotes.map((quote) => (
                        <div
                          key={quote.id}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-semibold text-gray-900">
                                {quote.provider?.company_name || 'Специалист'}
                              </p>
                              <p className="text-2xl font-bold text-blue-600 mt-1">
                                {quote.amount.toLocaleString('ru-RU')} ₽
                              </p>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-sm ${
                                quote.status === 'accepted'
                                  ? 'bg-green-100 text-green-800'
                                  : quote.status === 'rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {quote.status === 'accepted'
                                ? 'Принято'
                                : quote.status === 'rejected'
                                ? 'Отклонено'
                                : 'Ожидает'}
                            </span>
                          </div>
                          {quote.message && (
                            <p className="text-gray-600 text-sm mb-3">{quote.message}</p>
                          )}
                          {quote.status === 'pending' && (
                            <div className="flex gap-2 mt-3">
                              <button
                                onClick={() => handleAcceptQuote(quote.id)}
                                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                              >
                                Принять
                              </button>
                              <button
                                onClick={() => handleRejectQuote(quote.id)}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
                              >
                                Отклонить
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                  <p className="text-gray-500">
                    Выберите заявку, чтобы увидеть детали и предложения
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequestsPage;
