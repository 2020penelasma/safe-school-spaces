
export type UserRole = 'alumno' | 'limpieza';

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export interface Room {
  id: string;
  name: string;
  floor: 'planta_baja' | 'primer_piso';
  isClean: boolean;
  lastCleanedAt: string | null;
  lastCleanedBy: string | null;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface CleaningRecord {
  id: string;
  roomId: string;
  cleanedAt: string;
  cleanedBy: string;
  status: boolean;
}
