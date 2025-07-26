import { MapPin, FileText, CreditCard, Settings, Users, LogOut, Building2, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProfileSidebarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    onLogout: () => void;
}

const menuItems = [
    { id: 'profile', icon: Users, label: 'Профиль' },
    { id: 'locations', icon: MapPin, label: 'Мои объекты' },
    { id: 'reports', icon: FileText, label: 'Отчёты и выгрузки' },
    { id: 'subscription', icon: CreditCard, label: 'Мой тариф и оплата' },
    { id: 'settings', icon: Settings, label: 'Настройки' },
    { id: 'team', icon: Building2, label: 'Команда' },
];

export const ProfileSidebar = ({ activeTab, onTabChange, onLogout }: ProfileSidebarProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full lg:w-64 space-y-1"
        >
            {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                    <motion.button
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        whileHover={{ scale: 1.01, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'hover:bg-card text-foreground'
                            }`}
                    >
                        <div className="flex items-center space-x-3">
                            <Icon size={20} className={isActive ? 'text-white' : 'text-primary'} />
                            <span className="font-medium">{item.label}</span>
                        </div>
                        <ChevronRight size={16} className={`transform transition-transform duration-200 ${isActive ? 'rotate-90 opacity-100' : 'opacity-0'
                            }`} />
                    </motion.button>
                );
            })}

            <motion.button
                onClick={onLogout}
                whileHover={{ scale: 1.01, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center space-x-3 px-4 py-3 mt-8 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all duration-200"
            >
                <LogOut size={20} />
                <span className="font-medium">Выйти</span>
            </motion.button>
        </motion.div>
    );
}; 