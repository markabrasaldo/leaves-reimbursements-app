import { getSessionDetails } from '@/app/utils/getSessionDetails';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { ReimbursementsResponse } from '@/features/reimbursements/types';
import { cn } from '@/lib/utils';
import getConfig from 'next/config';
import Link from 'next/link';

const { publicRuntimeConfig } = getConfig();
const baseUrl = publicRuntimeConfig.baseUrlReimbursement;

async function getReimbursements(): Promise<ReimbursementsResponse> {
  const { accessToken, organization } = await getSessionDetails();

  // Todo: fetch must be by user/userid when role is member
  const response = await fetch(
    `${baseUrl}/${organization?.code}/reimbursement`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );

  const reimbursementList = await response.json();

  if (!response.ok) {
    throw new Error(reimbursementList.error || 'Failed to fetch reimbursement');
  }

  const { data, message } = reimbursementList;

  return {
    data,
    message
  };
}

export async function ReimbursementsList() {
  const { data: reimbursementsList } = await getReimbursements();

  return (
    <Card>
      <CardHeader className='flex flex-row place-content-between items-center'>
        <CardTitle>Reimbursements Requests</CardTitle>
        <Link
          href='/dashboard/reimbursement'
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
          {reimbursementsList.slice(0, 5).map((reimbursement) => {
            return (
              <div className='flex items-center' key={reimbursement.id}>
                <div className='ml-4 space-y-1'>
                  <p className='text-base font-medium leading-none'>
                    {/* {reimbursement.reimbursement_type.name} */}
                    {(reimbursement as any).reimbursement_type_code}
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    {reimbursement.status}
                  </p>
                </div>
                <div className='ml-auto font-medium'>
                  &#8369;{`${reimbursement.amount}`}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
