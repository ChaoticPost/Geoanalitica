import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HomeButton = () => {
    return (
        <Link
            to="/"
            className="hidden md:flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors group"
        >
            <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            <span className="font-medium">На главную</span>
        </Link>
    );
}; 