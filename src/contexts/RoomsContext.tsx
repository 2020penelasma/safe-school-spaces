
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Room, CleaningRecord } from '@/types';
import { toast } from 'sonner';

interface RoomsContextType {
  rooms: Room[];
  cleaningHistory: CleaningRecord[];
  loadingRooms: boolean;
  markRoomAsClean: (roomId: string, cleanedBy: string) => void;
  markRoomAsNotClean: (roomId: string, reportedBy: string) => void;
  getRoomById: (roomId: string) => Room | undefined;
  getRoomHistory: (roomId: string) => CleaningRecord[];
  selectedRoom: Room | null;
  selectRoom: (room: Room | null) => void;
}

const RoomsContext = createContext<RoomsContextType | undefined>(undefined);

// Datos iniciales de prueba
const MOCK_ROOMS: Room[] = [
  // Planta Baja
  {
    id: 'pb-101',
    name: 'Aula 101',
    floor: 'planta_baja',
    isClean: true,
    lastCleanedAt: new Date().toISOString(),
    lastCleanedBy: 'María Limpieza',
    position: { x: 10, y: 10, width: 120, height: 80 }
  },
  {
    id: 'pb-102',
    name: 'Aula 102',
    floor: 'planta_baja',
    isClean: false,
    lastCleanedAt: null,
    lastCleanedBy: null,
    position: { x: 140, y: 10, width: 120, height: 80 }
  },
  {
    id: 'pb-103',
    name: 'Biblioteca',
    floor: 'planta_baja',
    isClean: true,
    lastCleanedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 horas atrás
    lastCleanedBy: 'María Limpieza',
    position: { x: 270, y: 10, width: 180, height: 80 }
  },
  {
    id: 'pb-104',
    name: 'Comedor',
    floor: 'planta_baja',
    isClean: true,
    lastCleanedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutos atrás
    lastCleanedBy: 'Carlos Limpieza',
    position: { x: 10, y: 100, width: 200, height: 120 }
  },
  {
    id: 'pb-105',
    name: 'Dirección',
    floor: 'planta_baja',
    isClean: true,
    lastCleanedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    lastCleanedBy: 'María Limpieza',
    position: { x: 220, y: 100, width: 140, height: 60 }
  },
  {
    id: 'pb-106',
    name: 'Sala de Profesores',
    floor: 'planta_baja',
    isClean: false,
    lastCleanedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    lastCleanedBy: 'Carlos Limpieza',
    position: { x: 370, y: 100, width: 110, height: 100 }
  },
  
  // Primer Piso
  {
    id: 'p1-201',
    name: 'Aula 201',
    floor: 'primer_piso',
    isClean: false,
    lastCleanedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    lastCleanedBy: 'María Limpieza',
    position: { x: 10, y: 10, width: 120, height: 80 }
  },
  {
    id: 'p1-202',
    name: 'Aula 202',
    floor: 'primer_piso',
    isClean: true,
    lastCleanedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    lastCleanedBy: 'María Limpieza',
    position: { x: 140, y: 10, width: 120, height: 80 }
  },
  {
    id: 'p1-203',
    name: 'Laboratorio',
    floor: 'primer_piso',
    isClean: true,
    lastCleanedAt: new Date().toISOString(),
    lastCleanedBy: 'Carlos Limpieza',
    position: { x: 270, y: 10, width: 180, height: 80 }
  },
  {
    id: 'p1-204',
    name: 'Sala de Informática',
    floor: 'primer_piso',
    isClean: false,
    lastCleanedAt: null,
    lastCleanedBy: null,
    position: { x: 10, y: 100, width: 200, height: 80 }
  },
  {
    id: 'p1-205',
    name: 'Aula 205',
    floor: 'primer_piso',
    isClean: true,
    lastCleanedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    lastCleanedBy: 'María Limpieza',
    position: { x: 220, y: 100, width: 140, height: 80 }
  },
  {
    id: 'p1-206',
    name: 'Sala de Arte',
    floor: 'primer_piso',
    isClean: true,
    lastCleanedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    lastCleanedBy: 'Carlos Limpieza',
    position: { x: 370, y: 100, width: 110, height: 80 }
  },
];

