import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ProfileSidebar } from '../components/profile/ProfileSidebar';
import { ProfileInfo } from '../components/profile/ProfileInfo';
import { LocationsList } from '../components/profile/LocationsList';
import { ReportsList } from '../components/profile/ReportsList';
import { Settings } from '../components/profile/Settings';
import { SubscriptionInfo } from '../components/profile/SubscriptionInfo';
import { Home } from 'lucide-react';
import { motion } from 'framer-motion';

// Демо-данные
const mockUser = {
    name: 'Иван Иванов',
    email: 'ivan@example.com',
    organization: 'ООО "Компания"',
    phone: '+7 (999) 123-45-67',
    position: 'Менеджер по развитию',
    location: 'Москва',
    joinDate: 'Январь 2024',
    locations: [
        { id: 1, address: 'Москва, ул. Тверская, 1', createdAt: '15 января 2024' },
        { id: 2, address: 'Санкт-Петербург, Невский пр., 28', createdAt: '10 января 2024' },
    ],
    reports: [
        { id: 1, name: 'Отчет по локации #1', date: '20 января 2024', size: '2.5 MB' },
        { id: 2, name: 'Анализ конкурентов', date: '18 января 2024', size: '1.8 MB' },
    ],
    subscription: {
        plan: 'Бизнес',
        price: '4999 ₽/мес',
        nextPayment: '15 февраля 2024',
    },
    stats: {
        locationsCount: 12,
        reportsCount: 48,
        daysInSystem: 124
    }
};

export const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState('profile');

    const handleAction = (action: string, id?: number) => {
        console.log(`Action: ${action}`, id ? `ID: ${id}` : '');
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Верхняя панель */}
            <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link
                            to="/"
                            className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Home className="w-4 h-4 mr-2" />
                            На главную
                        </Link>
                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-muted-foreground">
                                Последний вход: сегодня в 12:45
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Боковое меню */}
                    <div className="lg:w-64 flex-shrink-0">
                        <div className="sticky top-24">
                            <ProfileSidebar
                                activeTab={activeTab}
                                onTabChange={setActiveTab}
                                onLogout={() => handleAction('logout')}
                            />
                        </div>
                    </div>

                    {/* Основной контент */}
                    <motion.div
                        className="flex-1 min-w-0"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeTab === 'profile' && (
                            <ProfileInfo
                                name={mockUser.name}
                                email={mockUser.email}
                                organization={mockUser.organization}
                                phone={mockUser.phone}
                                position={mockUser.position}
                                location={mockUser.location}
                                joinDate={mockUser.joinDate}
                                onEdit={() => handleAction('edit-profile')}
                            />
                        )}

                        {activeTab === 'locations' && (
                            <LocationsList
                                locations={mockUser.locations}
                                onAdd={() => handleAction('add-location')}
                                onOpen={(id) => handleAction('open-location', id)}
                                onDelete={(id) => handleAction('delete-location', id)}
                            />
                        )}

                        {activeTab === 'reports' && (
                            <ReportsList
                                reports={mockUser.reports}
                                onGenerate={() => handleAction('generate-report')}
                                onDownload={(id) => handleAction('download-report', id)}
                            />
                        )}

                        {activeTab === 'subscription' && (
                            <SubscriptionInfo
                                subscription={mockUser.subscription}
                                onChangePlan={() => handleAction('change-plan')}
                            />
                        )}

                        {activeTab === 'settings' && (
                            <Settings
                                onChangePassword={() => handleAction('change-password')}
                                onToggleNotifications={(enabled) => handleAction('toggle-notifications', enabled ? 1 : 0)}
                            />
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Нижняя панель с быстрыми действиями */}
            <div className="fixed bottom-0 inset-x-0 bg-card/50 backdrop-blur-sm border-t border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <div className="text-sm">
                                <span className="text-muted-foreground">Тариф: </span>
                                <span className="font-medium text-foreground">{mockUser.subscription.plan}</span>
                            </div>
                            <div className="text-sm">
                                <span className="text-muted-foreground">Локаций: </span>
                                <span className="font-medium text-foreground">{mockUser.stats.locationsCount}</span>
                            </div>
                            <div className="text-sm">
                                <span className="text-muted-foreground">Отчетов: </span>
                                <span className="font-medium text-foreground">{mockUser.stats.reportsCount}</span>
                            </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            © 2024 Геоаналитика
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 