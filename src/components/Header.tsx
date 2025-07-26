import { Button } from '@/components/ui/Button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import iconGeo from '@/assets/images/icons/icon_geo.png';

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const scrollToDemo = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const demoSection = document.getElementById('demo');
        if (demoSection) {
            demoSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className="fixed top-0 left-0 w-full bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <img src={iconGeo} alt="GeoAnalitica" className="h-8 w-8 mr-2" />
                        <Link to="/" className="text-red-500 text-xl font-bold">GeoAnalitica</Link>
                    </div>

                    {/* Desktop Navigation - Centered */}
                    <div className="hidden md:flex items-center justify-center flex-1 space-x-8 mx-8">
                        <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-white transition-colors">
                            Возможности
                        </a>
                        <a href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-white transition-colors">
                            Тарифы
                        </a>
                        <a href="#about" className="text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-white transition-colors">
                            О нас
                        </a>
                        <a href="#demo" onClick={scrollToDemo} className="text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-white transition-colors">
                            Демо
                        </a>
                    </div>

                    {/* Theme Toggle and CTA Button */}
                    <div className="hidden md:flex items-center space-x-4">
                        <ThemeToggle />
                        <Link to="/auth/login">
                            <Button variant="ghost" className="text-gray-600 dark:text-gray-300 hover:text-red-500 hover:bg-gray-200 dark:hover:text-white dark:hover:bg-gray-800">
                                Войти
                            </Button>
                        </Link>
                        <Link to="/auth/register">
                            <Button variant="default" className="bg-red-500 hover:bg-red-600 text-white">
                                Регистрация
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center space-x-2">
                        <ThemeToggle />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white dark:bg-black">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <a
                                href="#features"
                                className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-white transition-colors"
                            >
                                Возможности
                            </a>
                            <a
                                href="#pricing"
                                className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-white transition-colors"
                            >
                                Тарифы
                            </a>
                            <a
                                href="#about"
                                className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-white transition-colors"
                            >
                                О нас
                            </a>
                            <a
                                href="#demo"
                                onClick={scrollToDemo}
                                className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-white transition-colors"
                            >
                                Демо
                            </a>
                            <div className="px-3 py-2">
                                <Link to="/auth/login" className="block w-full mb-2">
                                    <Button variant="ghost" className="w-full text-gray-600 dark:text-gray-300 hover:text-red-500 hover:bg-gray-200 dark:hover:text-white dark:hover:bg-gray-800">
                                        Войти
                                    </Button>
                                </Link>
                                <Link to="/auth/register" className="block w-full">
                                    <Button variant="default" className="w-full bg-red-500 hover:bg-red-600 text-white">
                                        Регистрация
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}; 