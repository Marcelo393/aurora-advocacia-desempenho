
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Avaliação de Performance
        </h1>
        <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/20">
          <div className="flex items-center space-x-2 text-slate-600">
            <span className="text-lg font-semibold text-blue-600">{currentScreen}</span>
            <span className="text-slate-400">/</span>
            <span className="text-lg font-medium">{totalScreens}</span>
          </div>
        </div>
      </div>
      
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-200 via-purple-200 to-indigo-200 rounded-full opacity-30 blur-sm"></div>
        <Progress 
          value={progress} 
          className="h-4 bg-gradient-to-r from-slate-100 to-slate-200 border border-white/30 shadow-inner rounded-full relative overflow-hidden"
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm border border-white/40">
            <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
        <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full shadow-lg transition-all duration-500 ease-out" 
             style={{ width: `${progress}%` }}>
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full"></div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg border-2 border-blue-400 animate-pulse"></div>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-slate-600 text-sm font-medium">
          Continue preenchendo com cuidado e transparência
        </p>
      </div>
    </div>
  );
};

export default ProgressHeader;
