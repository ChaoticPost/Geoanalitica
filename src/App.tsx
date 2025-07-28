import { type ReactElement, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './providers/ThemeProvider';
import { AuthProvider } from './providers/AuthProvider';
import { MainLayout } from './layouts/MainLayout';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ContactPage } from './pages/ContactPage';
import { AboutPage } from './pages/AboutPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { useAuth } from './providers/AuthProvider';
import { Toaster } from 'react-hot-toast';

// Компонент для защищенных маршрутов
const ProtectedRoute = ({ children }: { children: React.ReactNode }): ReactElement => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    // Если пользователь не авторизован, сохраняем текущий путь и редиректим на логин
    if (!isAuthenticated) {
        localStorage.setItem('redirectPath', location.pathname);
        return <Navigate to="/login" />;
    }

    return <>{children}</>;
};

// Компонент для публичных маршрутов (доступных только неавторизованным)
const PublicRoute = ({ children }: { children: React.ReactNode }): ReactElement => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    // Если пользователь авторизован, проверяем сохраненный путь для редиректа
    if (isAuthenticated) {
        const redirectPath = localStorage.getItem('redirectPath') || '/profile';
        localStorage.removeItem('redirectPath'); // Очищаем сохраненный путь
        return <Navigate to={redirectPath} />;
    }

    return <>{children}</>;
};

const AppRoutes = (): ReactElement => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    // Эффект для обработки начального редиректа
    useEffect(() => {
        if (isAuthenticated && location.pathname === '/') {
            const redirectPath = localStorage.getItem('redirectPath');
            if (redirectPath) {
                localStorage.removeItem('redirectPath');
            }
        }
    }, [isAuthenticated, location]);

    return (
        <Routes>
            {/* Публичная главная страница */}
            <Route path="/" element={
                <MainLayout>
                    <HomePage />
                </MainLayout>
            } />

            {/* Публичные маршруты (только для неавторизованных) */}
            <Route path="/login" element={
                <PublicRoute>
                    <LoginPage />
                </PublicRoute>
            } />
            <Route path="/register" element={
                <PublicRoute>
                    <RegisterPage />
                </PublicRoute>
            } />
            <Route path="/forgot-password" element={
                <PublicRoute>
                    <ForgotPasswordPage />
                </PublicRoute>
            } />

            {/* Защищенные маршруты */}
            <Route path="/profile" element={
                <ProtectedRoute>
                    <ProfilePage />
                </ProtectedRoute>
            } />
            <Route path="/about" element={
                <ProtectedRoute>
                    <MainLayout>
                        <AboutPage />
                    </MainLayout>
                </ProtectedRoute>
            } />
            <Route path="/contact" element={
                <ProtectedRoute>
                    <MainLayout>
                        <ContactPage />
                    </MainLayout>
                </ProtectedRoute>
            } />

            {/* 404 страница */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export const App = (): ReactElement => {
    return (
        <ThemeProvider>
            <AuthProvider>
                <AppRoutes />
                <Toaster
                    position="top-center"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: '#1E1E1E',
                            color: '#fff',
                            borderRadius: '12px',
                        },
                    }}
                />
            </AuthProvider>
        </ThemeProvider>
    );
}; 