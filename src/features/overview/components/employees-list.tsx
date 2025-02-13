import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { users } from '@/constants/mock-api';
import { cn } from '@/lib/utils';
import getConfig from 'next/config';
import Link from 'next/link';

// use when endpoint is available
async function getEmployeeList(organization_code: string) {
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = publicRuntimeConfig.baseUrl;
  const res = await fetch(`${baseUrl}/employees`);

  return res.json();
}

export async function EmployeeList() {
  // const data = await getEmployeeList();

  const employeeList = await users;

  return (
    <Card>
      <CardHeader className='flex flex-row place-content-between items-center'>
        <CardTitle>Employees</CardTitle>
        <Link
          href='/leave'
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
          {employeeList.map((employee) => {
            return (
              <div className='flex items-center' key={employee.id}>
                <Avatar className='h-9 w-9'>
                  <AvatarImage src={employee.attachments} alt='Avatar' />
                  <AvatarFallback>OM</AvatarFallback>
                </Avatar>
                <div className='ml-4 space-y-1'>
                  <p className='text-sm font-medium leading-none'>
                    {employee.name}
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    {employee.email}
                  </p>
                </div>
                <div className='ml-auto text-sm font-medium'>
                  {employee.role}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
