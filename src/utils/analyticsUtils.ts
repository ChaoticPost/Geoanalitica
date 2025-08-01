import type { TerminalLocation } from './transactionDataLoader';
import type { CianProperty } from './cianDataLoader';

export interface AnalyticsData {
  potentialBuyers: { min: number; max: number };
  salesPoints: number;
  averageCheck: number;
  purchasesPerClient: number;
  totalRevenue: { min: number; max: number };
  purchasesPerPoint: { min: number; max: number };
}

// Функция для генерации аналитических данных на основе транзакций
export const generateAnalyticsData = (
  terminals: TerminalLocation[],
  properties: CianProperty[],
  areaName: string
): AnalyticsData => {
  // Базовые данные для разных районов
  const areaMultipliers = {
    'Коптево': { population: 1.2, competition: 1.1, income: 0.9 },
    'Коньково': { population: 1.0, competition: 1.0, income: 1.0 },
    'Зорге': { population: 1.3, competition: 1.2, income: 1.1 },
    'Миклухо-Маклая': { population: 1.1, competition: 0.9, income: 1.2 },
    'Профсоюзная': { population: 1.4, competition: 1.3, income: 1.3 },
    'Введенского': { population: 0.9, competition: 0.8, income: 0.8 },
    'Бутлерова': { population: 1.0, competition: 1.0, income: 1.0 }
  };

  // Определяем район на основе адресов
  let areaKey = 'Коньково'; // по умолчанию
  for (const key of Object.keys(areaMultipliers)) {
    if (areaName.includes(key)) {
      areaKey = key;
      break;
    }
  }

  const multiplier = areaMultipliers[areaKey as keyof typeof areaMultipliers];

  // Рассчитываем данные на основе терминалов
  const totalTransactions = terminals.reduce((sum, terminal) => sum + terminal.transactionCount, 0);
  const totalRevenue = terminals.reduce((sum, terminal) => sum + terminal.totalAmount, 0);
  const averageCheck = totalTransactions > 0 ? totalRevenue / totalTransactions : 600;

  // Генерируем реалистичные данные
  const basePopulation = 50000 + Math.random() * 30000;
  const potentialBuyers = {
    min: Math.floor(basePopulation * multiplier.population * 0.8),
    max: Math.floor(basePopulation * multiplier.population * 1.2)
  };

  const salesPoints = Math.max(5, Math.floor(terminals.length * multiplier.competition * (1 + Math.random() * 0.5)));

  const purchasesPerClient = 1.5 + Math.random() * 1.0;

  const totalRevenueRange = {
    min: Math.floor(totalRevenue * multiplier.income * 0.9),
    max: Math.floor(totalRevenue * multiplier.income * 1.1)
  };

  const purchasesPerPoint = {
    min: Math.floor(totalTransactions / Math.max(1, terminals.length) * 0.8),
    max: Math.floor(totalTransactions / Math.max(1, terminals.length) * 1.2)
  };

  return {
    potentialBuyers,
    salesPoints,
    averageCheck: Math.round(averageCheck),
    purchasesPerClient,
    totalRevenue: totalRevenueRange,
    purchasesPerPoint
  };
};

// Функция для получения названия области по координатам
export const getAreaName = (lat: number, lng: number): string => {
  // Определяем район по координатам (более точные границы)
  
  // Коптево - основной район карты
  if (lat >= 55.82 && lat <= 55.85 && lng >= 37.51 && lng <= 37.55) {
    return 'Коптево';
  }
  
  // Коньково - южная часть
  if (lat >= 55.63 && lat <= 55.66 && lng >= 37.52 && lng <= 37.55) {
    return 'Коньково';
  }
  
  // Зорге - северная часть
  if (lat >= 55.80 && lat <= 55.85 && lng >= 37.51 && lng <= 37.54) {
    return 'Зорге';
  }
  
  // Миклухо-Маклая - западная часть
  if (lat >= 55.62 && lat <= 55.65 && lng >= 37.50 && lng <= 37.53) {
    return 'Миклухо-Маклая';
  }
  
  // Профсоюзная - восточная часть
  if (lat >= 55.63 && lat <= 55.66 && lng >= 37.54 && lng <= 37.57) {
    return 'Профсоюзная';
  }
  
  // Введенского - центральная часть
  if (lat >= 55.63 && lat <= 55.66 && lng >= 37.52 && lng <= 37.55) {
    return 'Введенского';
  }
  
  // Бутлерова - юго-западная часть
  if (lat >= 55.62 && lat <= 55.65 && lng >= 37.51 && lng <= 37.54) {
    return 'Бутлерова';
  }
  
  return 'Выбранная область';
};

// Функция для получения категории на основе транзакций
export const getCategoryFromTransactions = (terminals: TerminalLocation[]): string => {
  const categories = terminals.map(terminal => terminal.category).flat();
  const categoryCounts: { [key: string]: number } = {};
  
  categories.forEach(category => {
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });

  const mostCommonCategory = Object.keys(categoryCounts).reduce((a, b) => 
    categoryCounts[a] > categoryCounts[b] ? a : b
  );

  return mostCommonCategory || 'Продукты';
};

// Функция для получения периода
export const getCurrentPeriod = (): string => {
  const now = new Date();
  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];
  
  return `${months[now.getMonth()]} ${now.getFullYear()}`;
}; 