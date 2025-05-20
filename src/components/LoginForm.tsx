
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;
    
    setIsSubmitting(true);
    await login(username, password);
    setIsSubmitting(false);
  };

  return (
    <Card className="w-[350px] mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Acceso App Colegio</CardTitle>
        <CardDescription>
          Ingresa tus credenciales para continuar
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Usuario</Label>
            <Input
              id="username"
              placeholder="Ingresa tu nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Usa "alumno" o "limpieza" como usuario (limpieza necesita contraseña)
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={username.toLowerCase().includes('limpieza')}
            />
            {username.toLowerCase().includes('limpieza') && (
              <p className="text-xs text-muted-foreground">
                Para usuarios de limpieza, la contraseña es "1234"
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting || !username || (username.toLowerCase().includes('limpieza') && !password)}>
            {isSubmitting ? 'Accediendo...' : 'Acceder'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LoginForm;
