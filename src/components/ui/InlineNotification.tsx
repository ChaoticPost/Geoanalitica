import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { cn } from '@/utils/cn';

type NotificationType = 'error' | 'success' | 'info' | 'warning';

interface InlineNotificationProps {
    show: boolean;
    type?: NotificationType;
    message: string;
    onClose?: () => void;
    className?: string;
    overlay?: boolean;
}

const notificationStyles: Record<NotificationType, string> = {
    error: 'bg-destructive/95 text-destructive-foreground border-destructive/20',
    success: 'bg-green-500/95 text-white border-green-500/20',
    info: 'bg-blue-500/95 text-white border-blue-500/20',
    warning: 'bg-yellow-500/95 text-white border-yellow-500/20',
};

const notificationIcons: Record<NotificationType, React.ElementType> = {
    error: AlertCircle,
    success: CheckCircle,
    info: Info,
    warning: AlertCircle,
};

export const InlineNotification = ({
    show,
    type = 'error',
    message,
    onClose,
    className,
    overlay = false
}: InlineNotificationProps) => {
    const Icon = notificationIcons[type];

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                        'flex items-center justify-between p-3 rounded-lg border backdrop-blur-sm',
                        notificationStyles[type],
                        overlay ? 'absolute inset-0 z-10' : 'mb-4',
                        className
                    )}
                >
                    <div className="flex items-center gap-2 mx-auto">
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{message}</span>
                    </div>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="absolute right-2 top-2 p-1 hover:bg-background/10 rounded-full transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}; 