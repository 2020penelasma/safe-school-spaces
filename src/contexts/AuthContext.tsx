
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { toast } from 'sonner';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuarios de prueba
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Juan Alumno',
    role: 'alumno'
  },
  {
    id: '2',
    name: 'María Limpieza',
    role: 'limpieza'
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar si hay un usuario en localStorage al cargar
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    // En una implementación real, esto sería una llamada a un API
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulamos una verificación simple
        const user = MOCK_USERS.find(u => {
          if (u.role === 'alumno' && username.toLowerCase().includes('alumno')) {
            return true;
          }
          if (u.role === 'limpieza' && username.toLowerCase().includes('limpieza') && password === '1234') {
            return true;
          }
          return false;
        });

        if (user) {
          setCurrentUser(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
          toast.success(`Bienvenido/a, ${user.name}`);
          resolve(true);
        } else {
          toast.error('Credenciales inválidas');
          resolve(false);
        }
        setLoading(false);
      }, 500);
    });
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    toast.info('Has cerrado sesión');
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
