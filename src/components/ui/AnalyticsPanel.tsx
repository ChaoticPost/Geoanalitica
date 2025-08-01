import { useState } from 'react';

interface AnalyticsData {
  potentialBuyers: { min: number; max: number };
  salesPoints: number;
  averageCheck: number;
  purchasesPerClient: number;
  totalRevenue: { min: number; max: number };
  purchasesPerPoint: { min: number; max: number };
}

interface AnalyticsPanelProps {
  isVisible: boolean;
  onClose: () => void;
  data: AnalyticsData;
  areaName: string;
  category: string;
  period: string;
}

const AnalyticsPanel = ({ isVisible, onClose, data, areaName, category, period }: AnalyticsPanelProps) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  if (!isVisible) return null;

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)} МЛН`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)} К`;
    }
    return num.toLocaleString('ru-RU');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 relative">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">АНАЛИТИКА</h2>
              <p className="text-blue-100 text-sm">
                Выбранная область: <span className="font-semibold">{areaName}</span>
              </p>
              <p className="text-blue-100 text-sm">
                {period} • {category}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2 rounded-lg transition-colors ${isBookmarked
                  ? 'bg-yellow-500 text-white'
                  : 'bg-white/20 hover:bg-white/30'
                  }`}
                title={isBookmarked ? 'Убрать из закладок' : 'Добавить в закладки'}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                title="Закрыть"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 lg:gap-6">
            {/* Потенциальные покупатели */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 lg:p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-start mb-3 lg:mb-4">
                <div className="flex-1">
                  <h3 className="text-base lg:text-lg font-bold text-gray-900 dark:text-white">
                    {formatNumber(data.potentialBuyers.min)} - {formatNumber(data.potentialBuyers.max)}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-xs lg:text-sm">
                    потенциальных покупателей
                  </p>
                </div>
                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium ml-2 flex-shrink-0">
                  Большой поток
                </span>
              </div>
              <div className="flex gap-1 h-6 lg:h-8">
                <div className="w-3 lg:w-4 bg-orange-400 rounded-sm"></div>
                <div className="w-3 lg:w-4 bg-orange-500 rounded-sm"></div>
                <div className="w-3 lg:w-4 bg-yellow-500 rounded-sm"></div>
              </div>
            </div>

            {/* Точки продаж */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 lg:p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-start mb-3 lg:mb-4">
                <div className="flex-1">
                  <h3 className="text-base lg:text-lg font-bold text-gray-900 dark:text-white">
                    {data.salesPoints}+
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-xs lg:text-sm">
                    точек продаж
                  </p>
                </div>
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium ml-2 flex-shrink-0">
                  Очень высокая конкуренция
                </span>
              </div>
              <div className="flex gap-1 h-6 lg:h-8">
                <div className="w-3 lg:w-4 bg-blue-400 rounded-sm"></div>
                <div className="w-3 lg:w-4 bg-blue-500 rounded-sm"></div>
                <div className="w-3 lg:w-4 bg-green-500 rounded-sm"></div>
                <div className="w-3 lg:w-4 bg-green-600 rounded-sm"></div>
              </div>
            </div>

            {/* Средний чек */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 lg:p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-start mb-3 lg:mb-4">
                <div className="flex-1">
                  <h3 className="text-base lg:text-lg font-bold text-gray-900 dark:text-white">
                    {formatCurrency(data.averageCheck)}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-xs lg:text-sm">
                    Средний чек
                  </p>
                </div>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium ml-2 flex-shrink-0">
                  Стабильно
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (data.averageCheck / 1000) * 10)}%` }}
                ></div>
              </div>
            </div>

            {/* Покупки на клиента */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 lg:p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-start mb-3 lg:mb-4">
                <div className="flex-1">
                  <h3 className="text-base lg:text-lg font-bold text-gray-900 dark:text-white">
                    {data.purchasesPerClient.toFixed(2)}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-xs lg:text-sm">
                    Среднее число покупок одного клиента
                  </p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium ml-2 flex-shrink-0">
                  Лояльность
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(data.purchasesPerClient / 3) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">из 3</span>
              </div>
            </div>

            {/* Общая выручка */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 lg:p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-start mb-3 lg:mb-4">
                <div className="flex-1">
                  <h3 className="text-base lg:text-lg font-bold text-gray-900 dark:text-white">
                    {formatCurrency(data.totalRevenue.min)} - {formatCurrency(data.totalRevenue.max)}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-xs lg:text-sm">
                    Общая выручка
                  </p>
                </div>
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-medium ml-2 flex-shrink-0">
                  Высокий доход
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (data.totalRevenue.min / 10000000) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Покупки на точку */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 lg:p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-start mb-3 lg:mb-4">
                <div className="flex-1">
                  <h3 className="text-base lg:text-lg font-bold text-gray-900 dark:text-white">
                    {formatNumber(data.purchasesPerPoint.min)} - {formatNumber(data.purchasesPerPoint.max)}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-xs lg:text-sm">
                    Среднее количество покупок в точке продаж
                  </p>
                </div>
                <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full font-medium ml-2 flex-shrink-0">
                  Активность
                </span>
              </div>
              <div className="flex gap-1 h-6 lg:h-8">
                <div className="w-2 lg:w-3 bg-indigo-400 rounded-sm"></div>
                <div className="w-2 lg:w-3 bg-indigo-500 rounded-sm"></div>
                <div className="w-2 lg:w-3 bg-indigo-600 rounded-sm"></div>
                <div className="w-2 lg:w-3 bg-indigo-700 rounded-sm"></div>
                <div className="w-2 lg:w-3 bg-indigo-800 rounded-sm"></div>
              </div>
            </div>
          </div>

          {/* Дополнительная информация */}
          <div className="mt-6 lg:mt-8 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 lg:p-6">
            <h4 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-3 lg:mb-4">
              📊 Рекомендации по развитию
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
              <div className="flex items-start gap-2 lg:gap-3">
                <div className="w-6 h-6 lg:w-8 lg:h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 lg:w-4 lg:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white text-sm lg:text-base">Высокий потенциал</h5>
                  <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">
                    Большое количество потенциальных покупателей указывает на перспективность локации
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 lg:gap-3">
                <div className="w-6 h-6 lg:w-8 lg:h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 lg:w-4 lg:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white text-sm lg:text-base">Конкуренция</h5>
                  <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">
                    Высокая конкуренция требует уникального торгового предложения
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel; 