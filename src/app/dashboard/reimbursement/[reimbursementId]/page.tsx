import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import ReimbursementViewPage from '@/features/reimbursements/components/reimbursement-view-page';
import getConfig from 'next/config';
import { getSessionDetails } from '@/app/utils/getSessionDetails';

export const metadata = {
  title: 'Dashboard : Reimbursement View'
};

type PageProps = { params: Promise<{ reimbursementId: string }> };

const { publicRuntimeConfig } = getConfig();
const baseUrl = publicRuntimeConfig.baseUrlReimbursement;

async function getReimbursementTypes() {
  const { accessToken, organization } = await getSessionDetails();

  const response = await fetch(
    `${baseUrl}/${organization?.code}/reimbursement-type`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      cache: 'force-cache'
    }
  );

  const reimbursementTypeList = await response.json();

  if (!response.ok) {
    throw new Error(
      reimbursementTypeList.error || 'Failed to fetch reimbursement types'
    );
  }

  return reimbursementTypeList;
}

export default async function Page(props: PageProps) {
  const reimbursementTypes = await getReimbursementTypes();
  const params = await props.params;

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <ReimbursementViewPage
            reimbursementTypesData={reimbursementTypes?.data}
            reimbursementId={params.reimbursementId}
          />
        </Suspense>
      </div>
    </PageContainer>
  );
}
