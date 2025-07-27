import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { EmailInput } from '../components/ui/EmailInput';
import { PhoneInput } from '../components/ui/PhoneInput';
import { PasswordInput } from '../components/ui/PasswordInput';
import { Button } from '../components/ui/Button';
import { useAuth } from '../providers/AuthProvider';
import { InlineNotification } from '../components/ui/InlineNotification';

export const RegisterPage = () => {
    const { register } = useAuth();
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string; phone?: string; password?: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showGoogleError, setShowGoogleError] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Если есть ошибки, форма не отправляется
        if (errors.email || errors.phone || errors.password || !email || !phone || !password) {
            return;
        }

        setIsSubmitting(true);
        try {
            await register(email, phone, password);
        } catch (error) {
            console.error('Registration error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleLogin = () => {
        setShowGoogleError(true);
        // Автоматически скрываем уведомление через 5 секунд
        setTimeout(() => setShowGoogleError(false), 5000);
    };

    return (
        <AuthLayout
            title="Создайте аккаунт"
            subtitle="Зарегистрируйтесь, чтобы получить доступ к полному функционалу платформы"
        >
            <div className="w-full max-w-md space-y-8 px-4">
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <EmailInput
                            value={email}
                            onChange={setEmail}
                            error={errors.email}
                            onErrorChange={(error) =>
                                setErrors(prev => ({ ...prev, email: error }))
                            }
                        />

                        <PhoneInput
                            value={phone}
                            onChange={setPhone}
                            error={errors.phone}
                            onErrorChange={(error) =>
                                setErrors(prev => ({ ...prev, phone: error }))
                            }
                        />

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label htmlFor="password" className="block text-sm font-medium text-foreground">
                                    Пароль
                                </label>
                                <Link to="/forgot-password" className="text-sm text-primary hover:text-primary/90 transition-colors">
                                    Забыли пароль?
                                </Link>
                            </div>
                            <PasswordInput
                                id="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (errors.password) {
                                        setErrors(prev => ({ ...prev, password: undefined }));
                                    }
                                }}
                                error={errors.password}
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-destructive">{errors.password}</p>
                            )}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting || !email || !phone || !password || Boolean(errors.email) || Boolean(errors.phone) || Boolean(errors.password)}
                    >
                        {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
                    </Button>

                    <div className="relative">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2 bg-background/50 backdrop-blur-sm border-input"
                            onClick={handleGoogleLogin}
                            disabled={showGoogleError}
                        >
                            <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
                            Войти через Google
                        </Button>
                        <InlineNotification
                            show={showGoogleError}
                            message="Вход через Google временно недоступен"
                            onClose={() => setShowGoogleError(false)}
                            overlay
                        />
                    </div>
                </form>
            </div>
        </AuthLayout>
    );
};