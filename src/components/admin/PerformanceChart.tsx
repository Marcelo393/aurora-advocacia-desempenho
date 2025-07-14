
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface PerformanceChartProps {
  topSkills: Array<{ skill: string; average: string }>;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ topSkills }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Análise de Performance Geral</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            average: { label: "Média", color: "hsl(var(--chart-2))" }
          }}
          className="h-80"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topSkills}>
              <XAxis dataKey="skill" angle={-45} textAnchor="end" height={100} />
              <YAxis domain={[0, 5]} />
              <Bar dataKey="average" fill="#3B82F6" />
              <ChartTooltip content={<ChartTooltipContent />} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
