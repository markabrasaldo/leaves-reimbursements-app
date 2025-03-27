'use client';

import { useState, useEffect } from 'react';
import { Label, Legend, Pie, PieChart } from 'recharts';
import { DataTable } from '@/components/ui/table/data-table';
import { Leave, LeavesResponse } from '@/features/leaves/types';
import { useSession } from 'next-auth/react';
import { columns } from './leaves-table/columns';
import { format } from 'date-fns';
import { Icons } from '@/components/icons';
import { downloadFile } from '@/lib/utils';
import { toTitleCase } from '@/lib/utils';

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
import { CHART_COLORS } from '@/features/overview/components/config';
import useRole from '@/hooks/use-role';

const ChartPieIcon = Icons.chartPie;
const LeavesTableViewIcon = Icons.table;
const SpreadSheetIcon = Icons.fileSpreadSheet;

const chartConfig = {
  sickLeave: {
    label: 'Sick Leave',
    color: CHART_COLORS.COLOR_SICK_LEAVE
  },
  vacationLeave: {
    label: 'Vacation Leave',
    color: CHART_COLORS.COLOR_VACATION_LEAVE
  },
  bereavementLeave: {
    label: 'Bereavement Leave',
    color: CHART_COLORS.COLOR_BEREAVEMENT_LEAVE
  },
  birthdayLeave: {
    label: 'Birthday Leave',
    color: CHART_COLORS.COLOR_BIRTHDAY_LEAVE
  },
  emergencyLeave: {
    label: 'Emergency Leave',
    color: CHART_COLORS.COLOR_EMERGENCY_LEAVE
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
  const [totalLeaves, setTotalLeaves] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [leavesList, setLeavesList] = useState<Leave[]>([
    {
      days_applied: 0,
      end_date: '',
      full_name: '',
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
    const startDate = dateRange?.startDate?.toLocaleDateString('en-CA');
    const endDate = dateRange?.endDate?.toLocaleDateString('en-CA');

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
      const startDate = dateRange?.startDate?.toLocaleDateString('en-CA');
      const endDate = dateRange?.endDate?.toLocaleDateString('en-CA');
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_LEAVE;
      const url = `${baseUrl}/${session?.user?.organization?.code}/leaves/approved-count?start_date=${startDate}&end_date=${endDate}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      let chartData = await response.json();

      chartData.data = chartData.data.map((leaves: any) => {
        return {
          type: leaves?.type,
          count: leaves?.count,
          fill: `var(--color-${leaves?.type})`
        };
      });

      const leaveBalance = await fetch(
        `${baseUrl}/${session?.user?.organization?.code}/users/${session?.user?.user_id}/leave-balances`,
        {
          headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const userLeaves = await leaveBalance.json();

      const userTotalLeaves = isAdmin
        ? chartData?.data?.reduce((acc: any, curr: any) => acc + curr.count, 0)
        : userLeaves?.leave_balances?.reduce(
            (acc: any, curr: any) => acc + curr.balance,
            0
          );

      setTotalEmployees(userTotalLeaves);

      const transformLeaveTypeValue = (str: string) => {
        return str
          .replace(/^\w/, (c: any) => c.toLowerCase())
          .replace(/\s+(\w)/g, (_: any, c: any) => c.toUpperCase());
      };

      const userChartData = session?.user?.leave_balances?.map(
        (leaves: any) => {
          return {
            type: transformLeaveTypeValue(leaves?.leave_type_name),
            count: leaves?.balance,
            fill: `var(--color-${transformLeaveTypeValue(
              leaves?.leave_type_name
            )})`
          };
        }
      );

      setChartData(isAdmin ? chartData.data : userChartData);
    };

    getChartData();
  }, [dateRange]);

  const formattedDate = new Date().toLocaleDateString('en-CA');

  const getLeavesCardLabel = () => {
    let label = `My leave balance as of `;
    if (isAdmin) {
      label = 'Employees on leave for:';
    }
    return label;
  };

  const exportToCSV = async () => {
    const startDate = dateRange?.startDate?.toLocaleDateString('en-CA');
    const endDate = dateRange?.endDate?.toLocaleDateString('en-CA');
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_LEAVE;
    const exportCSVURL = `${baseUrl}/${session?.user?.organization?.code}/leaves/export?start_date=${startDate}&end_date=${endDate}&status=APPROVED`;
    try {
      const response = await fetch(exportCSVURL, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken}`,
          'Content-Type': 'text/csv'
        }
      });

      if (!response.ok) throw new Error('Failed to download');
      downloadFile(`leaves_${startDate}_${endDate}`, 'csv', response);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  return (
    <Card className='flex flex-1 flex-col dark:bg-[#1E1E1E]/100'>
      <CardHeader className='items-center pb-0'>
        <CardTitle className='w-full'>
          <div className='m-auto flex w-full items-center'>
            <div className='flex-1'></div>{' '}
            <div className='flex-1 text-center font-semibold'>
              {getLeavesCardLabel()}
            </div>
            <div className='flex flex-1 justify-end gap-2 text-[#5b5454]'>
              <div
                onClick={() => flipCardContent()}
                className='cursor-pointer'
                title={`${isChartView ? 'Table View' : 'Chart View'}`}
              >
                {isChartView ? (
                  <>{isAdmin && <LeavesTableViewIcon />}</>
                ) : (
                  <ChartPieIcon />
                )}
              </div>
              <div
                onClick={() => exportToCSV()}
                className='cursor-pointer'
                title='Export to CSV'
              >
                <SpreadSheetIcon />
              </div>
            </div>
          </div>
        </CardTitle>
        <CardDescription>
          {format(formattedDate, 'LLLL, dd yyyy')}
        </CardDescription>
      </CardHeader>
      <CardContent className='mt-4 h-[500px] flex-1 pb-0'>
        {isChartView ? (
          <ChartContainer
            config={chartConfig}
            className='mx-auto aspect-square max-h-[360px]'
          >
            {chartData.length > 0 ? (
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Legend formatter={(value) => toTitleCase(value)} />
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
                              {totalEmployees}
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
            ) : (
              <div className='mt-2 text-center text-lg font-medium text-gray-600'>
                No one is on leave for the selected dates
              </div>
            )}
          </ChartContainer>
        ) : (
          <div id='pietable' className='h-[360px]'>
            <DataTable
              data-testid='leaves-table-view'
              columns={columns}
              data={leavesList}
              totalItems={leavesList?.length}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
