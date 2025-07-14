
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ArrowUp } from 'lucide-react';

interface ChartsSectionProps {
  sectorData: Array<{ name: string; value: number }>;
  topSkills: Array<{ skill: string; average: string }>;
  colors: string[];
}

const ChartsSection: React.FC<ChartsSectionProps> = ({ sectorData, topSkills, colors }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Respostas por Setor</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              value: { label: "Respostas", color: "hsl(var(--chart-1))" }
            }}
            className="h-80"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sectorData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sectorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top 5 Habilidades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topSkills.slice(0, 5).map((skill, index) => (
              <div key={skill.skill} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Badge variant="outline">{index + 1}º</Badge>
                  <span className="text-sm font-medium">{skill.skill}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-green-600">{skill.average}</span>
                  <ArrowUp className="h-4 w-4 text-green-500" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartsSection;
