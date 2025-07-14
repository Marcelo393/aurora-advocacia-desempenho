
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { useEvaluationState } from '@/hooks/useEvaluationState';
import { useEvaluationNavigation } from '@/hooks/useEvaluationNavigation';
import ProgressHeader from '@/components/evaluation/ProgressHeader';
import ScreenRenderer from '@/components/evaluation/ScreenRenderer';
import NavigationControls from '@/components/evaluation/NavigationControls';
import { Screen } from '@/types/formData';

// Import screen components for screen configuration
import WelcomePage from '@/components/evaluation/WelcomePage';
import PresentationPage from '@/components/evaluation/PresentationPage';
import DataSkillsPage from '@/components/evaluation/DataSkillsPage';
import ManagementFeedbackPage from '@/components/evaluation/ManagementFeedbackPage';
import ClimateCollectionPage from '@/components/evaluation/ClimateCollectionPage';
import ConfirmationPage from '@/components/evaluation/ConfirmationPage';

const Index = () => {
  const {
    currentScreen,
    setCurrentScreen,
    isTransitioning,
    setIsTransitioning,
    formData,
    updateFormData,
    calculateAverageScore
  } = useEvaluationState();

  const screens: Screen[] = [
    { component: WelcomePage, title: "Bem-vindo" },
    { component: PresentationPage, title: "Apresentação" },
    { component: DataSkillsPage, title: "Dados e Habilidades" },
    { component: ManagementFeedbackPage, title: "Feedback de Gestão" },
    { component: ClimateCollectionPage, title: "Coleta de Clima" },
    { component: ConfirmationPage, title: "Confirmação" }
  ];

  const { nextPage, prevPage } = useEvaluationNavigation({
    currentScreen,
    setCurrentScreen,
    isTransitioning,
    setIsTransitioning,
    totalScreens: screens.length,
    formData,
    calculateAverageScore
  });

  const progress = ((currentScreen - 1) / (screens.length - 1)) * 100;
  const isCompleted = currentScreen === screens.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Header */}
        <ProgressHeader 
          currentScreen={currentScreen}
          totalScreens={screens.length}
          progress={progress}
        />

        {/* Main Content Card */}
        <Card className={`transition-all duration-500 ${isCompleted ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              {isCompleted && <CheckCircle className="h-6 w-6 text-green-600" />}
              <span className={isCompleted ? 'text-green-700' : 'text-gray-700'}>
                {screens[currentScreen - 1]?.title || 'Avaliação'}
              </span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="min-h-[600px]">
            <ScreenRenderer
              currentScreen={currentScreen}
              totalScreens={screens.length}
              formData={formData}
              updateFormData={updateFormData}
              onNext={nextPage}
              onPrev={prevPage}
              isTransitioning={isTransitioning}
            />
          </CardContent>
        </Card>

        {/* Navigation Footer */}
        <NavigationControls
          currentScreen={currentScreen}
          totalScreens={screens.length}
          onPrev={prevPage}
          onNext={nextPage}
          isTransitioning={isTransitioning}
        />
      </div>
    </div>
  );
};

export default Index;
