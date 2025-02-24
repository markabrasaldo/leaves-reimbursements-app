import { buttonVariants } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Reimbursement } from '@/features/reimbursements/types';
import { cn } from '@/lib/utils';
import getConfig from 'next/config';
import Link from 'next/link';

async function getReimbursements(): Promise<Reimbursement[]> {
  try {
    const { publicRuntimeConfig } = getConfig();
    const baseUrl = publicRuntimeConfig.baseUrl;

    const response = await fetch(`${baseUrl}/api/${'ORG001'}/reimbursement`);

    const reimbursementList = await response.json();

    return reimbursementList.reimbursements;
  } catch (error) {
    throw new Error('Failed to fetch reimbursements');
  }
}

export async function ReimbursementsList() {
  const reimbursementsList = await getReimbursements();

  return (
    <Card>
      <CardHeader className='flex flex-row place-content-between items-center'>
        <CardTitle>Reimbursements History</CardTitle>
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
                  <p className='text-sm font-medium leading-none'>
                    {reimbursement.reimbursement_type.name}
                  </p>
                  <p className='text-sm text-muted-foreground'>
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
