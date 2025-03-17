'use client';

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

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
  { month: 'January', amountRequested: 186, amountReimbursed: 80 },
  { month: 'February', amountRequested: 305, amountReimbursed: 200 },
  { month: 'March', amountRequested: 237, amountReimbursed: 120 },
  { month: 'April', amountRequested: 73, amountReimbursed: 190 },
  { month: 'May', amountRequested: 209, amountReimbursed: 130 },
  { month: 'June', amountRequested: 214, amountReimbursed: 140 }
];

const chartConfig = {
  amountRequested: {
    label: 'Amount Requested',
    color: 'hsl(var(--chart-1))'
  },
  amountReimbursed: {
    label: 'Amount Reimbursed',
    color: 'hsl(var(--chart-2))'
  }
} satisfies ChartConfig;

export function ReimbursementAreaGraph() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reimbursements</CardTitle>
        <CardDescription>
          Showing reimbursements for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[310px] w-full'
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='month'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator='dot' />}
            />
            <Area
              dataKey='amountReimbursed'
              type='natural'
              fill='var(--color-amountReimbursed)'
              fillOpacity={0.4}
              stroke='var(--color-amountReimbursed)'
              stackId='a'
            />
            <Area
              dataKey='amountRequested'
              type='natural'
              fill='var(--color-amountRequested)'
              fillOpacity={0.4}
              stroke='var(--color-amountRequested)'
              stackId='a'
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className='flex w-full items-start gap-2 text-sm'>
          <div className='grid gap-2'>
            <div className='flex items-center gap-2 leading-none text-muted-foreground'>
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
