export interface Transaction {
  transaction_id: number;
  terminal_id: string;
  category: string;
  amount: number;
  timestamp: string;
}

export interface TerminalLocation {
  terminal_id: string;
  lat: number;
  lng: number;
  address: string;
  category: string;
  totalAmount: number;
  transactionCount: number;
  averageAmount: number;
}

// Моковые координаты терминалов в районах Коптево и Коньково
const TERMINAL_LOCATIONS: { [key: string]: { lat: number; lng: number; address: string } } = {
  'K0IOLA40': { lat: 55.831216, lng: 37.526286, address: 'Коптевская улица, 12' },
  'N9PK2K829': { lat: 55.835000, lng: 37.520000, address: 'Коптевская улица, 25' },
  'F8AN9PK2': { lat: 55.828000, lng: 37.532000, address: 'улица Зорге, 8' },
  'BAKS8JK3LK': { lat: 55.825000, lng: 37.528000, address: 'улица Зорге, 15' },
  'N9PPK29S': { lat: 55.822000, lng: 37.525000, address: 'улица Зорге, 22' },
  'K2L9M4N5': { lat: 55.820000, lng: 37.530000, address: 'улица Зорге, 30' },
  'P7Q8R9S0': { lat: 55.818000, lng: 37.527000, address: 'улица Зорге, 35' },
  'T1U2V3W4': { lat: 55.815000, lng: 37.524000, address: 'улица Зорге, 40' },
  'X5Y6Z7A8': { lat: 55.812000, lng: 37.531000, address: 'улица Зорге, 45' },
  'B9C0D1E2': { lat: 55.810000, lng: 37.526000, address: 'улица Зорге, 50' },
  // Коньково
  'F3G4H5I6': { lat: 55.642000, lng: 37.538000, address: 'Миклухо-Маклая улица, 36а' },
  'J7K8L9M0': { lat: 55.636000, lng: 37.534000, address: 'Миклухо-Маклая улица, 55' },
  'N1O2P3Q4': { lat: 55.640135, lng: 37.532896, address: 'Профсоюзная улица, 104' },
  'R5S6T7U8': { lat: 55.645000, lng: 37.535000, address: 'улица Введенского, 5' },
  'V9W0X1Y2': { lat: 55.638000, lng: 37.530000, address: 'улица Бутлерова, 17' },
  'Z3A4B5C6': { lat: 55.640135, lng: 37.532896, address: 'Профсоюзная улица, 104Д' },
  'D7E8F9G0': { lat: 55.640135, lng: 37.532896, address: 'Профсоюзная улица, 104k1' },
  'H1I2J3K4': { lat: 55.640135, lng: 37.532896, address: 'Профсоюзная улица, 104Д' },
  'L5M6N7O8': { lat: 55.640135, lng: 37.532896, address: 'Профсоюзная улица, 104Д' },
  'P9Q0R1S2': { lat: 55.640135, lng: 37.532896, address: 'Профсоюзная улица, 104Д' }
};

import { loadHuggingFaceData } from './csvDataLoader';

// Моковые транзакционные данные (симуляция реальных данных)
const MOCK_TRANSACTIONS: Transaction[] = [
  { transaction_id: 1, terminal_id: 'K0IOLA40', category: 'продукты', amount: 20528.97, timestamp: '2024-10-13 12:22:54' },
  { transaction_id: 2, terminal_id: 'N9PK2K829', category: 'одежда', amount: 13331.03, timestamp: '2023-12-02 12:47:09' },
  { transaction_id: 3, terminal_id: 'F8AN9PK2', category: 'одежда', amount: 24956.95, timestamp: '2023-11-28 13:44:03' },
  { transaction_id: 4, terminal_id: 'BAKS8JK3LK', category: 'одежда', amount: 13108.64, timestamp: '2024-01-23 12:28:20' },
  { transaction_id: 5, terminal_id: 'N9PPK29S', category: 'услуги', amount: 18557.61, timestamp: '2025-02-09 08:25:44' },
  { transaction_id: 6, terminal_id: 'K2L9M4N5', category: 'продукты', amount: 32000.00, timestamp: '2024-11-15 14:30:00' },
  { transaction_id: 7, terminal_id: 'P7Q8R9S0', category: 'одежда', amount: 45000.00, timestamp: '2024-11-16 09:15:00' },
  { transaction_id: 8, terminal_id: 'T1U2V3W4', category: 'услуги', amount: 28000.00, timestamp: '2024-11-17 16:45:00' },
  { transaction_id: 9, terminal_id: 'X5Y6Z7A8', category: 'продукты', amount: 15000.00, timestamp: '2024-11-18 11:20:00' },
  { transaction_id: 10, terminal_id: 'B9C0D1E2', category: 'одежда', amount: 35000.00, timestamp: '2024-11-19 13:10:00' },
  // Коньково
  { transaction_id: 11, terminal_id: 'F3G4H5I6', category: 'продукты', amount: 18000.00, timestamp: '2024-11-20 10:30:00' },
  { transaction_id: 12, terminal_id: 'J7K8L9M0', category: 'одежда', amount: 22000.00, timestamp: '2024-11-21 15:45:00' },
  { transaction_id: 13, terminal_id: 'N1O2P3Q4', category: 'услуги', amount: 25000.00, timestamp: '2024-11-22 12:00:00' },
  { transaction_id: 14, terminal_id: 'R5S6T7U8', category: 'продукты', amount: 12000.00, timestamp: '2024-11-23 08:15:00' },
  { transaction_id: 15, terminal_id: 'V9W0X1Y2', category: 'одежда', amount: 38000.00, timestamp: '2024-11-24 17:30:00' },
  { transaction_id: 16, terminal_id: 'Z3A4B5C6', category: 'услуги', amount: 30000.00, timestamp: '2024-11-25 14:20:00' },
  { transaction_id: 17, terminal_id: 'D7E8F9G0', category: 'продукты', amount: 16000.00, timestamp: '2024-11-26 09:45:00' },
  { transaction_id: 18, terminal_id: 'H1I2J3K4', category: 'одежда', amount: 42000.00, timestamp: '2024-11-27 16:10:00' },
  { transaction_id: 19, terminal_id: 'L5M6N7O8', category: 'услуги', amount: 27000.00, timestamp: '2024-11-28 11:35:00' },
  { transaction_id: 20, terminal_id: 'P9Q0R1S2', category: 'продукты', amount: 14000.00, timestamp: '2024-11-29 13:50:00' }
];

