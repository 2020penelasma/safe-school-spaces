
import React from 'react';
import TopNavbar from '@/components/TopNavbar';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/LoginForm';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4">Cargando aplicación...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <LoginForm />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TopNavbar />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
};

export default Layout;
