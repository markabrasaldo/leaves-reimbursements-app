import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import ReimbursementViewPage from '@/features/reimbursements/components/reimbursement-view-page';

export const metadata = {
  title: 'Dashboard : Reimbursement View'
};

type PageProps = { params: Promise<{ reimbursementId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <ReimbursementViewPage reimbursementId={params.reimbursementId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
