
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Award, Clock, BarChart3 } from 'lucide-react';

interface StatsCardsProps {
  stats: {
    total: number;
    avgScore: string;
    lastResponse: string;
  };
  activeSectorsCount: number;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats, activeSectorsCount }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total de Avaliações</p>
              <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
            </div>
            <Users className="h-12 w-12 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Nota Média Geral</p>
              <p className="text-3xl font-bold text-green-600">{stats.avgScore}/5</p>
            </div>
            <Award className="h-12 w-12 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Última Resposta</p>
              <p className="text-lg font-semibold text-slate-900">{stats.lastResponse}</p>
            </div>
            <Clock className="h-12 w-12 text-orange-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Setores Ativos</p>
              <p className="text-3xl font-bold text-purple-600">{activeSectorsCount}</p>
            </div>
            <BarChart3 className="h-12 w-12 text-purple-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
