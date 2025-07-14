
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ComparisonTableProps {
  sectors: string[];
  evaluationData: any[];
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ sectors, evaluationData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparativo entre Setores</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-slate-200">
            <thead>
              <tr className="bg-slate-50">
                <th className="border border-slate-200 p-3 text-left">Setor</th>
                <th className="border border-slate-200 p-3 text-center">Funcionários</th>
                <th className="border border-slate-200 p-3 text-center">Nota Média</th>
                <th className="border border-slate-200 p-3 text-center">Ranking</th>
              </tr>
            </thead>
            <tbody>
              {sectors.map((sector, index) => {
                const sectorEvals = evaluationData.filter(item => item.setor === sector);
                const avgScore = sectorEvals.length > 0 
                  ? sectorEvals.reduce((acc, item) => acc + item.notaGeral, 0) / sectorEvals.length
                  : 0;
                
                return (
                  <tr key={sector} className="hover:bg-slate-50">
                    <td className="border border-slate-200 p-3 font-medium">{sector}</td>
                    <td className="border border-slate-200 p-3 text-center">{sectorEvals.length}</td>
                    <td className="border border-slate-200 p-3 text-center">
                      <Badge variant={avgScore >= 4 ? "default" : avgScore >= 3 ? "secondary" : "destructive"}>
                        {avgScore.toFixed(1)}/5
                      </Badge>
                    </td>
                    <td className="border border-slate-200 p-3 text-center">
                      #{index + 1}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComparisonTable;
