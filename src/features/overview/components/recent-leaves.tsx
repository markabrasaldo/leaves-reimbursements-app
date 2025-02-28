import { getSessionDetails } from '@/app/utils/getSessionDetails';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Leave, LeavesResponse } from '@/features/leaves/types';
import { cn } from '@/lib/utils';
import getConfig from 'next/config';
import Link from 'next/link';
import { Roles } from 'types';

const { publicRuntimeConfig } = getConfig();
const baseUrl = publicRuntimeConfig.baseUrlLeave;

async function getLeaves(): Promise<LeavesResponse> {
  const { accessToken, organization, role, user_id } =
    await getSessionDetails();

  const url = new URL(
    role === ('Member' as unknown as Roles)
      ? `${baseUrl}/${organization?.code}/users/${user_id}/leaves`
      : `${baseUrl}/${organization?.code}/leaves`
  );

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  const leaveList = await response.json();

  if (!response.ok) {
    throw new Error(leaveList.error || 'Failed to fetch leave');
  }

  const { data, message } = leaveList;

  return {
    data,
    message
  };
}

export async function LeavesList() {
  const { data: leaveList } = await getLeaves();

  return (
    <Card>
      <CardHeader className='flex flex-row place-content-between items-center'>
        <CardTitle>Leave Requests</CardTitle>
        <Link
          href='/dashboard/leave'
          className={cn(
            buttonVariants({ variant: 'link' }),
            'mt-0 space-y-0 p-0'
          )}
        >
          View All
        </Link>
      </CardHeader>
      <CardContent>
        <div className='space-y-8'>
          {leaveList.slice(0, 5).map((leave: Leave) => {
            return (
              <div className='flex items-center' key={leave.id}>
                <div className='ml-4 space-y-1'>
                  <p className='text-base font-medium leading-none'>
                    {leave.leave_type.name}
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    {`${leave.start_date} - ${leave.end_date}`}
                  </p>
                </div>
                <div className='ml-auto font-medium'>{leave.status}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
