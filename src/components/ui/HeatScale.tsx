import { motion } from 'framer-motion';

interface HeatScaleProps {
    min?: string;
    max?: string;
    className?: string;
}

export const HeatScale = ({
    min = "Мало",
    max = "Много",
    className = ""
}: HeatScaleProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`
                bg-white/95 dark:bg-gray-800/95 
                backdrop-blur-sm 
                rounded-xl 
                p-4 
                shadow-lg 
                border border-gray-200/20 dark:border-gray-700/20
                w-fit
                ${className}
            `}
        >
            {/* Градиентная шкала */}
            <div
                className="h-6 w-[240px] rounded-lg mb-3 relative overflow-hidden"
                style={{
                    background: 'linear-gradient(to right, #ef4444, #facc15, #22c55e)',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}
            />

            {/* Подписи */}
            <div className="flex justify-between items-center px-1">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {min}
                </span>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {max}
                </span>
            </div>
        </motion.div>
    );
}; 