'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

export const description = 'An interactive bar chart';

const chartData = [
  { date: '2024-04-01', totalReimbursements: 222, totalLeaves: 2 },
  { date: '2024-04-02', totalReimbursements: 97, totalLeaves: 2 },
  { date: '2024-04-03', totalReimbursements: 167, totalLeaves: 1 },
  { date: '2024-04-04', totalReimbursements: 242, totalLeaves: 1 },
  { date: '2024-04-05', totalReimbursements: 373, totalLeaves: 2 },
  { date: '2024-04-06', totalReimbursements: 301, totalLeaves: 2 },
  { date: '2024-04-07', totalReimbursements: 245, totalLeaves: 3 },
  { date: '2024-04-08', totalReimbursements: 409, totalLeaves: 4 },
  { date: '2024-04-09', totalReimbursements: 59, totalLeaves: 2 },
  { date: '2024-04-10', totalReimbursements: 261, totalLeaves: 1 },
  { date: '2024-04-11', totalReimbursements: 327, totalLeaves: 1 },
  { date: '2024-04-12', totalReimbursements: 292, totalLeaves: 0 },
  { date: '2024-04-13', totalReimbursements: 342, totalLeaves: 0 },
  { date: '2024-04-14', totalReimbursements: 137, totalLeaves: 0 },
  { date: '2024-04-15', totalReimbursements: 120, totalLeaves: 0 },
  { date: '2024-04-16', totalReimbursements: 138, totalLeaves: 0 },
  { date: '2024-04-17', totalReimbursements: 446, totalLeaves: 0 },
  { date: '2024-04-18', totalReimbursements: 364, totalLeaves: 1 },
  { date: '2024-04-19', totalReimbursements: 243, totalLeaves: 1 },
  { date: '2024-04-20', totalReimbursements: 89, totalLeaves: 1 },
  { date: '2024-04-21', totalReimbursements: 137, totalLeaves: 1 },
  { date: '2024-04-22', totalReimbursements: 224, totalLeaves: 0 },
  { date: '2024-04-23', totalReimbursements: 138, totalLeaves: 0 },
  { date: '2024-04-24', totalReimbursements: 387, totalLeaves: 2 },
  { date: '2024-04-25', totalReimbursements: 215, totalLeaves: 3 },
  { date: '2024-04-26', totalReimbursements: 75, totalLeaves: 0 },
  { date: '2024-04-27', totalReimbursements: 383, totalLeaves: 0 },
  { date: '2024-04-28', totalReimbursements: 122, totalLeaves: 1 },
  { date: '2024-04-29', totalReimbursements: 315, totalLeaves: 1 },
  { date: '2024-04-30', totalReimbursements: 454, totalLeaves: 1 },
  { date: '2024-05-01', totalReimbursements: 165, totalLeaves: 1 },
  { date: '2024-05-02', totalReimbursements: 293, totalLeaves: 2 },
  { date: '2024-05-03', totalReimbursements: 247, totalLeaves: 2 },
  { date: '2024-05-04', totalReimbursements: 385, totalLeaves: 2 },
  { date: '2024-05-05', totalReimbursements: 481, totalLeaves: 3 },
  { date: '2024-05-06', totalReimbursements: 498, totalLeaves: 3 },
  { date: '2024-05-07', totalReimbursements: 388, totalLeaves: 4 },
  { date: '2024-05-08', totalReimbursements: 149, totalLeaves: 2 },
  { date: '2024-05-09', totalReimbursements: 227, totalLeaves: 1 },
  { date: '2024-05-10', totalReimbursements: 293, totalLeaves: 3 },
  { date: '2024-05-11', totalReimbursements: 335, totalLeaves: 4 },
  { date: '2024-05-12', totalReimbursements: 197, totalLeaves: 2 },
  { date: '2024-05-13', totalReimbursements: 197, totalLeaves: 3 },
  { date: '2024-05-14', totalReimbursements: 448, totalLeaves: 1 },
  { date: '2024-05-15', totalReimbursements: 473, totalLeaves: 1 },
  { date: '2024-05-16', totalReimbursements: 338, totalLeaves: 2 },
  { date: '2024-05-17', totalReimbursements: 499, totalLeaves: 3 },
  { date: '2024-05-18', totalReimbursements: 315, totalLeaves: 4 },
  { date: '2024-05-19', totalReimbursements: 235, totalLeaves: 2 },
  { date: '2024-05-20', totalReimbursements: 177, totalLeaves: 1 },
  { date: '2024-05-21', totalReimbursements: 82, totalLeaves: 1 },
  { date: '2024-05-22', totalReimbursements: 81, totalLeaves: 1 },
  { date: '2024-05-23', totalReimbursements: 252, totalLeaves: 1 },
  { date: '2024-05-24', totalReimbursements: 294, totalLeaves: 1 },
  { date: '2024-05-25', totalReimbursements: 201, totalLeaves: 1 },
  { date: '2024-05-26', totalReimbursements: 213, totalLeaves: 2 },
  { date: '2024-05-27', totalReimbursements: 420, totalLeaves: 2 },
  { date: '2024-05-28', totalReimbursements: 233, totalLeaves: 2 },
  { date: '2024-05-29', totalReimbursements: 78, totalLeaves: 2 },
  { date: '2024-05-30', totalReimbursements: 340, totalLeaves: 2 },
  { date: '2024-05-31', totalReimbursements: 178, totalLeaves: 2 },
  { date: '2024-06-01', totalReimbursements: 178, totalLeaves: 2 },
  { date: '2024-06-02', totalReimbursements: 470, totalLeaves: 3 },
  { date: '2024-06-03', totalReimbursements: 103, totalLeaves: 1 },
  { date: '2024-06-04', totalReimbursements: 439, totalLeaves: 2 },
  { date: '2024-06-05', totalReimbursements: 88, totalLeaves: 2 },
  { date: '2024-06-06', totalReimbursements: 294, totalLeaves: 3 },
  { date: '2024-06-07', totalReimbursements: 323, totalLeaves: 4 },
  { date: '2024-06-08', totalReimbursements: 385, totalLeaves: 1 },
  { date: '2024-06-09', totalReimbursements: 438, totalLeaves: 1 },
  { date: '2024-06-10', totalReimbursements: 155, totalLeaves: 2 },
  { date: '2024-06-11', totalReimbursements: 92, totalLeaves: 2 },
  { date: '2024-06-12', totalReimbursements: 492, totalLeaves: 3 },
  { date: '2024-06-13', totalReimbursements: 81, totalLeaves: 1 },
  { date: '2024-06-14', totalReimbursements: 426, totalLeaves: 1 },
  { date: '2024-06-15', totalReimbursements: 307, totalLeaves: 2 },
  { date: '2024-06-16', totalReimbursements: 371, totalLeaves: 3 },
  { date: '2024-06-17', totalReimbursements: 475, totalLeaves: 4 },
  { date: '2024-06-18', totalReimbursements: 107, totalLeaves: 1 },
  { date: '2024-06-19', totalReimbursements: 341, totalLeaves: 2 },
  { date: '2024-06-20', totalReimbursements: 408, totalLeaves: 2 },
  { date: '2024-06-21', totalReimbursements: 169, totalLeaves: 2 },
  { date: '2024-06-22', totalReimbursements: 317, totalLeaves: 2 },
  { date: '2024-06-23', totalReimbursements: 480, totalLeaves: 2 },
  { date: '2024-06-24', totalReimbursements: 132, totalLeaves: 2 },
  { date: '2024-06-25', totalReimbursements: 141, totalLeaves: 2 },
  { date: '2024-06-26', totalReimbursements: 434, totalLeaves: 2 },
  { date: '2024-06-27', totalReimbursements: 448, totalLeaves: 1 },
  { date: '2024-06-28', totalReimbursements: 149, totalLeaves: 1 },
  { date: '2024-06-29', totalReimbursements: 103, totalLeaves: 1 },
  { date: '2024-06-30', totalReimbursements: 446, totalLeaves: 1 }
];

