import PageContainer from '@/components/layout/page-container';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import { searchParamsCache, serialize } from '@/lib/searchparams';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { LeaveCard } from '@/features/leave/components/leave-card';
import { DataTable } from '@/features/leave/components/leave-table';
import { columns } from '@/features/leave/components/table-columns';

async function getLeaveList(organizationCode: string) {
  const res = await fetch(
    `http://localhost:3000/api/${organizationCode}/leave`,
    {
      cache: 'no-store'
    }
  );

  return res.json();
}

async function getLeaveTypes() {
  const response = await fetch('http://localhost:3000/api/leave-type', {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch leave types');
  }

  return response.json();
}

export default async function Page() {
  const leaveList = await getLeaveList('1');
  const leaveTypes = await getLeaveTypes();

  return (
    <PageContainer>
      <div className='container'>
        <Suspense
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <LeaveCard initialLeaveTypes={leaveTypes} />
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
