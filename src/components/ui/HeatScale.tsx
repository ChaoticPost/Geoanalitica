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
                rounded-lg
                p-2.5
                shadow-lg 
                border border-gray-200/20 dark:border-gray-700/20
                w-fit
                ${className}
            `}
        >
            <div className="flex flex-col gap-1.5">
                {/* Градиентная шкала */}
                <div
                    className="h-3 w-[180px] rounded-md relative overflow-hidden"
                    style={{
                        background: 'linear-gradient(to right, #ef4444, #facc15, #22c55e)',
                        boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)'
                    }}
                />

                {/* Подписи */}
                <div className="flex justify-between items-center px-0.5">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        {min}
                    </span>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        {max}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}; 