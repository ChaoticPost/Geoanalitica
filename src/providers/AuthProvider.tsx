import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
    name: string;
    email: string;
    organization: string;
    phone?: string;
    position?: string;
    location?: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, phone: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'auth_state';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        const savedAuth = localStorage.getItem(STORAGE_KEY);
        if (savedAuth) {
            const { isAuthenticated } = JSON.parse(savedAuth);
            return isAuthenticated;
        }
        return false;
    });

    const [user, setUser] = useState<User | null>(() => {
        const savedAuth = localStorage.getItem(STORAGE_KEY);
        if (savedAuth) {
            const { user } = JSON.parse(savedAuth);
            return user;
        }
        return null;
    });

    const navigate = useNavigate();

    // Сохраняем состояние в localStorage при изменении
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ isAuthenticated, user }));
    }, [isAuthenticated, user]);

    const login = async (email: string, password: string) => {
        try {
            // Здесь будет реальный API запрос
            // Имитируем успешный вход
            const mockUser = {
                name: 'Тестовый Пользователь',
                email: email,
                organization: 'ООО Тест',
                phone: '+7 (999) 123-45-67',
                position: 'Менеджер по развитию',
                location: 'Москва'
            };

            setUser(mockUser);
            setIsAuthenticated(true);
            navigate('/profile');
        } catch (error) {
            console.error('Login error:', error);
            throw error;
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
                position: 'Пользователь',
                location: 'Не указано'
            };

            setUser(mockUser);
            setIsAuthenticated(true);
            navigate('/profile');
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem(STORAGE_KEY);
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