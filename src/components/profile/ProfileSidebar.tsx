import { MapPin, FileText, CreditCard, Settings, Building2, LogOut, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProfileSidebarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    onLogout: () => void;
}

const menuItems = [
    {
        id: 'locations',
        icon: MapPin,
        label: 'Мои объекты',
        description: 'Управление локациями'
    },
    {
        id: 'reports',
        icon: FileText,
        label: 'Отчёты',
        description: 'Аналитика и выгрузки'
    },
    {
        id: 'subscription',
        icon: CreditCard,
        label: 'Тариф',
        description: 'Управление подпиской'
    },
    {
        id: 'settings',
        icon: Settings,
        label: 'Настройки',
        description: 'Параметры системы'
    },
    {
        id: 'team',
        icon: Building2,
        label: 'Команда',
        description: 'Управление доступом'
    },
];

export const ProfileSidebar = ({ activeTab, onTabChange, onLogout }: ProfileSidebarProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full lg:w-64 space-y-2"
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
                        className={`w-full flex flex-col items-start p-4 rounded-lg transition-all duration-200 ${isActive
                            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                            : 'hover:bg-accent text-foreground'
                            }`}
                    >
                        <div className="flex items-center w-full">
                            <div className="flex items-center space-x-3 flex-1">
                                <div className={`p-2 rounded-lg ${isActive ? 'bg-primary-foreground/10' : 'bg-primary/10'}`}>
                                    <Icon size={20} className={isActive ? 'text-primary-foreground' : 'text-primary'} />
                                </div>
                                <span className="font-medium">{item.label}</span>
                            </div>
                            <ChevronRight
                                size={16}
                                className={`transform transition-transform duration-200 ${isActive ? 'rotate-90 opacity-100' : 'opacity-0'
                                    }`}
                            />
                        </div>
                        <div className={`mt-1 ml-9 text-sm ${isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                            {item.description}
                        </div>
                    </motion.button>
                );
            })}

            <motion.button
                onClick={onLogout}
                whileHover={{ scale: 1.01, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center space-x-3 p-4 mt-8 text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-200"
            >
                <div className="p-2 rounded-lg bg-destructive/10">
                    <LogOut size={20} />
                </div>
                <span className="font-medium">Выйти</span>
            </motion.button>
        </motion.div>
    );
}; 