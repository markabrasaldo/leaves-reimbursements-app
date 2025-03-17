import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { searchParamsCache, serialize } from '@/lib/searchparams';
import LeavesListPage from '@/features/leaves/components/leave-table-list';
import { SearchParams } from 'nuqs/server';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import TableAction from '@/components/table/table-action';
import { Heading } from '@/components/ui/heading';

export const metadata = {
  title: 'Dashboard: Leave'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  // This key is used for invoke suspense if any of the search params changed (used for filters).
  const key = serialize({ ...searchParams });

  const FILTER_STATUS_OPTIONS = [
    { value: 'DRAFT', label: 'Draft' },
    { value: 'SUBMITTED', label: 'Submitted' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'REJECTED', label: 'Rejected' },
    { value: 'REIMBURSED', label: 'Reimbursed' }
  ];

  const FILTER_LEAVE_OPTIONS = [
    { value: 'Vacation Leave', label: 'Vacation Leave' },
    { value: 'Birthday Leave', label: 'Birthday Leave' },
    { value: 'Sick Leave', label: 'Sick Leave' },
    { value: 'Berievement Leave', label: 'Berievement Leave' }
  ];

  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading title='Leaves' description='Manage leaves' />
          <Link
            href='/dashboard/leave/new'
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            <Plus className='mr-2 h-4 w-4' /> Add New
          </Link>
        </div>
        <Separator />
        <TableAction
          filterStatusOption={FILTER_STATUS_OPTIONS}
          filterLeaveOption={FILTER_LEAVE_OPTIONS}
        />
        <Suspense
          key={key}
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <LeavesListPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
