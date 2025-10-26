// Export all page components
export { default as HomePage } from './HomePage';
export { default as RequestPage } from './RequestPage';
export { default as MyRequestsPage } from './MyRequestsPage';
export { default as ProvidersPage } from './ProvidersPage';

// Quotes Page Component (simple placeholder)
export const QuotesPage = () => (
  <div className="py-12">
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Предложения от специалистов</h2>
      <div className="space-y-4">
        <p>Здесь будут отображаться предложения от специалистов</p>
      </div>
    </div>
  </div>
);

// Footer Component
export const Footer = () => (
  <footer className="bg-gray-800 text-white py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-lg font-bold mb-4">FindPro</h3>
          <p className="text-gray-400">Платформа для поиска проверенных специалистов</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Навигация</h4>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-400 hover:text-white">Главная</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white">Специалисты</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white">О нас</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white">Контакты</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Контакты</h4>
          <ul className="space-y-2">
            <li className="flex items-center text-gray-400">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              г. Город, ул. Улица, д. 1
            </li>
            <li className="flex items-center text-gray-400">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +7 (XXX) XXX-XX-XX
            </li>
            <li className="flex items-center text-gray-400">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              info@findpro.ru
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-gray-700">
        <p className="text-center text-gray-400 text-sm">© {new Date().getFullYear()} FindPro. Все права защищены.</p>
      </div>
    </div>
  </footer>
);
