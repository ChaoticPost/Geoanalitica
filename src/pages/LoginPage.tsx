import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { EmailInput } from '../components/ui/EmailInput';
import { PasswordInput } from '../components/ui/PasswordInput';
import { Button } from '../components/ui/Button';
import { useAuth } from '../providers/AuthProvider';
import { InlineNotification } from '../components/ui/InlineNotification';

export const LoginPage = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showGoogleError, setShowGoogleError] = useState(false);

    // Используем useCallback для предотвращения создания новой функции при каждом рендере
    const handleEmailError = useCallback((error: string | undefined) => {
        setErrors(prev => ({ ...prev, email: error }));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Если есть ошибки, форма не отправляется
        if (errors.email || errors.password) {
            return;
        }

        setIsSubmitting(true);
        try {
            await login(email, password);
        } catch (error) {
            console.error('Login error:', error);
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
            title="Войти в аккаунт"
            subtitle="Введите данные для входа в систему"
        >
            <div className="w-full max-w-md space-y-8 px-4">
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <EmailInput
                            value={email}
                            onChange={setEmail}
                            error={errors.email}
                            onErrorChange={handleEmailError}
                        />

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                                Пароль
                            </label>
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

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-ring"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-foreground">
                                    Запомнить меня
                                </label>
                            </div>
                            <Link to="/forgot-password" className="text-sm text-primary hover:text-primary/90 transition-colors">
                                Забыли пароль?
                            </Link>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting || !email || !password || Boolean(errors.email) || Boolean(errors.password)}
                    >
                        {isSubmitting ? 'Вход...' : 'Войти'}
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