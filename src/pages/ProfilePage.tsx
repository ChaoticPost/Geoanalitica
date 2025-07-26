import { useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { ProfileSidebar } from '../components/profile/ProfileSidebar';
import { ProfileInfo } from '../components/profile/ProfileInfo';
import { LocationsList } from '../components/profile/LocationsList';
import { ReportsList } from '../components/profile/ReportsList';
import { SubscriptionInfo } from '../components/profile/SubscriptionInfo';
import { Settings } from '../components/profile/Settings';

// Демо-данные
const mockUser = {
    name: 'Иван Иванов',
    email: 'ivan@example.com',
    organization: 'ООО "Компания"',
    locations: [
        { id: 1, address: 'Москва, ул. Тверская, 1', createdAt: '2024-01-15' },
        { id: 2, address: 'Санкт-Петербург, Невский пр., 28', createdAt: '2024-01-10' },
    ],
    reports: [
        { id: 1, name: 'Отчет по локации #1', date: '2024-01-20', size: '2.5 MB' },
        { id: 2, name: 'Анализ конкурентов', date: '2024-01-18', size: '1.8 MB' },
    ],
    subscription: {
        plan: 'Бизнес',
        price: '4999 ₽/мес',
        nextPayment: '2024-02-15',
    }
};

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState('profile');

    const handleAction = (action: string, id?: number) => {
        console.log(`Action: ${action}`, id ? `ID: ${id}` : '');
    };

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Боковое меню */}
                    <ProfileSidebar
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        onLogout={() => handleAction('logout')}
                    />

                    {/* Основной контент */}
                    <div className="flex-1">
                        {activeTab === 'profile' && (
                            <ProfileInfo
                                name={mockUser.name}
                                email={mockUser.email}
                                organization={mockUser.organization}
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
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default ProfilePage; 