import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Shield, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simular delay de autenticação
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (password === 'morestoni2025') {
      sessionStorage.setItem('adminAuthenticated', 'true');
      navigate('/admin');
    } else {
      setError('Senha incorreta. Tente novamente.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
      {/* Padrão geométrico de fundo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 transform rotate-45">
          <div className="w-32 h-32 border-2 border-white"></div>
        </div>
        <div className="absolute top-40 right-32 transform -rotate-12">
          <div className="w-24 h-24 border-2 border-yellow-400"></div>
        </div>
        <div className="absolute bottom-32 left-1/3 transform rotate-12">
          <div className="w-28 h-28 border-2 border-blue-400"></div>
        </div>
        <div className="absolute bottom-20 right-20">
          <div className="w-20 h-20 border-2 border-white transform rotate-45"></div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 p-4 rounded-full w-fit mx-auto mb-4 shadow-2xl">
            <Shield className="h-12 w-12 text-slate-900" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard Administrativo</h1>
          <p className="text-blue-200">Morestoni Sociedade de Advogados</p>
        </div>

        {/* Card de Login */}
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center space-x-2 text-slate-900">
              <Lock className="h-5 w-5 text-blue-600" />
              <span>Acesso Seguro</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Senha de Administrador
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite a senha..."
                    className="pr-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 shadow-lg transition-all duration-300 transform hover:scale-105"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Verificando...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Lock className="h-4 w-4" />
                    <span>Entrar no Dashboard</span>
                  </div>
                )}
              </Button>
            </form>

            {/* Informações de Segurança */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-2">
                <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-xs text-blue-700">
                  <p className="font-medium mb-1">Acesso Restrito</p>
                  <p>Este painel é destinado exclusivamente aos administradores do sistema. Todas as tentativas de acesso são registradas.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações Adicionais */}
        <div className="text-center mt-6 text-slate-400 text-sm">
          <p>Versão 1.0 • Sistema de Avaliação de Desempenho</p>
          <p className="mt-1">© 2025 Morestoni Sociedade de Advogados</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;