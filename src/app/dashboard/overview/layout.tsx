import { getSessionDetails } from '@/app/utils/getSessionDetails';
import PageContainer from '@/components/layout/page-container';
import { dashboardCardItems, userCardItems } from '@/constants/data';
import { InfoCard } from '@/features/overview/components/info-card';
import React from 'react';

export default async function OverViewLayout({
  sales,
  pie_stats,
  bar_stats,
  area_stats,
  employees,
  reimbursements,
  leaves,
  leave_balance
}: {
  sales: React.ReactNode;
  pie_stats: React.ReactNode;
  bar_stats: React.ReactNode;
  area_stats: React.ReactNode;
  employees: React.ReactNode;
  reimbursements: React.ReactNode;
  leaves: React.ReactNode;
  leave_balance: React.ReactNode;
}) {
  const { role } = await getSessionDetails();

  const isAdmin = role && role.valueOf() === 'Administrator';

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-2'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Hi, Welcome back 👋
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
              <div className='col-span-4 grid auto-rows-fr'>
                {reimbursements}
              </div>
              <div className='col-span-4 grid auto-rows-fr md:col-span-3'>
                {leaves}
              </div>
              <div className='col-span-4 grid auto-rows-fr'>{employees}</div>
              <div className='col-span-4 grid auto-rows-fr md:col-span-3'>
                {pie_stats}
              </div>
              <div className='col-span-4'>{bar_stats}</div>
            </>
          ) : (
            <>
              <div className='col-span-4 grid auto-rows-fr'>{leaves}</div>
              <div className='col-span-4 grid auto-rows-fr md:col-span-3'>
                {reimbursements}
              </div>
              <div className='col-span-4'>{leave_balance}</div>
            </>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
