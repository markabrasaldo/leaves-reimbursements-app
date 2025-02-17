import PageContainer from '@/components/layout/page-container';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import { searchParamsCache, serialize } from '@/lib/searchparams';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { leaves } from '@/constants/mock-api';
import getConfig from 'next/config';
import { LeaveCard } from '@/features/leave/components/leave-card';
import { DataTable } from '@/features/leave/components/leave-table';
import { columns } from '@/features/leave/components/table-columns';

// use when endpoint is available
async function getLeaveList(organization_code: string) {
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = publicRuntimeConfig.baseUrl;
  const res = await fetch(`${baseUrl}/leaves`);

  return res.json();
}

async function getLeaveTypes() {
  // const data = await getLeaveList();

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const leaveList = await leaves;

  return {
    leaveTypes: [
      {
        id: 'vacation',
        name: 'Vacation',
        color: 'bg-blue-100',
        description: 'Time off for rest, travel, or personal activities',
        icon: 'Umbrella'
      },
      {
        id: 'sick',
        name: 'Sick Leave',
        color: 'bg-red-100',
        description: 'Time off due to illness or medical appointments',
        icon: 'Stethoscope'
      },
      {
        id: 'personal',
        name: 'Personal Leave',
        color: 'bg-green-100',
        description: 'Time off for personal matters or emergencies',
        icon: 'User'
      }
    ],
    leaveList
  };
}

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const { leaveTypes, leaveList } = await getLeaveTypes();

  const searchParams = await props.searchParams;

  searchParamsCache.parse(searchParams);

  const key = serialize({ ...searchParams });

  return (
    <PageContainer>
      <div className='container'>
        <Suspense
          key={key}
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <LeaveCard data={leaveTypes} />
        </Suspense>

        <Suspense
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <DataTable columns={columns} data={leaveList} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
