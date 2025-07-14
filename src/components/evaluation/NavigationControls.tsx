
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NavigationControlsProps {
  currentScreen: number;
  totalScreens: number;
  onPrev: () => void;
  onNext: () => void;
  isTransitioning: boolean;
}

const NavigationControls: React.FC<NavigationControlsProps> = ({
  currentScreen,
  totalScreens,
  onPrev,
  onNext,
  isTransitioning
}) => {
  return (
    <div className="mt-8 flex justify-between items-center">
      <Button
        variant="outline"
        onClick={onPrev}
        disabled={currentScreen <= 1 || isTransitioning}
        className="flex items-center space-x-2"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Anterior</span>
      </Button>

      <div className="text-sm text-gray-500">
        Passo {currentScreen} de {totalScreens}
      </div>

      <Button
        onClick={onNext}
        disabled={isTransitioning}
        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
      >
        <span>{currentScreen === totalScreens - 1 ? 'Finalizar' : 'Próximo'}</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default NavigationControls;
