
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ProgressHeaderProps {
  currentScreen: number;
  totalScreens: number;
  progress: number;
}

const ProgressHeader: React.FC<ProgressHeaderProps> = ({
  currentScreen,
  totalScreens,
  progress
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Avaliação de Performance
        </h1>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>{currentScreen}</span>
          <span>/</span>
          <span>{totalScreens}</span>
        </div>
      </div>
      
      <div className="relative">
        <Progress value={progress} className="h-3 bg-gray-200" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium text-white">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgressHeader;