const generateCleaningHistory = (rooms: Room[]): CleaningRecord[] => {
  const history: CleaningRecord[] = [];
  
  rooms.forEach(room => {
    if (room.lastCleanedAt && room.lastCleanedBy) {
      // Registro actual
      history.push({
        id: `hist-${Date.now()}-${room.id}-1`,
        roomId: room.id,
        cleanedAt: room.lastCleanedAt,
        cleanedBy: room.lastCleanedBy,
        status: true
      });
      
      // Algunos registros históricos aleatorios
      const daysAgo = [2, 4, 7, 10];
      const cleaners = ['María Limpieza', 'Carlos Limpieza', 'Juana Limpieza'];
      
      daysAgo.forEach((days, index) => {
        const date = new Date();
        date.setDate(date.getDate() - days);
        
        history.push({
          id: `hist-${Date.now()}-${room.id}-${index + 2}`,
          roomId: room.id,
          cleanedAt: date.toISOString(),
          cleanedBy: cleaners[Math.floor(Math.random() * cleaners.length)],
          status: true
        });
      });
    }
  });
  
  return history;
};

export const RoomsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [cleaningHistory, setCleaningHistory] = useState<CleaningRecord[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setRooms(MOCK_ROOMS);
      setCleaningHistory(generateCleaningHistory(MOCK_ROOMS));
      setLoadingRooms(false);
    }, 800);
  }, []);

  const markRoomAsClean = (roomId: string, cleanedBy: string) => {
    const now = new Date();
    const timestamp = now.toISOString();
    
    // Actualizar el estado de la habitación
    setRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          isClean: true,
          lastCleanedAt: timestamp,
          lastCleanedBy: cleanedBy
        };
      }
      return room;
    }));
    
    // Agregar registro al historial
    const newRecord: CleaningRecord = {
      id: `hist-${Date.now()}-${roomId}`,
      roomId,
      cleanedAt: timestamp,
      cleanedBy,
      status: true
    };
    
    setCleaningHistory(prev => [newRecord, ...prev]);
    toast.success(`${roomId.split('-')[1].toUpperCase()} marcada como desinfectada`);
  };

  const markRoomAsNotClean = (roomId: string, reportedBy: string) => {
    const now = new Date();
    
    // Actualizar el estado de la habitación
    setRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          isClean: false
        };
      }
      return room;
    }));
    
    // Agregar registro al historial
    const newRecord: CleaningRecord = {
      id: `hist-${Date.now()}-${roomId}`,
      roomId,
      cleanedAt: now.toISOString(),
      cleanedBy: reportedBy,
      status: false
    };
    
    setCleaningHistory(prev => [newRecord, ...prev]);
    toast.error(`${roomId.split('-')[1].toUpperCase()} marcada como NO desinfectada`);
  };

  const getRoomById = (roomId: string) => {
    return rooms.find(room => room.id === roomId);
  };

  const getRoomHistory = (roomId: string) => {
    return cleaningHistory
      .filter(record => record.roomId === roomId)
      .sort((a, b) => new Date(b.cleanedAt).getTime() - new Date(a.cleanedAt).getTime());
  };

  const selectRoom = (room: Room | null) => {
    setSelectedRoom(room);
  };

  return (
    <RoomsContext.Provider value={{
      rooms,
      cleaningHistory,
      loadingRooms,
      markRoomAsClean,
      markRoomAsNotClean,
      getRoomById,
      getRoomHistory,
      selectedRoom,
      selectRoom
    }}>
      {children}
    </RoomsContext.Provider>
  );
};

export const useRooms = () => {
  const context = useContext(RoomsContext);
  if (context === undefined) {
    throw new Error('useRooms debe usarse dentro de un RoomsProvider');
  }
  return context;
};
