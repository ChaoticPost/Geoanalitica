import { useState } from 'react';
import { Bell, CreditCard, FileText, Home, Key, LogOut, MapPin, Settings, User, Shield } from 'lucide-react';
import { useAuth } from '../providers/AuthProvider';
import { Link } from 'react-router-dom';

const MENU_ITEMS = [
    { id: 'profile', icon: User, label: 'Личные данные' },
    { id: 'locations', icon: MapPin, label: 'Мои локации' },
    { id: 'reports', icon: FileText, label: 'Отчеты' },
    { id: 'security', icon: Shield, label: 'Безопасность' },
    { id: 'notifications', icon: Bell, label: 'Уведомления' },
    { id: 'billing', icon: CreditCard, label: 'Оплата' },
    { id: 'settings', icon: Settings, label: 'Настройки' },
];

export const ProfilePage = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <div className="min-h-screen bg-background">
            <div className="flex h-full">
                {/* Боковая панель */}
                <div className="w-64 bg-card border-r border-border h-screen fixed">
                    <div className="p-6">
                        <div className="flex items-center space-x-4 mb-8">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-lg font-semibold text-primary">
                                    {user?.name?.[0]?.toUpperCase() || 'U'}
                                </span>
                            </div>
                            <div>
                                <h2 className="font-semibold text-foreground">{user?.name || 'Пользователь'}</h2>
                                <p className="text-sm text-muted-foreground">{user?.email}</p>
                            </div>
                        </div>

                        <nav className="space-y-1">
                            <Link
                                to="/"
                                className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-foreground hover:bg-accent transition-colors mb-4"
                            >
                                <Home className="w-5 h-5" />
                                <span>На главную</span>
                            </Link>

                            <div className="h-px bg-border my-2" />

                            {MENU_ITEMS.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${activeTab === item.id
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-foreground hover:bg-accent'
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="absolute bottom-0 w-full p-4 border-t border-border">
                        <button
                            onClick={logout}
                            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Выйти</span>
                        </button>
                    </div>
                </div>

                {/* Основной контент */}
                <div className="flex-1 ml-64">
                    <div className="max-w-4xl mx-auto p-8">
                        {activeTab === 'profile' && (
                            <div className="space-y-8">
                                <div>
                                    <h1 className="text-2xl font-semibold text-foreground mb-6">Личные данные</h1>
                                    <div className="grid gap-6 max-w-2xl">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">Имя</label>
                                            <input
                                                type="text"
                                                value={user?.name}
                                                className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">Email</label>
                                            <input
                                                type="email"
                                                value={user?.email}
                                                className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">Организация</label>
                                            <input
                                                type="text"
                                                value={user?.organization}
                                                className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
                                            />
                                        </div>
                                        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                                            Сохранить изменения
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-xl font-semibold text-foreground mb-4">Подключенные сервисы</h2>
                                    <div className="grid gap-4">
                                        <div className="flex items-center justify-between p-4 rounded-lg border border-input bg-card">
                                            <div className="flex items-center space-x-4">
                                                <img src="/google-icon.svg" alt="Google" className="w-6 h-6" />
                                                <div>
                                                    <p className="font-medium text-foreground">Google</p>
                                                    <p className="text-sm text-muted-foreground">Подключено</p>
                                                </div>
                                            </div>
                                            <button className="text-sm text-destructive hover:text-destructive/80">
                                                Отключить
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-8">
                                <div>
                                    <h1 className="text-2xl font-semibold text-foreground mb-6">Безопасность</h1>
                                    <div className="max-w-2xl space-y-6">
                                        <div className="p-4 rounded-lg border border-input bg-card">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <Key className="w-5 h-5 text-foreground" />
                                                    <h3 className="font-medium text-foreground">Пароль</h3>
                                                </div>
                                                <button className="text-primary hover:text-primary/80">
                                                    Изменить
                                                </button>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Последнее изменение: 15 дней назад
                                            </p>
                                        </div>

                                        <div className="p-4 rounded-lg border border-input bg-card">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <Shield className="w-5 h-5 text-foreground" />
                                                    <h3 className="font-medium text-foreground">Двухфакторная аутентификация</h3>
                                                </div>
                                                <button className="text-primary hover:text-primary/80">
                                                    Настроить
                                                </button>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Рекомендуется включить для повышения безопасности
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'locations' && (
                            <div className="space-y-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h1 className="text-2xl font-semibold text-foreground">Мои локации</h1>
                                    <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                                        Добавить локацию
                                    </button>
                                </div>
                                <div className="grid gap-4">
                                    {user?.locations?.map((location: any) => (
                                        <div key={location.id} className="p-4 rounded-lg border border-input bg-card">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium text-foreground">{location.address}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Добавлено: {new Date(location.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button className="text-primary hover:text-primary/80">
                                                        Открыть
                                                    </button>
                                                    <button className="text-destructive hover:text-destructive/80">
                                                        Удалить
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'reports' && (
                            <div className="space-y-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h1 className="text-2xl font-semibold text-foreground">Отчеты</h1>
                                    <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                                        Создать отчет
                                    </button>
                                </div>
                                <div className="grid gap-4">
                                    {user?.reports?.map((report: any) => (
                                        <div key={report.id} className="p-4 rounded-lg border border-input bg-card">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium text-foreground">{report.name}</p>
                                                    <div className="flex space-x-4 text-sm text-muted-foreground">
                                                        <p>Дата: {new Date(report.date).toLocaleDateString()}</p>
                                                        <p>Размер: {report.size}</p>
                                                    </div>
                                                </div>
                                                <button className="text-primary hover:text-primary/80">
                                                    Скачать
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'billing' && (
                            <div className="space-y-8">
                                <h1 className="text-2xl font-semibold text-foreground mb-6">Оплата</h1>
                                <div className="max-w-2xl">
                                    <div className="p-6 rounded-lg border border-input bg-card mb-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h3 className="text-lg font-medium text-foreground">Текущий тариф: Бизнес</h3>
                                                <p className="text-sm text-muted-foreground">4999 ₽/месяц</p>
                                            </div>
                                            <button className="text-primary hover:text-primary/80">
                                                Изменить тариф
                                            </button>
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Следующее списание: 15 февраля 2024
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium text-foreground">История платежей</h3>
                                        <div className="space-y-2">
                                            {[
                                                { date: '15.01.2024', amount: '4999 ₽', status: 'Оплачено' },
                                                { date: '15.12.2023', amount: '4999 ₽', status: 'Оплачено' },
                                            ].map((payment, index) => (
                                                <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-input">
                                                    <div className="flex space-x-4">
                                                        <span className="text-foreground">{payment.date}</span>
                                                        <span className="text-foreground">{payment.amount}</span>
                                                    </div>
                                                    <span className="text-success">{payment.status}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}; 