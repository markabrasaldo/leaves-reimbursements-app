import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { reimbursement } from '@/constants/mock-api';
import { cn } from '@/lib/utils';
import getConfig from 'next/config';
import Link from 'next/link';

// use when endpoint is available
async function getReimbursements(organization_code: string) {
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = publicRuntimeConfig.baseUrl;
  const res = await fetch(`${baseUrl}/${organization_code}/reimbursements/`);

  return res.json();
}

export async function ReimbursementsList() {
  // const data = await getReimbursements('organization_code');

  const reimbursementsList = await reimbursement;

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
          {reimbursementsList.map((reimbursement) => {
            return (
              <div className='flex items-center' key={reimbursement.id}>
                <div className='ml-4 space-y-1'>
                  <p className='text-sm font-medium leading-none'>
                    {reimbursement.reimbursementType.name}
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
