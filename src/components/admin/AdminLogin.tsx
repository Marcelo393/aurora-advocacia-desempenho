
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AdminLoginProps {
  password: string;
  setPassword: (password: string) => void;
  onLogin: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ password, setPassword, onLogin }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Dashboard Administrativo</CardTitle>
          <p className="text-slate-600">Morestoni Sociedade de Advogados</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Senha de Acesso</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite a senha"
              onKeyPress={(e) => e.key === 'Enter' && onLogin()}
              className="w-full"
            />
          </div>
          <Button onClick={onLogin} className="w-full">
            Acessar Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
