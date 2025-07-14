
import { useEffect } from 'react';
import { soundService } from '@/services/soundService';
import { generatePDF } from '@/services/pdfService';
import { FormData } from '@/types/formData';

interface UseEvaluationNavigationProps {
  currentScreen: number;
  setCurrentScreen: (screen: number) => void;
  isTransitioning: boolean;
  setIsTransitioning: (transitioning: boolean) => void;
  totalScreens: number;
  formData: FormData;
  calculateAverageScore: () => number;
}

export const useEvaluationNavigation = ({
  currentScreen,
  setCurrentScreen,
  isTransitioning,
  setIsTransitioning,
  totalScreens,
  formData,
  calculateAverageScore
}: UseEvaluationNavigationProps) => {
  
  useEffect(() => {
    soundService.playTransition();
  }, [currentScreen]);

  const nextPage = async () => {
    if (currentScreen === totalScreens - 1) {
      // Save data to localStorage
      const savedData = JSON.parse(localStorage.getItem('evaluation-responses') || '[]');
      const newResponse = {
        ...formData,
        data: new Date().toISOString(),
        notaGeral: calculateAverageScore()
      };
      savedData.push(newResponse);
      localStorage.setItem('evaluation-responses', JSON.stringify(savedData));
      
      // Generate PDF - only pass the fields that the PDF service expects
      const pdfData = {
        ...formData,
        // Map any missing fields that the PDF service might expect
        pressaoContexto: formData.pressaoOutros || '',
        vestimenta: '',
        cuidadoCozinha: '',
        cuidadoCopa: '',
        // Add other fields as needed for PDF compatibility
      };
      await generatePDF(pdfData as any);
      return;
    }

    setIsTransitioning(true);
    soundService.playTransition();
    
    setTimeout(() => {
      setCurrentScreen(currentScreen + 1);
      setIsTransitioning(false);
    }, 300);
  };

  const prevPage = () => {
    if (currentScreen > 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentScreen(currentScreen - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  return {
    nextPage,
    prevPage
  };
};
