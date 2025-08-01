import { useState } from 'react';
import { X, TrendingUp, Users, ShoppingCart, DollarSign } from 'lucide-react';

export interface ZoneAnalyticsData {
    averageCheck: number;
    purchaseCount: number;
    potentialBuyers: number;
    salesPoints: number;
    revenue: number;
    purchasesPerPoint: number;
}

export interface ZoneAnalyticsCardProps {
    isVisible: boolean;
    onClose: () => void;
    data: ZoneAnalyticsData;
    zoneName: string;
    position: { x: number; y: number };
}

const ZoneAnalyticsCard = ({ isVisible, onClose, data, zoneName, position }: ZoneAnalyticsCardProps) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('ru-RU').format(num);
    };

    if (!isVisible) return null;

    return (
        <div
            className="fixed z-50 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-sm w-80"
            style={{
                left: position.x,
                top: position.y,
                transform: 'translate(-50%, -100%) translateY(-10px)'
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">
                        {zoneName}
                    </span>
                </div>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                    <X className="w-4 h-4 text-gray-500" />
                </button>
            </div>

            {/* Content */}
            <div className="p-3 space-y-3">
                {/* Average Check */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">Средний чек</span>
                    </div>
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">
                        {formatCurrency(data.averageCheck)}
                    </span>
                </div>

                {/* Purchase Count */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4 text-blue-500" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">Покупки</span>
                    </div>
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">
                        {formatNumber(data.purchaseCount)}
                    </span>
                </div>

                {/* Potential Buyers */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-500" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">Покупатели</span>
                    </div>
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">
                        {formatNumber(data.potentialBuyers)}
                    </span>
                </div>

                {/* Sales Points */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-orange-500" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">Точки продаж</span>
                    </div>
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">
                        {formatNumber(data.salesPoints)}
                    </span>
                </div>
            </div>

            {/* Arrow */}
            <div
                className="absolute w-3 h-3 bg-white dark:bg-gray-800 border-r border-b border-gray-200 dark:border-gray-700 transform rotate-45"
                style={{
                    left: '50%',
                    bottom: '-6px',
                    transform: 'translateX(-50%) rotate(45deg)'
                }}
            />
        </div>
    );
};

export default ZoneAnalyticsCard; 