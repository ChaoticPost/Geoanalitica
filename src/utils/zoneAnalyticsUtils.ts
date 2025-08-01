import type { ZoneAnalyticsData } from '@/components/ui/ZoneAnalyticsCard';
import type { Zone } from './zoneUtils';

// Базовые данные для каждой зоны
const ZONE_BASE_DATA = {
  'NW': {
    averageCheck: 850,
    purchaseCount: 12500,
    potentialBuyers: 45000,
    salesPoints: 15,
    revenue: 10625000,
    purchasesPerPoint: 833
  },
  'NE': {
    averageCheck: 920,
    purchaseCount: 14200,
    potentialBuyers: 52000,
    salesPoints: 18,
    revenue: 13064000,
    purchasesPerPoint: 789
  },
  'SW': {
    averageCheck: 780,
    purchaseCount: 9800,
    potentialBuyers: 38000,
    salesPoints: 12,
    revenue: 7644000,
    purchasesPerPoint: 817
  },
  'SE': {
    averageCheck: 890,
    purchaseCount: 11800,
    potentialBuyers: 42000,
    salesPoints: 14,
    revenue: 10502000,
    purchasesPerPoint: 843
  }
};

// Множители для вариации данных
const VARIATION_MULTIPLIERS = {
  averageCheck: { min: 0.9, max: 1.1 },
  purchaseCount: { min: 0.85, max: 1.15 },
  potentialBuyers: { min: 0.8, max: 1.2 },
  salesPoints: { min: 0.9, max: 1.1 },
  revenue: { min: 0.85, max: 1.15 },
  purchasesPerPoint: { min: 0.9, max: 1.1 }
};

// Функция для генерации случайного множителя
const getRandomMultiplier = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

// Функция для генерации аналитики по зоне
export const generateZoneAnalytics = (zone: Zone): ZoneAnalyticsData => {
  const baseData = ZONE_BASE_DATA[zone.id];
  
  if (!baseData) {
    throw new Error(`Нет базовых данных для зоны ${zone.id}`);
  }

  // Генерируем вариации для каждого показателя
  const averageCheck = Math.round(baseData.averageCheck * getRandomMultiplier(
    VARIATION_MULTIPLIERS.averageCheck.min,
    VARIATION_MULTIPLIERS.averageCheck.max
  ));

  const purchaseCount = Math.round(baseData.purchaseCount * getRandomMultiplier(
    VARIATION_MULTIPLIERS.purchaseCount.min,
    VARIATION_MULTIPLIERS.purchaseCount.max
  ));

  const potentialBuyers = Math.round(baseData.potentialBuyers * getRandomMultiplier(
    VARIATION_MULTIPLIERS.potentialBuyers.min,
    VARIATION_MULTIPLIERS.potentialBuyers.max
  ));

  const salesPoints = Math.round(baseData.salesPoints * getRandomMultiplier(
    VARIATION_MULTIPLIERS.salesPoints.min,
    VARIATION_MULTIPLIERS.salesPoints.max
  ));

  const revenue = Math.round(baseData.revenue * getRandomMultiplier(
    VARIATION_MULTIPLIERS.revenue.min,
    VARIATION_MULTIPLIERS.revenue.max
  ));

  const purchasesPerPoint = Math.round(baseData.purchasesPerPoint * getRandomMultiplier(
    VARIATION_MULTIPLIERS.purchasesPerPoint.min,
    VARIATION_MULTIPLIERS.purchasesPerPoint.max
  ));

  return {
    averageCheck,
    purchaseCount,
    potentialBuyers,
    salesPoints,
    revenue,
    purchasesPerPoint
  };
};

// Функция для получения названия зоны на русском
export const getZoneDisplayName = (zoneId: string): string => {
  const zoneNames = {
    'NW': 'Северо-Запад',
    'NE': 'Северо-Восток',
    'SW': 'Юго-Запад',
    'SE': 'Юго-Восток'
  };
  
  return zoneNames[zoneId as keyof typeof zoneNames] || zoneId;
}; 