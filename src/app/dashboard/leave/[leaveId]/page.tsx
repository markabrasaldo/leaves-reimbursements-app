import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import { getSessionDetails } from '@/app/utils/getSessionDetails';
import getConfig from 'next/config';
import LeaveViewPage from '@/features/leaves/components/leave-view-page';

export const metadata = {
  title: 'Dashboard : Leave View'
};

type PageProps = { params: Promise<{ leaveId: string }> };

const { publicRuntimeConfig } = getConfig();
const baseUrl = publicRuntimeConfig.baseUrlLeave;

async function getLeaveTypes() {
  const { accessToken, organization } = await getSessionDetails();

  const response = await fetch(`${baseUrl}/${organization?.code}/leave-types`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    cache: 'force-cache'
  });

  if (!response.ok) {
    throw new Error('Failed to fetch leave types');
  }

  const leaveTypeList = await response.json();

  return leaveTypeList.leave_types;
}

export default async function Page(props: PageProps) {
  const leaveTypes = await getLeaveTypes();

  const params = await props.params;

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <LeaveViewPage leaveTypesData={leaveTypes} leaveId={params.leaveId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
