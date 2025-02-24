import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import ReimbursementViewPage from '@/features/reimbursements/components/reimbursement-view-page';

export const metadata = {
  title: 'Dashboard : Reimbursement View'
};

type PageProps = { params: Promise<{ reimbursementId: string }> };

async function getReimbursementTypes() {
  const response = await fetch(
    'http://localhost:3000/api/ORG001/reimbursement-type',
    {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch leave types');
  }

  return response.json();
}

export default async function Page(props: PageProps) {
  const reimbursementTypesData = await getReimbursementTypes();
  const params = await props.params;

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <ReimbursementViewPage
            reimbursementTypesData={reimbursementTypesData}
            reimbursementId={params.reimbursementId}
          />
        </Suspense>
      </div>
    </PageContainer>
  );
}
