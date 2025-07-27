import { type ReactElement, type ReactNode } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps): ReactElement => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}; 