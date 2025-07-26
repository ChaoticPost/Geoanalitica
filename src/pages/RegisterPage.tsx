import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { Input } from '../components/ui/Input';
import { PasswordInput } from '../components/ui/PasswordInput';
import { Button } from '../components/ui/Button';
import { useAuth } from '../providers/AuthProvider';

export const RegisterPage = () => {
    const { register } = useAuth();
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        register(email, phone, password);
    };

    return (
        <AuthLayout
            title="Создайте аккаунт"
            subtitle="Зарегистрируйтесь, чтобы получить доступ к полному функционалу платформы"
        >
            <div className="w-full max-w-md space-y-8 px-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Создать аккаунт
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Уже есть аккаунт?{' '}
                        <Link to="/login" className="text-primary hover:text-primary/90">
                            Войти
                        </Link>
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                                Email
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="example@mail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                                Телефон
                            </label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="+7 (999) 999-99-99"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                                Пароль
                            </label>
                            <PasswordInput
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full">
                        Зарегистрироваться
                    </Button>
                </form>
            </div>
        </AuthLayout>
    );
};