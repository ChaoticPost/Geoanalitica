import { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
    isAuthenticated: boolean;
    user: any; // Добавим тип пользователя позже
    login: (email: string, password: string) => void;
    register: (email: string, phone: string, password: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const login = async (email: string, password: string) => {
        try {
            // Здесь будет реальный API запрос
            // Имитируем успешный вход
            const mockUser = {
                name: 'Тестовый Пользователь',
                email: email,
                organization: 'ООО Тест',
            };

            setUser(mockUser);
            setIsAuthenticated(true);
            navigate('/profile'); // Перенаправляем на страницу профиля
        } catch (error) {
            console.error('Login error:', error);
            // Здесь можно добавить обработку ошибок
        }
    };

    const register = async (email: string, phone: string, password: string) => {
        try {
            // Здесь будет реальный API запрос
            // Имитируем успешную регистрацию
            const mockUser = {
                name: 'Новый Пользователь',
                email: email,
                phone: phone,
                organization: '',
            };

            setUser(mockUser);
            setIsAuthenticated(true);
            navigate('/profile'); // Перенаправляем на страницу профиля
        } catch (error) {
            console.error('Registration error:', error);
            // Здесь можно добавить обработку ошибок
        }
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 