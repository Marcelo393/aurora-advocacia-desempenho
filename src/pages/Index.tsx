
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, ChevronLeft, Scale, Users, ClipboardCheck, BarChart3, Volume2, VolumeX, Home } from 'lucide-react';
import WelcomePage from '@/components/evaluation/WelcomePage';
import PresentationPage from '@/components/evaluation/PresentationPage';
import DataSkillsPage from '@/components/evaluation/DataSkillsPage';
import ManagementFeedbackPage from '@/components/evaluation/ManagementFeedbackPage';
import ClimateCollectionPage from '@/components/evaluation/ClimateCollectionPage';
import ConfirmationPage from '@/components/evaluation/ConfirmationPage';
import { soundService } from '@/services/soundService';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState(0); // 0 = Welcome, 1 = Presentation, 2-5 = Form pages, 6 = Confirmation
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    // Dados básicos
    nome: '',
    setor: '',
    
    // Habilidades e Competências
    trabalhoEquipe: '',
    entregas: '',
    opinioesDivergentes: '',
    proatividade: '',
    posturaTrabalho: '',
    situacoesNovas: '',
    pressaoOpcoes: [],
    pressaoContexto: '',
    
    // Código de Conduta
    pontualidade: '',
    vestimenta: '',
    cuidadoCozinha: '',
    cuidadoCopa: '',
    cuidadoSala: '',
    
    // Competências Técnicas
    lawNet: '',
    linguagemJuridica: '',
    conhecimentoLegislativo: '',
    sistemasJudiciarios: '',
    posturaCliente: '',
    comunicacaoCliente: '',
    jurisprudencia: '',
    
    // Gestão e Equipe
    cuidadoPatrimonial: '',
    posturaAdvogados: '',
    posturaEstagiarios: '',
    importanciaTrabalho: '',
    importanciaCliente: '',
    gostaTrabaho: '',
    sugestoes: '',
    
    // Auto feedback
    comecar: '',
    continuar: '',
    parar: '',
    comentarioExtra: '',
    
    // Coleta de Clima
    satisfacaoGeral: '',
    acolhimentoSetor: '',
    acolhimentoEscritorio: '',
    comunicacaoInterna: '',
    comunicacaoSetor: '',
    feedbacks: '',
    apoioTarefas: '',
    materialTecnico: '',
    colaboracao: '',
    expressarIdeias: '',
    equilibrioAcademico: '',
    sugestoesMelhoria: '',
    experienciaExtra: ''
  });

  const screens = [
    { component: WelcomePage, title: "Início", icon: Home, emoji: "🏠" },
    { component: PresentationPage, title: "Apresentação", icon: Scale, emoji: "📋" },
    { component: DataSkillsPage, title: "Dados e Habilidades", icon: Users, emoji: "📊" },
    { component: ManagementFeedbackPage, title: "Gestão e Feedback", icon: ClipboardCheck, emoji: "👥" },
    { component: ClimateCollectionPage, title: "Coleta de Clima", icon: BarChart3, emoji: "📈" }
  ];

  // Progresso para as páginas do formulário (exclui welcome e confirmation)
  const formProgress = currentScreen > 1 && currentScreen < 6 ? ((currentScreen - 1) / 4) * 100 : 0;

  useEffect(() => {
    soundService.setSoundEnabled(soundEnabled);
  }, [soundEnabled]);

  const handleStart = async () => {
    if (soundEnabled) {
      await soundService.playProgressSound();
    }
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentScreen(1);
      setIsTransitioning(false);
    }, 150);
  };

  const nextPage = async () => {
    if (currentScreen < screens.length) {
      if (soundEnabled) {
        await soundService.playProgressSound();
      }
      
      // Iniciar cronômetro quando entrar na primeira página do formulário
      if (currentScreen === 1 && !startTime) {
        setStartTime(Date.now());
      }
      
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentScreen(currentScreen + 1);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const prevPage = async () => {
    if (currentScreen > 1) {
      if (soundEnabled) {
        await soundService.playClickSound();
      }
      
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentScreen(currentScreen - 1);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const goHome = async () => {
    if (soundEnabled) {
      await soundService.playClickSound();
    }
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentScreen(0);
      setIsTransitioning(false);
    }, 150);
  };

  const updateFormData = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  // Welcome screen
  if (currentScreen === 0) {
    return <WelcomePage onStart={handleStart} />;
  }

  // Confirmation screen
  if (currentScreen >= screens.length) {
    return <ConfirmationPage formData={formData} onGoHome={goHome} startTime={startTime} />;
  }

  const CurrentScreenComponent = screens[currentScreen].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 transition-all duration-500">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-8 px-4 shadow-2xl">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 p-3 rounded-full shadow-lg">
                <Scale className="h-10 w-10 text-slate-900" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                  Sistema de Avaliação de Desempenho
                </h1>
                <p className="text-slate-300 text-lg">Morestoni Sociedade de Advogados</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={toggleSound}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-slate-700 transition-all duration-200"
              >
                {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
              </Button>
              <Button
                onClick={goHome}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-slate-700 transition-all duration-200"
              >
                <Home className="h-5 w-5" />
              </Button>
              <div className="text-right">
                <p className="text-sm text-slate-300">Página {currentScreen} de {screens.length - 1}</p>
              </div>
            </div>
          </div>
          
          {/* Enhanced Progress Bar - apenas para o formulário */}
          {currentScreen > 1 && currentScreen < 6 && (
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-slate-300">
                <span>Progresso da Avaliação</span>
                <span>{Math.round(formProgress)}% completo</span>
              </div>
              
              {/* Segmented Progress Bar */}
              <div className="flex space-x-1 h-2">
                {[2, 3, 4, 5].map((pageIndex) => (
                  <div
                    key={pageIndex}
                    className={`flex-1 rounded-full transition-all duration-500 ${
                      pageIndex < currentScreen 
                        ? 'bg-gradient-to-r from-green-400 to-green-500' 
                        : pageIndex === currentScreen 
                          ? 'bg-gradient-to-r from-blue-400 to-blue-500' 
                          : 'bg-slate-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Page Navigation - apenas para o formulário */}
          {currentScreen > 1 && currentScreen < 6 && (
            <div className="flex justify-between mt-6">
              {screens.slice(1, 5).map((screen, index) => {
                const pageIndex = index + 2;
                const Icon = screen.icon;
                return (
                  <div 
                    key={index}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                      pageIndex === currentScreen 
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 shadow-lg' 
                        : pageIndex < currentScreen 
                          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md' 
                          : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                    }`}
                  >
                    <span className="text-lg">{screen.emoji}</span>
                    <Icon className="h-4 w-4" />
                    <span className="text-xs font-medium hidden sm:block">{screen.title}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        <Card className={`shadow-2xl border-0 bg-white/95 backdrop-blur-sm transition-all duration-300 transform ${
          isTransitioning ? 'scale-95 opacity-70' : 'scale-100 opacity-100'
        }`}>
          <CardContent className="p-8">
            <div className={`transition-all duration-300 ${isTransitioning ? 'translate-x-4 opacity-0' : 'translate-x-0 opacity-100'}`}>
              {currentScreen === 1 && (
                <PresentationPage onNext={nextPage} />
              )}
              {currentScreen === 2 && (
                <DataSkillsPage 
                  formData={formData}
                  updateFormData={updateFormData}
                  onNext={nextPage}
                  onPrev={prevPage}
                  canGoBack={currentScreen > 2}
                />
              )}
              {currentScreen === 3 && (
                <ManagementFeedbackPage 
                  formData={formData}
                  updateFormData={updateFormData}
                  onNext={nextPage}
                  onPrev={prevPage}
                  canGoBack={currentScreen > 2}
                />
              )}
              {currentScreen === 4 && (
                <ClimateCollectionPage 
                  formData={formData}
                  updateFormData={updateFormData}
                  onNext={nextPage}
                  onPrev={prevPage}
                  canGoBack={currentScreen > 2}
                  isLastPage={currentScreen === screens.length - 1}
                  startTime={startTime}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Custom Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
        }
        
        .hover-lift {
          transition: all 0.2s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        
        input:focus, textarea:focus, select:focus {
          transform: scale(1.02);
          transition: transform 0.2s ease;
        }
        
        button {
          transition: all 0.2s ease;
        }
        
        button:hover {
          transform: scale(1.05);
        }
        
        button:active {
          transform: scale(0.98);
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default Index;
