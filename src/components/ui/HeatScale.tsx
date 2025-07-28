import { motion } from 'framer-motion';

interface HeatScaleProps {
    min?: string;
    max?: string;
}

export const HeatScale = ({ min = "Мало", max = "Много" }: HeatScaleProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200/20 dark:border-gray-700/20"
        >
            <div className="h-6 w-[200px] rounded-md overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500" />
            </div>
            <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-600 dark:text-gray-400">{min}</span>
                <span className="text-xs text-gray-600 dark:text-gray-400">{max}</span>
            </div>
        </motion.div>
    );
}; 