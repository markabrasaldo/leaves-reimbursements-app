'use client';

import { useState, useMemo, useEffect } from 'react';
import { Label, Pie, PieChart } from 'recharts';
import { DataTable } from '@/components/ui/table/data-table';
import { Leave, LeavesResponse } from '@/features/leaves/types';
import { useSession } from 'next-auth/react';
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

const chartConfig = {
  sickLeave: {
    label: 'Sick Leave',
    color: '#E57373'
  },
  vacationLeave: {
    label: 'Vacation Leave',
    color: '#64B5F6'
  },
  bereavementLeave: {
    label: 'Bereavement Leave',
    color: '#B0B0B0'
  },
  birthdayLeave: {
    label: 'Birthday Leave',
    color: '#D291BC'
  },
  emergencyLeave: {
    label: 'Emergency Leave',
    color: '#E6A86D'
  },
  present: {
    label: 'Present',
    color: '#81C784'
  }
} satisfies ChartConfig;

export function LeavesPieGraph({ dateRange }: any) {
  const { data: session } = useSession();
  const { isAdmin } = useRole();
  const [isChartView, setIsChartView] = useState<boolean>(true);
  const [chartData, setChartData] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
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
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_LEAVE;
    const startDate = dateRange?.startDate.toISOString().split('T')[0];
    const endDate = dateRange?.endDate.toISOString().split('T')[0];
    const url = `${baseUrl}/${session?.user?.organization?.code}/leaves?page=1&sort_by=status&order=desc&status=APPROVED&limit=100&start_date=${startDate}&end_date=${endDate}`;

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
    const leavesData = leaves.data ? leaves.data : [];
    setLeavesList(leavesData);
  };

  useEffect(() => {
    const getChartData = async () => {
      const startDate = dateRange?.startDate.toISOString().split('T')[0];
      const endDate = dateRange?.endDate.toISOString().split('T')[0];
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_LEAVE;
      const url = `${baseUrl}/${session?.user?.organization?.code}/leaves/approved-count?start_date=${startDate}&end_date=${endDate}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      let chartData = await response.json();
      chartData.data = chartData.data.map((leaves) => {
        return {
          type: leaves?.type,
          count: leaves?.count,
          fill: `var(--color-${leaves?.type})`
        };
      });
      const totalEmployees = chartData?.data?.reduce(
        (acc, curr) => acc + curr.count,
        0
      );
      setTotalEmployees(totalEmployees);
      setChartData(chartData.data);
    };
    getChartData();
  }, [dateRange]);

  const getLeavesCardLabel = () => {
    let label = 'My Leaves';
    if (isAdmin) {
      label = 'Attendance for:';
    }

    if (isAdmin && !isChartView) {
      label = 'Employees on leave for:';
    }
    return label;
  };

  return (
    <Card className='flex flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle className='w-full'>
          <div className='m-auto flex w-full justify-between'>
            <div></div>
            <div className='inline-block'>{`${getLeavesCardLabel()}`}</div>
            <div className='float-right mr-[0.25rem] flex'>
              <div onClick={() => flipCardContent()} className='text-[#5b5454]'>
                {isChartView ? <LeavesTableViewIcon /> : <ChartPieIcon />}
              </div>
              <div className='text-[#5b5454]'>
                <SpreadSheetIcon />
              </div>
            </div>
          </div>
        </CardTitle>
        <CardDescription>
          {dateRange && (
            <>
              <span>{format(dateRange?.startDate, 'LLL-dd-yyyy')}</span>
              <span className='mx-[0.25rem]'>to</span>
              <span>{format(dateRange?.endDate, 'LLL-dd-yyyy')}</span>
            </>
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
                nameKey='type'
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
                            {isAdmin ? totalEmployees : 12}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className='fill-muted-foreground'
                          >
                            Total Employees
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
              totalItems={leavesList?.length}
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
