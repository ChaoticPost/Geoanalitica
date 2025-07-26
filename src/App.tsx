import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './providers/ThemeProvider';
import { AuthProvider } from './providers/AuthProvider';
import { MainLayout } from './layouts/MainLayout';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ContactPage } from './pages/ContactPage';
import { AboutPage } from './pages/AboutPage';
import ProfilePage from './pages/ProfilePage';
import { useAuth } from './providers/AuthProvider';

// Компонент для защищенных маршрутов
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" />;
};

// Компонент для публичных маршрутов (доступных только неавторизованным)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuth();
    return !isAuthenticated ? children : <Navigate to="/" />;
};

const AppRoutes = () => {
    // Получаем начальный путь из localStorage
    const initialPath = localStorage.getItem('initialPath');
    if (initialPath) {
        localStorage.removeItem('initialPath');
    }

    return (
        <Routes>
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

            {/* Защищенные маршруты */}
            <Route path="/" element={
                <ProtectedRoute>
                    <MainLayout>
                        <HomePage />
                    </MainLayout>
                </ProtectedRoute>
            } />
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

            {/* Редирект на начальный путь или на главную */}
            <Route path="*" element={<Navigate to={initialPath || '/'} replace />} />
        </Routes>
    );
};

export const App = () => {
    return (
        <Router>
            <ThemeProvider>
                <AuthProvider>
                    <AppRoutes />
                </AuthProvider>
            </ThemeProvider>
        </Router>
    );
}; 