
import React from 'react';
import { Room } from '@/types';
import { useRooms } from '@/contexts/RoomsContext';
import { useLocation } from '@/contexts/LocationContext';
import { useAuth } from '@/contexts/AuthContext';
import RoomDetails from './RoomDetails';

const SchoolMap: React.FC = () => {
  const { rooms, loadingRooms, selectRoom, selectedRoom } = useRooms();
  const { currentLocation, floor } = useLocation();
  const { currentUser } = useAuth();

  const filteredRooms = rooms.filter(room => room.floor === floor);
  
  if (loadingRooms) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg">Cargando mapa del colegio...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4">
      <div className="lg:w-2/3">
        <div className="border-4 border-gray-300 rounded-xl bg-gray-100 aspect-video overflow-hidden relative p-2">
          <div className="absolute top-2 left-2 bg-white/80 backdrop-blur-sm p-2 rounded-lg z-10 text-sm">
            {floor === 'planta_baja' ? 'Planta Baja' : 'Primer Piso'}
          </div>

          {/* Mapa del colegio */}
          <svg
            viewBox="0 0 500 300"
            className="w-full h-full bg-gray-50"
            style={{ overflow: 'visible' }}
          >
            {/* Dibujamos el contorno del edificio */}
            <rect x="0" y="0" width="500" height="300" fill="white" stroke="#333" strokeWidth="4" />
            
            {/* Pasillos */}
            <rect x="5" y="95" width="490" height="15" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="1" />
            <rect x="240" y="5" width="15" height="290" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="1" />
            
            {/* Habitaciones */}
            {filteredRooms.map((room) => (
              <g 
                key={room.id}
                onClick={() => selectRoom(room)}
                style={{ cursor: 'pointer' }}
              >
                <rect
                  x={room.position.x}
                  y={room.position.y}
                  width={room.position.width}
                  height={room.position.height}
                  fill={room.isClean ? '#F2FCE2' : '#fecaca'}
                  stroke={selectedRoom?.id === room.id ? '#000' : '#666'}
                  strokeWidth={selectedRoom?.id === room.id ? 3 : 1}
                  rx={4}
                />
                <text
                  x={room.position.x + room.position.width / 2}
                  y={room.position.y + room.position.height / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="14"
                  fontWeight={selectedRoom?.id === room.id ? 'bold' : 'normal'}
                  fill="#333"
                >
                  {room.name}
                </text>
                
                {/* Indicador de estado */}
                <circle
                  cx={room.position.x + 10}
                  cy={room.position.y + 10}
                  r={5}
                  fill={room.isClean ? '#22c55e' : '#ef4444'}
                />
              </g>
            ))}
            
            {/* Ubicación del alumno (punto azul) */}
            {currentLocation && currentLocation.floor === floor && (
              <circle
                cx={currentLocation.x}
                cy={currentLocation.y}
                r={8}
                fill="#3b82f6"
                className="animate-pulse"
              >
                <title>Tu ubicación actual</title>
              </circle>
            )}
          </svg>
          
          {/* Leyenda */}
          <div className="absolute bottom-2 right-2 bg-white/80 backdrop-blur p-2 rounded-lg flex gap-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-desinfectado rounded"></div>
              <span>Desinfectado</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-noDesinfectado rounded"></div>
              <span>No Desinfectado</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-ubicacion rounded-full"></div>
              <span>Tú estás aquí</span>
            </div>
          </div>
        </div>
        
        <p className="mt-4 text-center text-gray-500 italic">
          Toca cualquier habitación para ver más información
        </p>
      </div>
      
      {/* Panel lateral */}
      <div className="lg:w-1/3">
        <RoomDetails />
      </div>
    </div>
  );
};

export default SchoolMap;
