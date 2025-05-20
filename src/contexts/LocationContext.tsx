
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Location {
  x: number;
  y: number;
  floor: 'planta_baja' | 'primer_piso';
}

interface LocationContextType {
  currentLocation: Location | null;
  floor: 'planta_baja' | 'primer_piso';
  setFloor: (floor: 'planta_baja' | 'primer_piso') => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [floor, setFloor] = useState<'planta_baja' | 'primer_piso'>('planta_baja');

  useEffect(() => {
    // Simulamos movimiento del usuario en el mapa
    const interval = setInterval(() => {
      if (floor === 'planta_baja') {
        setCurrentLocation({
          x: 50 + Math.random() * 350,
          y: 50 + Math.random() * 150,
          floor: 'planta_baja'
        });
      } else {
        setCurrentLocation({
          x: 50 + Math.random() * 350,
          y: 50 + Math.random() * 150,
          floor: 'primer_piso'
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [floor]);

  return (
    <LocationContext.Provider value={{ currentLocation, floor, setFloor }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation debe usarse dentro de un LocationProvider');
  }
  return context;
};
