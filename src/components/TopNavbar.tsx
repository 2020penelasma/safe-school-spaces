
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from '@/contexts/LocationContext';

const TopNavbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { floor, setFloor } = useLocation();

  return (
    <div className="bg-primary py-2 px-4 text-primary-foreground flex justify-between items-center sticky top-0 z-10 shadow-md">
      <div className="flex items-center gap-x-2">
        <h1 className="text-lg font-bold">Mapa del Colegio</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          <Button
            variant={floor === 'planta_baja' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setFloor('planta_baja')}
            className="font-semibold"
          >
            Planta Baja
          </Button>
          <Button
            variant={floor === 'primer_piso' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setFloor('primer_piso')}
            className="font-semibold"
          >
            Primer Piso
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium hidden md:inline">
            {currentUser?.name} ({currentUser?.role === 'alumno' ? 'Alumno' : 'Personal'})
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={logout} 
            className="text-primary-foreground hover:text-primary-foreground hover:bg-red-700"
          >
            Salir
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
