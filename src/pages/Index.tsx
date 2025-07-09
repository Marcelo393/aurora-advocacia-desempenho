
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, ChevronLeft, Scale, Users, ClipboardCheck, BarChart3, Volume2, VolumeX } from 'lucide-react';
import PresentationPage from '@/components/evaluation/PresentationPage';
import DataSkillsPage from '@/components/evaluation/DataSkillsPage';
import ManagementFeedbackPage from '@/components/evaluation/ManagementFeedbackPage';
import ClimateCollectionPage from '@/components/evaluation/ClimateCollectionPage';
import ConfirmationPage from '@/components/evaluation/ConfirmationPage';
import { soundService } from '@/services/soundService';

const Index = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
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

  const pages = [
    { component: PresentationPage, title: "Apresentação", icon: Scale, emoji: "📋" },
    { component: DataSkillsPage, title: "Dados e Habilidades", icon: Users, emoji: "📊" },
    { component: ManagementFeedbackPage, title: "Gestão e Feedback", icon: ClipboardCheck, emoji: "👥" },
    { component: ClimateCollectionPage, title: "Coleta de Clima", icon: BarChart3, emoji: "📈" }
  ];

  const progress = ((currentPage + 1) / pages.length) * 100;

  useEffect(() => {
    soundService.setSoundEnabled(soundEnabled);
  }, [soundEnabled]);

  const nextPage = async () => {
    if (currentPage < pages.length) {
      if (soundEnabled) {
        await soundService.playProgressSound();
      }
      
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const prevPage = async () => {
    if (currentPage > 0) {
      if (soundEnabled) {
        await soundService.playClickSound();
      }
      
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const updateFormData = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  if (currentPage >= pages.length) {
    return <ConfirmationPage formData={formData} />;
  }

  const CurrentPageComponent = pages[currentPage].component;

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
                <p className="text-slate-300 text-lg">Escritório de Advocacia</p>
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
              <div className="text-right">
                <p className="text-sm text-slate-300">Página {currentPage + 1} de {pages.length}</p>
              </div>
            </div>
          </div>
          
          {/* Enhanced Progress Bar */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-slate-300">
              <span>Progresso da Avaliação</span>
              <span>{Math.round(progress)}% completo</span>
            </div>
            
            {/* Segmented Progress Bar */}
            <div className="flex space-x-1 h-2">
              {pages.map((_, index) => (
                <div
                  key={index}
                  className={`flex-1 rounded-full transition-all duration-500 ${
                    index < currentPage 
                      ? 'bg-gradient-to-r from-green-400 to-green-500' 
                      : index === currentPage 
                        ? 'bg-gradient-to-r from-blue-400 to-blue-500' 
                        : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>
          
          {/* Page Navigation */}
          <div className="flex justify-between mt-6">
            {pages.map((page, index) => {
              const Icon = page.icon;
              return (
                <div 
                  key={index}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    index === currentPage 
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 shadow-lg' 
                      : index < currentPage 
                        ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md' 
                        : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  <span className="text-lg">{page.emoji}</span>
                  <Icon className="h-4 w-4" />
                  <span className="text-xs font-medium hidden sm:block">{page.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        <Card className={`shadow-2xl border-0 bg-white/95 backdrop-blur-sm transition-all duration-300 transform ${
          isTransitioning ? 'scale-95 opacity-70' : 'scale-100 opacity-100'
        }`}>
          <CardContent className="p-8">
            <div className={`transition-all duration-300 ${isTransitioning ? 'translate-x-4 opacity-0' : 'translate-x-0 opacity-100'}`}>
              <CurrentPageComponent 
                formData={formData}
                updateFormData={updateFormData}
                onNext={nextPage}
                onPrev={prevPage}
                canGoBack={currentPage > 0}
                isLastPage={currentPage === pages.length - 1}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
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
