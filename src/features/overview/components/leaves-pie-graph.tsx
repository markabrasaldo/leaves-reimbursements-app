'use client';

import { useState, useMemo } from 'react';
import { Label, Pie, PieChart } from 'recharts';
import { DataTable } from '@/components/ui/table/data-table';
import { Leave, LeavesResponse } from '@/features/leaves/types';
import { getSession, useSession } from 'next-auth/react';
import { columns } from './leaves-table/columns';
import { format } from 'date-fns';
import { Icons } from '@/components/icons';

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
import useRole from '@/hooks/use-role';

const ChartPieIcon = Icons.chartPie;
const LeavesTableViewIcon = Icons.table;
const SpreadSheetIcon = Icons.fileSpreadSheet;
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

export function LeavesPieGraph({ dateRange }: any) {
  const { data: session } = useSession();
  const { isAdmin } = useRole();
  const [isChartView, setIsChartView] = useState<boolean>(true);
  const totalVisitors = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, []);
  const [leavesList, setLeavesList] = useState<Leave[]>([
    {
      days_applied: 0,
      end_date: '',
      google_event_id: '',
      id: '',
      leave_type: {
        id: '',
        name: '',
        color: '',
        descriptions: '',
        icon: ''
      },
      organization_name: '',
      start_date: '',
      status: '',
      user_email: '',
      user_id: '',
      remarks: '',
      descriptions: ''
    }
  ]);

  const flipCardContent = () => {
    if (isChartView) {
      showLeavesInTable();
    }
    setIsChartView(!isChartView);
  };

  async function getLeaves(): Promise<LeavesResponse> {
    const baseUrl = 'https://leave-service.fly.dev';
    const url = `${baseUrl}/${session?.user?.organization?.code}/leaves?page=1&sort_by=status&order=desc&status=APPROVED&limit=100&start_date=${dateRange.startDate}&end_date=${dateRange?.endDate}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${session?.user?.accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    const leaveList = await response.json();

    if (!response.ok) {
      throw new Error(leaveList.error || 'Failed to fetch leave');
    }

    const { data, message, meta } = leaveList;

    return {
      data,
      message,
      meta
    };
  }

  const showLeavesInTable = async () => {
    const leaves = await getLeaves();
    setLeavesList(leaves.data);
  };

  return (
    <Card className='flex flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle className='w-full'>
          <div className='m-auto flex w-full justify-between'>
            <div></div>
            <div className='inline-block'>{`${isAdmin ? 'Attendance' : 'My Leaves'} for: `}</div>
            <div className='float-right mr-[0.25rem] flex'>
              <div onClick={() => flipCardContent()}>
                {isChartView ? <LeavesTableViewIcon /> : <ChartPieIcon />}
              </div>
              <div>
                <SpreadSheetIcon />
              </div>
            </div>
          </div>
        </CardTitle>
        <CardDescription>
          {dateRange && (
            <div>
              <span>{format(dateRange.startDate, 'LLL-dd-yyyy')}</span>
              <span className='mx-[0.25rem]'>to</span>
              <span>{format(dateRange.endDate, 'LLL-dd-yyyy')}</span>
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className='mt-4 flex-1 pb-0'>
        {isChartView ? (
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
                            {isAdmin ? totalVisitors.toLocaleString() : 12}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className='fill-muted-foreground'
                          >
                            Total Leaves
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        ) : (
          <div id='pietable' className='h-full'>
            <DataTable
              data-testid='leaves-table-view'
              columns={columns}
              data={leavesList}
              totalItems={leavesList.length}
            />
          </div>
        )}
      </CardContent>
      {/* <CardFooter className='flex-col gap-2 text-sm'>
        <div className='flex items-center gap-2 font-medium leading-none'>
          {`${isAdmin ? 'Showing total attendance for the last 6 months' : `This ${'6 months'} leaves count`}`}
        </div>
      </CardFooter> */}
    </Card>
  );
}
