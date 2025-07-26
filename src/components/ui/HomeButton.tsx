import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HomeButton = () => {
    return (
        <Link
            to="/"
            className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
        >
            <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            <span className="font-medium">На главную</span>
        </Link>
    );
}; 