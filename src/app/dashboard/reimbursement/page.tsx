import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { searchParamsCache, serialize } from '@/lib/searchparams';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import ReimbursementListPage from '@/features/reimbursements/components/reimbursement-table-list';
import TableAction from '@/components/table/table-action';
// import UploadCSV from '@/features/leaves/components/upload-csv';
import { getSessionDetails } from '@/app/utils/getSessionDetails';
import { Roles } from 'next-auth';

export const metadata = {
  title: 'Dashboard: Reimbursement'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);
  const { role } = await getSessionDetails();
  const isAdmin = role === ('Administrator' as unknown as Roles);

  // This key is used for invoke suspense if any of the search params changed (used for filters).
  const key = serialize({ ...searchParams });

  const FILTER_STATUS_OPTIONS = [
    { value: 'DRAFT', label: 'Draft' },
    { value: 'SUBMITTED', label: 'Submitted' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'REJECTED', label: 'Rejected' },
    { value: 'REIMBURSED', label: 'Reimbursed' }
  ];

  const FILTER_REIMBURSEMENT_OPTIONS = [
    { value: 'Travel Expenses', label: 'Travel Expenses' },
    { value: 'Food', label: 'Food' },
    { value: 'Miscellaneous', label: 'Miscellaneous' }
  ];

  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading title='Reimbursements' description='Manage reimbursements' />
          <div className='flex items-center gap-2'>
            {/* {isAdmin && <UploadCSV />} */}
            <Link
              href='/dashboard/reimbursement/new'
              className={cn(buttonVariants(), 'text-xs md:text-sm')}
            >
              <Plus className='mr-2 h-4 w-4' /> Add New
            </Link>
          </div>
        </div>
        <Separator />
        <TableAction
          filterStatusOption={FILTER_STATUS_OPTIONS}
          filterReimbursementOption={FILTER_REIMBURSEMENT_OPTIONS}
        />
        <Suspense
          key={key}
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <ReimbursementListPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