// Функция для загрузки транзакционных данных
export const loadTransactionData = async (): Promise<TerminalLocation[]> => {
  try {
    console.log('Loading transaction data...');
    
    // Загружаем данные из Hugging Face датасета
    const transactions = await loadHuggingFaceData();
    
    // Группируем транзакции по терминалам
    const terminalStats: { [key: string]: { totalAmount: number; count: number; categories: string[] } } = {};
    
    transactions.forEach(transaction => {
      if (!terminalStats[transaction.terminal_id]) {
        terminalStats[transaction.terminal_id] = { totalAmount: 0, count: 0, categories: [] };
      }
      terminalStats[transaction.terminal_id].totalAmount += transaction.amount;
      terminalStats[transaction.terminal_id].count += 1;
      if (!terminalStats[transaction.terminal_id].categories.includes(transaction.category)) {
        terminalStats[transaction.terminal_id].categories.push(transaction.category);
      }
    });

    // Создаем объекты TerminalLocation только для терминалов с известными координатами
    const terminalLocations: TerminalLocation[] = Object.keys(terminalStats)
      .filter(terminalId => TERMINAL_LOCATIONS[terminalId]) // Фильтруем только терминалы с координатами
      .map(terminalId => {
        const stats = terminalStats[terminalId];
        const location = TERMINAL_LOCATIONS[terminalId];
        
        return {
          terminal_id: terminalId,
          lat: location.lat,
          lng: location.lng,
          address: location.address,
          category: stats.categories.join(', '),
          totalAmount: stats.totalAmount,
          transactionCount: stats.count,
          averageAmount: stats.totalAmount / stats.count
        };
      });

    console.log(`Loaded ${terminalLocations.length} terminal locations with transaction data from ${transactions.length} transactions`);
    return terminalLocations;

  } catch (error) {
    console.error('Error loading transaction data:', error);
    // Fallback к моковым данным
    console.log('Falling back to mock data...');
    return loadMockTransactionData();
  }
};

// Функция для загрузки моковых данных (fallback)
const loadMockTransactionData = (): TerminalLocation[] => {
  const terminalStats: { [key: string]: { totalAmount: number; count: number; categories: string[] } } = {};
  
  MOCK_TRANSACTIONS.forEach(transaction => {
    if (!terminalStats[transaction.terminal_id]) {
      terminalStats[transaction.terminal_id] = { totalAmount: 0, count: 0, categories: [] };
    }
    terminalStats[transaction.terminal_id].totalAmount += transaction.amount;
    terminalStats[transaction.terminal_id].count += 1;
    if (!terminalStats[transaction.terminal_id].categories.includes(transaction.category)) {
      terminalStats[transaction.terminal_id].categories.push(transaction.category);
    }
  });

  const terminalLocations: TerminalLocation[] = Object.keys(terminalStats).map(terminalId => {
    const stats = terminalStats[terminalId];
    const location = TERMINAL_LOCATIONS[terminalId];
    
    if (!location) {
      console.warn(`No location found for terminal ${terminalId}`);
      return null;
    }

    return {
      terminal_id: terminalId,
      lat: location.lat,
      lng: location.lng,
      address: location.address,
      category: stats.categories.join(', '),
      totalAmount: stats.totalAmount,
      transactionCount: stats.count,
      averageAmount: stats.totalAmount / stats.count
    };
  }).filter(Boolean) as TerminalLocation[];

  return terminalLocations;
};

// Функция для получения цвета маркера на основе суммы транзакций
export const getTransactionMarkerColor = (totalAmount: number): string => {
  if (totalAmount < 50000) return '#00ff00'; // Зеленый - низкая сумма
  if (totalAmount < 100000) return '#ffff00'; // Желтый - средняя сумма
  if (totalAmount < 150000) return '#ff8000'; // Оранжевый - высокая сумма
  return '#ff0000'; // Красный - очень высокая сумма
};

// Функция для получения размера маркера на основе количества транзакций
export const getTransactionMarkerSize = (transactionCount: number): number => {
  if (transactionCount < 5) return 12;
  if (transactionCount < 10) return 16;
  if (transactionCount < 15) return 20;
  return 24;
};

// Функция для фильтрации терминалов по категории
export const filterTerminalsByCategory = (terminals: TerminalLocation[], category: string): TerminalLocation[] => {
  if (!category || category === 'Все') return terminals;
  return terminals.filter(terminal => 
    terminal.category.toLowerCase().includes(category.toLowerCase())
  );
};

// Функция для получения статистики по категориям
export const getCategoryStats = (terminals: TerminalLocation[]) => {
  const stats: { [key: string]: { count: number; totalAmount: number } } = {};
  
  terminals.forEach(terminal => {
    const categories = terminal.category.split(', ');
    categories.forEach(category => {
      if (!stats[category]) {
        stats[category] = { count: 0, totalAmount: 0 };
      }
      stats[category].count += 1;
      stats[category].totalAmount += terminal.totalAmount;
    });
  });

  return stats;
}; 