import { useState } from 'react';
import { Button } from '../ui/Button';
import { ThemeToggle } from '../ui/ThemeToggle';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Bell, Map, Lock, ChevronRight } from 'lucide-react';

interface SettingsProps {
    onChangePassword: () => void;
    onToggleNotifications: (enabled: boolean) => void;
}

const settingsSections = [
    {
        id: 'map',
        title: 'Карта по умолчанию',
        icon: Map,
        description: 'Настройки отображения и радиуса зоны охвата'
    },
    {
        id: 'notifications',
        title: 'Уведомления',
        icon: Bell,
        description: 'Настройка push-уведомлений и email-рассылок'
    },
    {
        id: 'security',
        title: 'Безопасность',
        icon: Lock,
        description: 'Пароль и двухфакторная аутентификация'
    }
];

export const Settings = ({ onChangePassword, onToggleNotifications }: SettingsProps) => {
    const [radius, setRadius] = useState('1km');
    const [notifications, setNotifications] = useState(true);

    const handleNotificationsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const enabled = e.target.checked;
        setNotifications(enabled);
        onToggleNotifications(enabled);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            <div className="flex items-center space-x-4 mb-8">
                <div className="p-3 bg-primary/10 rounded-lg">
                    <SettingsIcon size={24} className="text-primary" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Настройки</h2>
                    <p className="text-muted-foreground">Управление параметрами профиля</p>
                </div>
            </div>

            {settingsSections.map((section, index) => {
                const Icon = section.icon;
                return (
                    <motion.div
                        key={section.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-card hover:shadow-lg dark:hover:shadow-primary/5 rounded-lg p-6 transition-all duration-200"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Icon size={20} className="text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>
                                    <p className="text-sm text-muted-foreground">{section.description}</p>
                                </div>
                            </div>
                            {section.id === 'map' && (
                                <select
                                    value={radius}
                                    onChange={(e) => setRadius(e.target.value)}
                                    className="bg-background border border-input rounded-md px-3 py-1.5 text-sm"
                                >
                                    <option value="500m">500 метров</option>
                                    <option value="1km">1 километр</option>
                                    <option value="2km">2 километра</option>
                                </select>
                            )}
                            {section.id === 'notifications' && (
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-muted-foreground">
                                        {notifications ? 'Включены' : 'Выключены'}
                                    </span>
                                    <input
                                        type="checkbox"
                                        checked={notifications}
                                        onChange={handleNotificationsChange}
                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                </div>
                            )}
                            {section.id === 'security' && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={onChangePassword}
                                    className="group"
                                >
                                    Изменить
                                    <ChevronRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                                </Button>
                            )}
                        </div>
                    </motion.div>
                );
            })}

            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-card hover:shadow-lg dark:hover:shadow-primary/5 rounded-lg p-6 transition-all duration-200"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <SettingsIcon size={20} className="text-primary" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-foreground">Тема оформления</h3>
                            <p className="text-sm text-muted-foreground">Светлая или тёмная тема интерфейса</p>
                        </div>
                    </div>
                    <ThemeToggle />
                </div>
            </motion.div>
        </motion.div>
    );
}; 