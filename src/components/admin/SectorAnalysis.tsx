
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SectorAnalysisProps {
  sectors: string[];
  selectedSector: string;
  setSelectedSector: (sector: string) => void;
  evaluationData: any[];
}

const SectorAnalysis: React.FC<SectorAnalysisProps> = ({ 
  sectors, 
  selectedSector, 
  setSelectedSector, 
  evaluationData 
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Análise por Setor</CardTitle>
        <Select value={selectedSector} onValueChange={setSelectedSector}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Selecione um setor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Setores</SelectItem>
            {sectors.map(sector => (
              <SelectItem key={sector} value={sector}>{sector}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sectors.map(sector => {
            const sectorEvals = evaluationData.filter(item => item.setor === sector);
            const avgScore = sectorEvals.length > 0 
              ? (sectorEvals.reduce((acc, item) => acc + item.notaGeral, 0) / sectorEvals.length).toFixed(1)
              : '0.0';
            
            return (
              <Card key={sector} className="p-4">
                <h3 className="font-semibold text-sm mb-2">{sector}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-600">Funcionários:</span>
                    <span className="text-sm font-medium">{sectorEvals.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-600">Nota Média:</span>
                    <span className="text-sm font-bold text-blue-600">{avgScore}/5</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default SectorAnalysis;
