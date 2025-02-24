'use client';

import GoogleCalendar from '@/components/calendar/calendar';
import { buttonVariants } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { leaves } from '@/constants/mock-api';
import { cn } from '@/lib/utils';
import getConfig from 'next/config';
import Link from 'next/link';

// use when endpoint is available
// async function getReimbursements(organization_code: string) {
//   const { publicRuntimeConfig } = getConfig();
//   const baseUrl = publicRuntimeConfig.baseUrl;
//   const res = await fetch(`${baseUrl}/${organization_code}/reimbursements/`);

//   return res.json();
// }

export function LeavesList() {
  // const data = await getReimbursements('organization_code');

  // const leaveList = await leaves;

  // const formatDate = (dateString: string): string => {
  //   return new Date(dateString).toLocaleDateString();
  // };

  return (
    <Card>
      <CardContent>
        <GoogleCalendar />
      </CardContent>
    </Card>
    // <Card>
    //   <CardHeader className='flex flex-row place-content-between items-center'>
    //     <CardTitle>Recent Leave Requests</CardTitle>
    //     <Link
    //       href='/dashboard/leave'
    //       className={cn(
    //         buttonVariants({ variant: 'link' }),
    //         'mt-0 space-y-0 p-0'
    //       )}
    //     >
    //       View All
    //     </Link>
    //   </CardHeader>
    //   <CardContent>
    //     <div className='space-y-8'>
    //       {leaveList.slice(0, 5).map((leave) => {
    //         return (
    //           <div className='flex items-center' key={leave.id}>
    //             <div className='ml-4 space-y-1'>
    //               <p className='text-sm font-medium leading-none'>
    //                 {leave.name.name}
    //               </p>
    //               <p className='text-sm text-muted-foreground'>
    //                 {`${formatDate(leave.start_date)} - ${formatDate(leave.end_date)}`}
    //               </p>
    //             </div>
    //             <div className='ml-auto font-medium'>{leave.status}</div>
    //           </div>
    //         );
    //       })}
    //     </div>
    //   </CardContent>
    // </Card>
  );
}
