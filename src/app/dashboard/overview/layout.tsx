'use client';
import PageContainer from '@/components/layout/page-container';
import DateRangePicker from '@/components/ui/date-range-picker';
import { EventCalendar } from '@/components/calendar/event-calendar';
import { userCardItems } from '@/constants/data';
import { InfoCard } from '@/features/overview/components/info-card';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { CardItem } from 'types';
import { DashboardStatisticsResponse } from './types';
import { DateRangeProvider } from '@/components/providers/date-range-picker-provider';
import { LeavesPieGraph } from '@/features/overview/components/leaves-pie-graph';
import { ReimbursementGroupedBarGraph } from '@/features/overview/components/reimbursements-grouped-bar';

export default function OverViewLayout({
  sales,
  leaves_pie_stats,
  reimbursement_bar_stats,
  reimbursement_area_stats,
  employees,
  reimbursements,
  leaves,
  leave_balance
}: {
  sales: React.ReactNode;
  leaves_pie_stats: React.ReactNode;
  reimbursement_bar_stats: React.ReactNode;
  reimbursement_area_stats: React.ReactNode;
  area_stats: React.ReactNode;
  employees: React.ReactNode;
  reimbursements: React.ReactNode;
  leaves: React.ReactNode;
  leave_balance: React.ReactNode;
}) {
  const { data: session } = useSession();
  const [statistics, setStatistics] = useState<DashboardStatisticsResponse>();
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: new Date(),
    endDate: new Date()
  });

  const dashboardCardItems: CardItem[] = [
    {
      cardTitle: 'Pending Leaves Requests',
      cardValue: statistics?.leaves?.submitted ?? 0,
      cardIcon: 'clock',
      cardIconColor: '#e8c468',
      className: 'dark:text-white bg-[#e8c468] text-[#5b5454]',
      redirectTo: { page: 'leave', status: 'SUBMITTED' }
    },
    {
      cardTitle: 'Approved Leaves',
      cardValue: statistics?.leaves?.approved ?? 0,
      cardIcon: 'checkCircle',
      className: 'dark:text-white bg-[#4fc680]/100 text-[#5b5454]',
      redirectTo: { page: 'leave', status: 'APPROVED' }
    },
    {
      cardTitle: 'Pending Reimbursements',
      cardValue: statistics?.reimbursements?.submitted ?? 0,
      cardIcon: 'reimbursement',
      className: 'dark:text-white bg-[#e8c468] text-[#5b5454]',
      redirectTo: { page: 'reimbursement', status: 'SUBMITTED' }
    },
    {
      cardTitle: 'Approved Reimbursements',
      cardValue: statistics?.reimbursements?.approved ?? 0,
      cardIcon: 'receipt',
      className: 'dark:text-white bg-[#4fc680]/100 text-[#5b5454]',
      redirectTo: { page: 'reimbursement', status: 'APPROVED' }
    }
  ];

  async function getDashboardStatistics(
    accessToken: any,
    organization: any,
    startDate?: any,
    endDate?: any
  ): Promise<DashboardStatisticsResponse> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_DASHBOARD;
    if (!startDate && !endDate) {
      startDate = new Date();
      endDate = new Date();
    }

    startDate = startDate.toLocaleDateString('en-CA');
    endDate = endDate.toLocaleDateString('en-CA');

    const dateRangeFilter = `?start_date=${startDate}&end_date=${endDate}`;
    const response = await fetch(
      `${baseUrl}/dashboard/statistics/${organization}${dateRangeFilter}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-cache',
        credentials: 'include'
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard data');
    }

    const statistics = await response.json();

    setStatistics(statistics.data);
    return statistics.data;
  }

  useEffect(() => {
    const checkSession = async () => {
      await getSession();
    };
    checkSession();
  }, []);

  useEffect(() => {
    const getDashboardData = async () => {
      await getDashboardStatistics(
        session?.user?.accessToken,
        session?.user?.organization?.code,
        selectedDateRange.startDate,
        selectedDateRange.endDate
      );
    };
    if (selectedDateRange) {
      getDashboardData();
    }
  }, [selectedDateRange]);

  return (
    <DateRangeProvider>
      <PageContainer>
        <div className='flex flex-1 flex-col space-y-2'>
          <div className='flex items-center justify-between space-y-2'>
            <h2 className='text-2xl font-bold tracking-tight'>
              Hi {session?.user?.first_name}!
            </h2>
          </div>
          <div className='py-[0.25rem]'>
            <label className='flex items-center gap-2 py-[0.25rem] text-sm text-gray-600 dark:text-white'>
              Showing data for:
            </label>
            <DateRangePicker onChange={(data) => setSelectedDateRange(data)} />
          </div>
          <div className='grid gap-4 overflow-x-auto py-[1.75rem] md:grid-cols-2 lg:grid-cols-4'>
            {dashboardCardItems.map((item, key) => {
              return <InfoCard {...item} key={key} />;
            })}
          </div>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
            <div className='col-span-4 flex gap-4'>
              <ReimbursementGroupedBarGraph dateRange={selectedDateRange} />
            </div>
            <div className='col-span-4 flex gap-4 md:col-span-3'>
              <LeavesPieGraph dateRange={selectedDateRange} />
            </div>
            <div className='col-span-full mt-4'>
              <EventCalendar
                dateRange={selectedDateRange}
                title={'Approved Leaves'}
              />
            </div>
          </div>
        </div>
      </PageContainer>
    </DateRangeProvider>
  );
}
