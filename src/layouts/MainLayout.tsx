import { type ReactElement } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const MainLayout = (): ReactElement => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout; 