
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRooms } from '@/contexts/RoomsContext';
import { useAuth } from '@/contexts/AuthContext';
import { format, formatDistance } from 'date-fns';
import { es } from 'date-fns/locale';

const RoomDetails: React.FC = () => {
  const { selectedRoom, selectRoom, getRoomHistory, markRoomAsClean, markRoomAsNotClean } = useRooms();
  const { currentUser } = useAuth();
  
  if (!selectedRoom) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">Selecciona una habitación en el mapa para ver sus detalles</p>
        </CardContent>
      </Card>
    );
  }
  
  const roomHistory = getRoomHistory(selectedRoom.id);
  
  const handleClean = () => {
    if (currentUser) {
      markRoomAsClean(selectedRoom.id, currentUser.name);
    }
  };
  
  const handleMarkDirty = () => {
    if (currentUser) {
      markRoomAsNotClean(selectedRoom.id, currentUser.name);
    }
  };

  const getLastCleanedText = () => {
    if (!selectedRoom.lastCleanedAt) {
      return "No hay registros de limpieza";
    }
    
    const lastCleanedDate = new Date(selectedRoom.lastCleanedAt);
    const timeAgo = formatDistance(lastCleanedDate, new Date(), { 
      addSuffix: true,
      locale: es
    });
    
    return `Última desinfección ${timeAgo}`;
  };
  
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{selectedRoom.name}</CardTitle>
            <CardDescription>{`${selectedRoom.floor === 'planta_baja' ? 'Planta Baja' : 'Primer Piso'} - ${selectedRoom.id.split('-')[1].toUpperCase()}`}</CardDescription>
          </div>
          <Badge className={selectedRoom.isClean ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-red-100 text-red-800 hover:bg-red-200"}>
            {selectedRoom.isClean ? "Desinfectada" : "No Desinfectada"}
          </Badge>
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          {getLastCleanedText()}
          {selectedRoom.lastCleanedBy && (
            <p>Por: {selectedRoom.lastCleanedBy}</p>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Historial de desinfección</h3>
          
          {roomHistory.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
              {roomHistory.map((record) => (
                <div 
                  key={record.id} 
                  className="text-sm p-2 rounded border border-gray-200 bg-gray-50"
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{format(new Date(record.cleanedAt), 'dd/MM/yyyy HH:mm')}</span>
                    <Badge variant={record.status ? "outline" : "destructive"} className="text-xs">
                      {record.status ? "Desinfectada" : "Marcada como sucia"}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">Por: {record.cleanedBy}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No hay registros de desinfección</p>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <Button 
          variant="outline" 
          onClick={() => selectRoom(null)}
        >
          Cerrar
        </Button>
        
        {currentUser?.role === 'limpieza' && (
          <div className="flex gap-2">
            {!selectedRoom.isClean ? (
              <Button 
                variant="default" 
                className="bg-green-600 hover:bg-green-700"
                onClick={handleClean}
              >
                Marcar como Desinfectada
              </Button>
            ) : (
              <Button 
                variant="destructive" 
                onClick={handleMarkDirty}
              >
                Marcar como No Desinfectada
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default RoomDetails;