const chartConfig = {
  totalReimbursements: {
    label: 'Total Reimbursements',
    color: 'hsl(var(--chart-1))'
  },
  totalLeaves: {
    label: 'Total Leaves',
    color: 'hsl(var(--chart-2))'
  }
} satisfies ChartConfig;

export function LeaveReimbursementBarGraph() {
  const [activeChart, setActiveChart] = React.useState<
    keyof typeof chartConfig
  >('totalReimbursements');

  const total = React.useMemo(
    () => ({
      totalReimbursements: chartData.reduce(
        (acc, curr) => acc + curr.totalReimbursements,
        0
      ),
      totalLeaves: chartData.reduce((acc, curr) => acc + curr.totalLeaves, 0)
    }),
    []
  );

  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <Card>
      <CardHeader className='flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row'>
        <div className='flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6'>
          <CardTitle>Bar Chart</CardTitle>
          <CardDescription>
            Showing total reimbursements and leaves
          </CardDescription>
        </div>
        <div className='flex'>
          {['totalReimbursements', 'totalLeaves'].map((key) => {
            const chart = key as keyof typeof chartConfig;
            if (!chart || total[key as keyof typeof total] === 0) return null;

            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className='relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6'
                onClick={() => setActiveChart(chart)}
              >
                <span className='text-xs text-muted-foreground'>
                  {chartConfig[chart].label}
                </span>
                <span className='text-lg font-bold leading-none sm:text-3xl'>
                  {total[key as keyof typeof total]?.toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className='px-2 sm:p-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[280px] w-full'
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className='w-[150px]'
                  nameKey={
                    activeChart === 'totalReimbursements'
                      ? 'totalReimbursements'
                      : 'totalLeaves'
                  }
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    });
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
