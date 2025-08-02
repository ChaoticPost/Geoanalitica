import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { ProfileSidebar } from '../components/profile/ProfileSidebar';
import { LocationsList } from '../components/profile/LocationsList';
import { ReportsList } from '../components/profile/ReportsList';
import { Settings } from '../components/profile/Settings';
import { SubscriptionInfo } from '../components/profile/SubscriptionInfo';
import { motion } from 'framer-motion';

const mockUser = {
    name: 'Чугунова Дарья',
    email: 'dariachugunova2003@gmail.com',
    organization: 'ООО "Инновации"',
    phone: '+7 (999) 123-45-67',
    position: 'Менеджер по развитию',
    location: 'Москва',
    joinDate: 'Июль 2025'
};

const mockLocations = [
    { id: 1, address: 'Москва, ул. Тверская, 1', createdAt: '15 июля 2025' },
    { id: 2, address: 'Москва, ул. Зорге, 5', createdAt: '10 июля 2025' }
];

const mockReports = [
    { id: 1, name: 'Отчет по локации #1', date: '15.07.2025', size: '2.4 MB' },
    { id: 2, name: 'Отчет по локации #2', date: '10.07.2025', size: '1.8 MB' }
];

const mockSubscription = {
    plan: 'Бета',
    price: '0 ₽/мес',
    nextPayment: '15 августа 2025'
};

export const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState('locations');
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleEditProfile = () => {
        // Implement edit profile logic
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'locations':
                return (
                    <LocationsList
                        locations={mockLocations}
                        onAdd={() => { }}
                        onOpen={() => { }}
                        onDelete={() => { }}
                    />
                );
            case 'reports':
                return (
                    <ReportsList
                        reports={mockReports}
                        onGenerate={() => { }}
                        onDownload={() => { }}
                    />
                );
            case 'subscription':
                return (
                    <SubscriptionInfo
                        subscription={mockSubscription}
                        onChangePlan={() => { }}
                    />
                );
            case 'settings':
                return (
                    <Settings
                        user={mockUser}
                        onEditProfile={handleEditProfile}
                        onChangePassword={() => { }}
                        onToggleNotifications={() => { }}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <ProfileSidebar
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        onLogout={handleLogout}
                    />
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="flex-1"
                    >
                        {renderContent()}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}; 