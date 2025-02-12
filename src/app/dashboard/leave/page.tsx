import PageContainer from '@/components/layout/page-container';
import { LeaveTypeCard } from '@/features/leave/components/leave-type-card';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import { searchParamsCache, serialize } from '@/lib/searchparams';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';

async function getLeaveTypes() {
  await new Promise((resolve) => setTimeout(resolve, 1000));

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
    ]
  };
}

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function LeavePage(props: pageProps) {
  const { leaveTypes } = await getLeaveTypes();

  const searchParams = await props.searchParams;

  searchParamsCache.parse(searchParams);

  const key = serialize({ ...searchParams });

  return (
    <PageContainer>
      <div className='container mx-auto px-4 py-8'>
        <h1 className='mb-6 text-2xl font-bold'>Request Leave</h1>
        <Suspense
          key={key}
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <LeaveTypeCard data={leaveTypes} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
