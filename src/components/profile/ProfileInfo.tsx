import { Button } from '../ui/Button';
import { Edit, Mail, Building2, Phone, MapPin, Calendar, User2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProfileInfoProps {
    name: string;
    email: string;
    organization: string;
    phone?: string;
    position?: string;
    location?: string;
    joinDate?: string;
    avatar?: string;
    onEdit: () => void;
}

export const ProfileInfo = ({
    name,
    email,
    organization,
    phone = '+7 (999) 123-45-67',
    position = 'Менеджер по развитию',
    location = 'Москва',
    joinDate = 'Январь 2024',
    avatar,
    onEdit
}: ProfileInfoProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            {/* Основная информация */}
            <div className="bg-card rounded-lg p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            {avatar ? (
                                <img
                                    src={avatar}
                                    alt={name}
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
                            <h2 className="text-2xl font-bold text-foreground">{name}</h2>
                            <p className="text-muted-foreground">{position}</p>
                            <div className="flex items-center space-x-2 mt-2">
                                <Building2 size={16} className="text-primary" />
                                <span className="text-sm text-foreground">{organization}</span>
                            </div>
                        </div>
                    </div>
                    <Button onClick={onEdit} variant="outline" className="group">
                        <Edit size={16} className="mr-2 transition-transform group-hover:scale-110" />
                        Редактировать
                    </Button>
                </div>

                {/* Контактная информация */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-4"
                    >
                        <h3 className="text-lg font-semibold text-foreground">Контактная информация</h3>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Mail size={16} className="text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="text-foreground">{email}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Phone size={16} className="text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Телефон</p>
                                    <p className="text-foreground">{phone}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <MapPin size={16} className="text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Локация</p>
                                    <p className="text-foreground">{location}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-4"
                    >
                        <h3 className="text-lg font-semibold text-foreground">Информация об аккаунте</h3>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Building2 size={16} className="text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Организация</p>
                                    <p className="text-foreground">{organization}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Calendar size={16} className="text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Дата регистрации</p>
                                    <p className="text-foreground">{joinDate}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Статистика */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
                <div className="bg-card rounded-lg p-4 hover:shadow-lg transition-all duration-200">
                    <h4 className="text-sm text-muted-foreground mb-1">Локаций создано</h4>
                    <p className="text-2xl font-bold text-foreground">12</p>
                </div>
                <div className="bg-card rounded-lg p-4 hover:shadow-lg transition-all duration-200">
                    <h4 className="text-sm text-muted-foreground mb-1">Отчётов сгенерировано</h4>
                    <p className="text-2xl font-bold text-foreground">48</p>
                </div>
                <div className="bg-card rounded-lg p-4 hover:shadow-lg transition-all duration-200">
                    <h4 className="text-sm text-muted-foreground mb-1">Дней в системе</h4>
                    <p className="text-2xl font-bold text-foreground">124</p>
                </div>
            </motion.div>
        </motion.div>
    );
}; 