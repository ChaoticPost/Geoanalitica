import { Link, Outlet, useLocation } from 'react-router-dom'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { HomeButton } from '@/components/ui/HomeButton'

export const AuthLayout = () => {
    const location = useLocation()
    const isLoginPage = location.pathname === '/login'

    const title = isLoginPage ? 'Войти в аккаунт' : 'Регистрация'
    const subtitle = isLoginPage
        ? 'Добро пожаловать обратно'
        : 'Создайте аккаунт для доступа к аналитике'

    return (
        <div className="min-h-screen w-full flex flex-col md:flex-row bg-white dark:bg-[#121212]">
            {/* Left Panel */}
            <div className="relative w-full md:w-1/2 flex flex-col p-8 md:p-12">
                {/* Header with Navigation */}
                <div className="flex justify-between items-center">
                    <HomeButton />
                    <ThemeToggle />
                </div>

                {/* Logo and Title */}
                <div className="flex-1 flex flex-col justify-start items-center md:items-start text-center md:text-left mt-12 md:mt-20">
                    <div className="mb-6">
                        <img
                            src="/icon_geo.png"
                            alt="GeoAnalitica"
                            className="h-12 w-auto"
                        />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            {subtitle}
                        </p>
                    )}
                </div>

                {/* Bottom Text */}
                <div className="mt-auto text-center md:text-left">
                    <p className="text-gray-600 dark:text-gray-400">
                        {isLoginPage ? (
                            <>
                                Нет аккаунта?{' '}
                                <Link
                                    to="/register"
                                    className="font-medium text-[#EF3124] hover:underline"
                                >
                                    Зарегистрироваться
                                </Link>
                            </>
                        ) : (
                            <>
                                Уже есть аккаунт?{' '}
                                <Link
                                    to="/login"
                                    className="font-medium text-[#EF3124] hover:underline"
                                >
                                    Войти
                                </Link>
                            </>
                        )}
                    </p>
                </div>
            </div>

            {/* Right Panel - Auth Form */}
            <div className="w-full md:w-1/2 flex flex-col justify-center p-6 md:p-12 bg-gray-50 dark:bg-neutral-900">
                <div className="max-w-md w-full mx-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default AuthLayout 