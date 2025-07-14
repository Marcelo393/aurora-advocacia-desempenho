
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Eye } from 'lucide-react';

const ExportSection: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>📋 Relatórios e Exportação</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Relatório Executivo PDF</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Dados por Setor (Excel)</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>Backup Completo JSON</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExportSection;
