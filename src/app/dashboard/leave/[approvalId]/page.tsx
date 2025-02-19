import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';

import { leaves } from '@/constants/mock-api';
import { LeaveApprovalCard } from '@/features/leave/components/leave-approval-card';
import { Suspense } from 'react';

async function getLeaveTypes() {
  // const data = await getLeaveList();

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const leaveList = await leaves;

  return {
    leaveList
  };
}

type PageProps = { params: Promise<{ approvalId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;

  const { leaveList } = await getLeaveTypes();

  const getDataById = leaveList?.filter(
    (leave) => leave.id === Number(params.approvalId)
  )?.[0];

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <LeaveApprovalCard data={getDataById} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
