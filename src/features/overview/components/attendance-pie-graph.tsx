'use client';

import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
const chartData = [
  { attendance: 'sickLeave', count: 20, fill: 'var(--color-sickLeave)' },
  {
    attendance: 'vacationLeave',
    count: 10,
    fill: 'var(--color-vacationLeave)'
  },
  {
    attendance: 'bereavementLeave',
    count: 1,
    fill: 'var(--color-bereavementLeave)'
  },
  { attendance: 'present', count: 40, fill: 'var(--color-present)' }
];

const chartConfig = {
  count: {
    label: 'Visitors'
  },
  sickLeave: {
    label: 'Sick Leave',
    color: 'hsl(var(--chart-1))'
  },
  vacationLeave: {
    label: 'Vacation Leave',
    color: 'hsl(var(--chart-2))'
  },
  bereavementLeave: {
    label: 'Bereavement Leave',
    color: 'hsl(var(--chart-3))'
  },
  present: {
    label: 'Present',
    color: 'hsl(var(--chart-4))'
  }
} satisfies ChartConfig;

export function AttendancePieGraph() {
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, []);

  return (
    <Card className='flex flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Pie Chart - Attendance</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className='flex-1 pb-0'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square max-h-[360px]'
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey='count'
              nameKey='attendance'
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor='middle'
                        dominantBaseline='middle'
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className='fill-foreground text-3xl font-bold'
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className='fill-muted-foreground'
                        >
                          Man days
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        <div className='flex items-center gap-2 font-medium leading-none'>
          Showing total attendance for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
