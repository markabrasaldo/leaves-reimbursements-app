import { getSessionDetails } from '@/app/utils/getSessionDetails';
import PageContainer from '@/components/layout/page-container';
import { userCardItems } from '@/constants/data';
import { InfoCard } from '@/features/overview/components/info-card';
import getConfig from 'next/config';
import React from 'react';
import { CardItem } from 'types';
import { DashboardStatisticsResponse } from './types';

async function getDashboardStatistics(
  accessToken: any,
  organization: any
): Promise<DashboardStatisticsResponse> {
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = publicRuntimeConfig.baseUrlLeave;

  const response = await fetch(
    `${baseUrl}/dashboard/statistics/${organization?.code}
`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      cache: 'force-cache'
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard data');
  }

  const statistics = await response.json();

  return statistics.data;
}

export default async function OverViewLayout({
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
  const { accessToken, email, organization, role } = await getSessionDetails();
  const statistics = await getDashboardStatistics(accessToken, organization);

  const isAdmin = role && role.valueOf() === 'Administrator';
  const dashboardCardItems: CardItem[] = [
    {
      cardTitle: 'Pending Leaves Requests',
      cardValue: statistics?.leaves?.submitted ?? 0,
      cardIcon: 'clock'
    },
    {
      cardTitle: 'Approved Leaves',
      cardValue: statistics?.leaves?.approved ?? 0,
      cardIcon: 'checkCircle'
    },
    {
      cardTitle: 'Pending Reimbursements',
      cardValue: statistics?.reimbursements?.approved ?? 0,
      cardIcon: 'reimbursement'
    },
    {
      cardTitle: 'Approved Reimbursements',
      cardValue: statistics?.reimbursements?.approved ?? 0,
      cardIcon: 'receipt'
    }
  ];

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-2'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Hi {email}, Welcome back 👋
          </h2>
        </div>
        <div className='grid gap-4 overflow-x-auto md:grid-cols-2 lg:grid-cols-4'>
          {isAdmin ? (
            <>
              {dashboardCardItems.map((item, key) => {
                return <InfoCard {...item} key={key} />;
              })}
            </>
          ) : (
            <>
              {userCardItems.map((item, key) => {
                return <InfoCard {...item} key={key} />;
              })}
            </>
          )}
        </div>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
          {isAdmin ? (
            <>
              <div className='col-span-4'>{reimbursement_area_stats}</div>
              <div className='col-span-4 grid auto-rows-fr md:col-span-3'>
                {leaves_pie_stats}
              </div>
              <div className='col-span-4'>{reimbursement_bar_stats}</div>
              <div className='col-span-4 grid auto-rows-fr md:col-span-3'>
                {employees}
              </div>
            </>
          ) : (
            <>
              <div className='col-span-4'>{reimbursement_area_stats}</div>
              <div className='col-span-4 grid auto-rows-fr md:col-span-3'>
                {leaves_pie_stats}
              </div>
              <div className='col-span-4'>{leave_balance}</div>
            </>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
