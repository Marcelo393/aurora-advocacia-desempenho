
import React from 'react';
import { FormData } from '@/types/formData';
import PresentationPage from '@/components/evaluation/PresentationPage';
import DataSkillsPage from '@/components/evaluation/DataSkillsPage';
import ManagementFeedbackPage from '@/components/evaluation/ManagementFeedbackPage';
import ClimateCollectionPage from '@/components/evaluation/ClimateCollectionPage';
import ConfirmationPage from '@/components/evaluation/ConfirmationPage';

interface ScreenRendererProps {
  currentScreen: number;
  totalScreens: number;
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onNext: () => void;
  onPrev: () => void;
  isTransitioning: boolean;
}

const ScreenRenderer: React.FC<ScreenRendererProps> = ({
  currentScreen,
  totalScreens,
  formData,
  updateFormData,
  onNext,
  onPrev,
  isTransitioning
}) => {
  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 1:
        return <PresentationPage onNext={onNext} />;
      case 2:
        return (
          <DataSkillsPage 
            formData={formData}
            updateFormData={updateFormData}
            onNext={onNext}
            onPrev={onPrev}
            canGoBack={currentScreen > 2}
          />
        );
      case 3:
        return (
          <ManagementFeedbackPage 
            formData={formData}
            updateFormData={updateFormData}
            onNext={onNext}
            onPrev={onPrev}
            canGoBack={currentScreen > 2}
          />
        );
      case 4:
        return (
          <ClimateCollectionPage 
            formData={formData}
            updateFormData={updateFormData}
            onNext={onNext}
            onPrev={onPrev}
            canGoBack={currentScreen > 2}
            isLastPage={currentScreen === totalScreens - 1}
          />
        );
      case 5:
        return (
          <ConfirmationPage 
            formData={formData}
            onFinish={onNext}
            onPrev={onPrev}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`transition-all duration-300 ${isTransitioning ? 'translate-x-4 opacity-0' : 'translate-x-0 opacity-100'}`}>
      {renderCurrentScreen()}
    </div>
  );
};

export default ScreenRenderer;
