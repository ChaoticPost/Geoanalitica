import { useState } from 'react';
import { Button } from '../ui/Button';
import { ThemeToggle } from '../ui/ThemeToggle';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Bell, Map, Lock, ChevronRight, User2, Mail, Building2, Phone, MapPin, Calendar, Edit } from 'lucide-react';

interface SettingsProps {
    onChangePassword: () => void;
    onToggleNotifications: (enabled: boolean) => void;
    user: {
        name: string;
        email: string;
        organization: string;
        phone: string;
        position: string;
        location: string;
        joinDate: string;
        avatar?: string;
    };
    onEditProfile: () => void;
}

const settingsSections = [
    {
        id: 'personal',
        title: 'Личные данные',
        icon: User2,
        description: 'Управление личной информацией'
    },
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

export const Settings = ({ onChangePassword, onToggleNotifications, user, onEditProfile }: SettingsProps) => {
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

            {/* Личные данные */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-card hover:shadow-lg dark:hover:shadow-primary/5 rounded-lg p-6 transition-all duration-200"
            >
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            {user.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-20 h-20 rounded-full object-cover border-2 border-primary/20"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                                    <User2 size={32} className="text-primary" />
                                </div>
                            )}
                            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
                            <p className="text-muted-foreground">{user.position}</p>
                            <div className="flex items-center space-x-2 mt-2">
                                <Building2 size={16} className="text-primary" />
                                <span className="text-sm text-foreground">{user.organization}</span>
                            </div>
                        </div>
                    </div>
                    <Button onClick={onEditProfile} variant="outline" className="group">
                        <Edit size={16} className="mr-2 transition-transform group-hover:scale-110" />
                        Редактировать
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground">Контактная информация</h3>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Mail size={16} className="text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="text-foreground">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Phone size={16} className="text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Телефон</p>
                                    <p className="text-foreground">{user.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <MapPin size={16} className="text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Локация</p>
                                    <p className="text-foreground">{user.location}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground">Информация об аккаунте</h3>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Building2 size={16} className="text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Организация</p>
                                    <p className="text-foreground">{user.organization}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Calendar size={16} className="text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Дата регистрации</p>
                                    <p className="text-foreground">{user.joinDate}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Остальные настройки */}
            {settingsSections.slice(1).map((section, index) => {
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

            {/* Тема оформления */}
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