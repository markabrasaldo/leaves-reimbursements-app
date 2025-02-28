import { notFound } from 'next/navigation';
import getConfig from 'next/config';
import { LeaveForm } from './leave-form';
import { Leave, LeaveType } from '../types';
import { getSessionDetails } from '@/app/utils/getSessionDetails';

type TReimbursementViewPageProps = {
  leaveTypesData: LeaveType[];
  leaveId: string;
};

const { publicRuntimeConfig } = getConfig();
const baseUrl = publicRuntimeConfig.baseUrlLeave;

async function getLeaveById(leaveId: string) {
  const { accessToken, organization } = await getSessionDetails();

  const response = await fetch(
    `${baseUrl}/${organization?.code}/leaves/${leaveId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );

  const leave = await response.json();

  if (!response.ok) {
    throw new Error(leave.error || 'Failed to fetch leaveId');
  }

  const { data, message } = leave;

  return {
    data,
    message
  };
}

export default async function TReimbursementViewPageProps({
  leaveTypesData,
  leaveId
}: TReimbursementViewPageProps) {
  let leave = null;
  let pageTitle = 'Create New Leave';

  if (leaveId !== 'new') {
    const { data } = await getLeaveById(leaveId);

    leave = data as Leave;
    if (!leave) {
      notFound();
    }
    if (data?.status === 'DRAFT') pageTitle = `Edit Leave`;
    pageTitle = 'Leave Request';
  }

  return (
    <LeaveForm
      leaveTypesData={leaveTypesData}
      initialData={leave}
      pageTitle={pageTitle}
    />
  );
}
