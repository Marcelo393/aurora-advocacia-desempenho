
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Scale, Award, Users, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface WelcomePageProps {
  onStart: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onStart }) => {
  const navigate = useNavigate();
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  const handleAdminLogin = () => {
    if (adminPassword === 'morestoni2025') {
      setShowAdminModal(false);
      // Definir autenticação no sessionStorage
      sessionStorage.setItem('adminAuthenticated', 'true');
      navigate('/admin');
    } else {
      setAdminError('Senha incorreta');
    }
  };

  const closeAdminModal = () => {
    setShowAdminModal(false);
    setAdminPassword('');
    setAdminError('');
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 relative overflow-hidden">
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

      {/* Conteúdo principal */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          {/* Logo e ícones jurídicos */}
          <div className="flex justify-center items-center space-x-8 animate-fade-in">
            <div className="text-4xl opacity-70">⚖️</div>
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 p-6 rounded-full shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <Scale className="h-16 w-16 text-slate-900" />
            </div>
            <div className="text-4xl opacity-70">🏛️</div>
          </div>

          {/* Título principal */}
          <div className="space-y-6 animate-slide-in">
            <h1 className="text-6xl md:text-7xl font-bold text-white leading-tight">
              <span className="bg-gradient-to-r from-white via-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                AVALIAÇÃO DE
              </span>
              <br />
              <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-white bg-clip-text text-transparent">
                DESEMPENHO 2025
              </span>
            </h1>
            
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-semibold text-blue-200">
                Morestoni Sociedade de Advogados
              </h2>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Sistema de autoavaliação profissional para desenvolvimento contínuo e excelência jurídica
              </p>
            </div>
          </div>

          {/* Características do processo */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
              <div className="bg-gradient-to-br from-blue-400 to-blue-500 p-3 rounded-full w-fit mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Autoconhecimento</h3>
              <p className="text-slate-300 text-sm">Reflexão sobre performance e desenvolvimento profissional</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 p-3 rounded-full w-fit mx-auto mb-4">
                <Award className="h-8 w-8 text-slate-900" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Crescimento</h3>
              <p className="text-slate-300 text-sm">Identificação de pontos fortes e oportunidades</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
              <div className="bg-gradient-to-br from-green-400 to-green-500 p-3 rounded-full w-fit mx-auto mb-4">
                <Scale className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Excelência</h3>
              <p className="text-slate-300 text-sm">Compromisso com a qualidade e padrões éticos</p>
            </div>
          </div>

          {/* Botão de início */}
          <div className="pt-8">
            <Button 
              onClick={onStart}
              size="lg"
              className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 hover:from-yellow-600 hover:via-yellow-500 hover:to-yellow-600 text-slate-900 font-bold px-12 py-6 text-xl shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-110 border-2 border-yellow-300/50 hover:border-yellow-200"
            >
              <span className="flex items-center space-x-3">
                <span>INICIAR AVALIAÇÃO</span>
                <ChevronRight className="h-6 w-6" />
              </span>
            </Button>
          </div>

          {/* Botão de administrador */}
          <div className="pt-5">
            <button
              onClick={() => setShowAdminModal(true)}
              className="text-sm text-slate-400 bg-slate-100/20 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-slate-100/30 hover:text-slate-300 transition-all duration-300 border border-slate-300/30 hover:border-slate-300/50 cursor-pointer flex items-center space-x-2"
            >
              <span>🔒</span>
              <span>Área do Administrador</span>
            </button>
          </div>

          {/* Informações adicionais */}
          <div className="pt-8 text-slate-400 text-sm space-y-2">
            <p>📋 4 seções principais • ⏱️ Tempo estimado: 10-15 minutos</p>
            <p>💾 Progresso salvo automaticamente • 📧 Envio para juliacarvalho@morestoni.adv.br</p>
          </div>
        </div>
      </div>


      {/* Modal de login administrativo */}
      {showAdminModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeAdminModal}
        >
          <div 
            className="bg-white p-6 rounded-lg shadow-2xl max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Acesso Administrativo</h3>
              <button 
                onClick={closeAdminModal}
                className="text-slate-500 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <input
                type="password"
                placeholder="Digite a senha"
                value={adminPassword}
                onChange={(e) => {
                  setAdminPassword(e.target.value);
                  setAdminError('');
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              
              {adminError && (
                <p className="text-red-500 text-sm">{adminError}</p>
              )}
              
              <div className="flex space-x-3">
                <Button 
                  onClick={handleAdminLogin}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Entrar
                </Button>
                <Button 
                  onClick={closeAdminModal}
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estilos customizados */}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }
        
        .animate-slide-in {
          animation: slideIn 1.2s ease-out 0.3s both;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default WelcomePage;
