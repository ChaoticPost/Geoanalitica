import { AreaChart as RechartsAreaChart, Area, ResponsiveContainer, Tooltip, TooltipProps } from 'recharts';
import { motion } from 'framer-motion';

interface ChartData {
    name: string;
    value: number;
}

interface AreaChartProps {
    data: ChartData[];
    color: string;
    height?: number;
    title?: string;
    percentage?: string;
}

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg border border-gray-200/20 dark:border-gray-700/20">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {payload[0].value}
                </p>
            </div>
        );
    }
    return null;
};

export const AreaChart = ({
    data,
    color,
    height = 60,
    title = "Активность",
    percentage = "+47%"
}: AreaChartProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-[200px] bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200/20 dark:border-gray-700/20"
        >
            <ResponsiveContainer width="100%" height={height}>
                <RechartsAreaChart
                    data={data}
                    margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                            <stop offset="100%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={false}
                    />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke={color}
                        fill={`url(#gradient-${color})`}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{
                            r: 4,
                            fill: color,
                            stroke: 'white',
                            strokeWidth: 2,
                        }}
                    />
                </RechartsAreaChart>
            </ResponsiveContainer>
            <div className="mt-2 flex items-center justify-between">
                <div className="text-xs text-gray-600 dark:text-gray-400">
                    {title}
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {percentage}
                </div>
            </div>
        </motion.div>
    );
}; 