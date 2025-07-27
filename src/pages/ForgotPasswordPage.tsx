import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { EmailInput } from '../components/ui/EmailInput';
import { PasswordInput } from '../components/ui/PasswordInput';
import { Button } from '../components/ui/Button';
import { InlineNotification } from '../components/ui/InlineNotification';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Step = 'email' | 'verification' | 'new-password';

export const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [currentStep, setCurrentStep] = useState<Step>('email');
    const [verificationCode, setVerificationCode] = useState(['', '', '', '']);
    const [timer, setTimer] = useState(120); // 2 минуты
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState<string>();

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (showSuccess) {
            interval = setTimeout(() => {
                setShowSuccess(false);
                setCurrentStep('verification');
            }, 5000);
        }
        return () => clearTimeout(interval);
    }, [showSuccess]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (currentStep === 'verification' && timer > 0) {
            interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [currentStep, timer]);

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsSubmitting(true);
        try {
            // Здесь будет реальный API запрос
            await new Promise(resolve => setTimeout(resolve, 1000));
            setShowSuccess(true);
        } catch (error) {
            console.error('Password reset error:', error);
            setError('Произошла ошибка при отправке. Попробуйте позже.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCodeChange = (index: number, value: string) => {
        if (value.length > 1) value = value[0];
        if (!/^\d*$/.test(value)) return;

        const newCode = [...verificationCode];
        newCode[index] = value;
        setVerificationCode(newCode);

        // Автоматический переход к следующему полю
        if (value && index < 3) {
            const nextInput = document.getElementById(`code-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleVerificationSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const code = verificationCode.join('');
        if (code.length !== 4) return;

        setIsSubmitting(true);
        try {
            // Здесь будет реальный API запрос
            await new Promise(resolve => setTimeout(resolve, 1000));
            setCurrentStep('new-password');
        } catch (error) {
            console.error('Verification error:', error);
            setError('Неверный код подтверждения');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setPasswordError('Пароли не совпадают');
            return;
        }
        if (newPassword.length < 6) {
            setPasswordError('Пароль должен быть не менее 6 символов');
            return;
        }

        setIsSubmitting(true);
        try {
            // Здесь будет реальный API запрос
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Редирект на страницу входа после успешной смены пароля
            window.location.href = '/login';
        } catch (error) {
            console.error('Password change error:', error);
            setPasswordError('Произошла ошибка при смене пароля');
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <AuthLayout
            title="Смена пароля"
            subtitle="Введите email, указанный при регистрации"
        >
            <div className="w-full max-w-md space-y-8 px-4">
                <Link 
                    to="/login" 
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Вернуться к входу
                </Link>

                <AnimatePresence mode="wait">
                    {currentStep === 'email' && (
                        <motion.form
                            key="email-form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                            onSubmit={handleEmailSubmit}
                        >
                            <div className="space-y-4">
                                <EmailInput
                                    value={email}
                                    onChange={setEmail}
                                    error={error}
                                    onErrorChange={setError}
                                    placeholder="your@email.com"
                                />

                                {showSuccess && (
                                    <InlineNotification
                                        show={true}
                                        type="success"
                                        message="Инструкции по восстановлению пароля отправлены на ваш email"
                                    />
                                )}

                                {error && (
                                    <InlineNotification
                                        show={true}
                                        type="error"
                                        message={error}
                                        onClose={() => setError(undefined)}
                                    />
                                )}
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full"
                                disabled={isSubmitting || !email || Boolean(error)}
                            >
                                {isSubmitting ? 'Отправка...' : 'Отправить инструкции'}
                            </Button>
                        </motion.form>
                    )}

                    {currentStep === 'verification' && (
                        <motion.form
                            key="verification-form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                            onSubmit={handleVerificationSubmit}
                        >
                            <div className="space-y-4">
                                <div className="text-center text-sm text-muted-foreground mb-4">
                                    Введите код подтверждения, отправленный на {email}
                                </div>

                                <div className="flex justify-center gap-4">
                                    {verificationCode.map((digit, index) => (
                                        <input
                                            key={index}
                                            id={`code-${index}`}
                                            type="text"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleCodeChange(index, e.target.value)}
                                            className="w-12 h-12 text-center text-lg font-medium border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring focus:border-input transition-colors"
                                        />
                                    ))}
                                </div>

                                <div className="text-center text-sm text-muted-foreground">
                                    {timer > 0 ? (
                                        <span>Отправить код повторно через {formatTime(timer)}</span>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => setTimer(120)}
                                            className="text-primary hover:text-primary/90 transition-colors"
                                        >
                                            Отправить код повторно
                                        </button>
                                    )}
                                </div>

                                {error && (
                                    <InlineNotification
                                        show={true}
                                        type="error"
                                        message={error}
                                        onClose={() => setError(undefined)}
                                    />
                                )}
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full"
                                disabled={isSubmitting || verificationCode.some(digit => !digit)}
                            >
                                {isSubmitting ? 'Проверка...' : 'Подтвердить'}
                            </Button>
                        </motion.form>
                    )}

                    {currentStep === 'new-password' && (
                        <motion.form
                            key="password-form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                            onSubmit={handlePasswordSubmit}
                        >
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Новый пароль
                                    </label>
                                    <PasswordInput
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Подтвердите пароль
                                    </label>
                                    <PasswordInput
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>

                                {passwordError && (
                                    <InlineNotification
                                        show={true}
                                        type="error"
                                        message={passwordError}
                                        onClose={() => setPasswordError(undefined)}
                                    />
                                )}
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full"
                                disabled={isSubmitting || !newPassword || !confirmPassword}
                            >
                                {isSubmitting ? 'Сохранение...' : 'Сохранить новый пароль'}
                            </Button>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>
        </AuthLayout>
    );
}; 