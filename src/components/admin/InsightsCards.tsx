
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, AlertTriangle } from 'lucide-react';

const InsightsCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-green-500" />
            <span>Pontos Fortes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm font-medium text-green-800">🏆 Melhor Setor</p>
              <p className="text-xs text-green-600">Previdenciário - Judicial (4.2/5)</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-800">💪 Habilidade Mais Forte</p>
              <p className="text-xs text-blue-600">Trabalho em Equipe (4.3/5)</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-sm font-medium text-purple-800">📈 Tendência Positiva</p>
              <p className="text-xs text-purple-600">Comunicação melhorou 15% no último mês</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <span>Áreas de Atenção</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-orange-50 rounded-lg">
              <p className="text-sm font-medium text-orange-800">⚠️ Precisa de Atenção</p>
              <p className="text-xs text-orange-600">Tributário (3.9/5 - abaixo da média)</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <p className="text-sm font-medium text-red-800">🎯 Foco de Melhoria</p>
              <p className="text-xs text-red-600">Liderança (3.5/5 - pontuação mais baixa)</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm font-medium text-yellow-800">📊 Recomendação</p>
              <p className="text-xs text-yellow-600">Investir em treinamento de gestão de tempo</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InsightsCards;
