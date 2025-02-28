import { getSessionDetails } from '@/app/utils/getSessionDetails';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import getConfig from 'next/config';

interface LeaveBalanceInterface {
  leave_balances: [
    {
      id: string;
      leave_type_id: string;
      leave_type_name: string;
      balance: number;
      convertible_balance: number;
    }
  ];
  message: string;
}

const { publicRuntimeConfig } = getConfig();
const baseUrl = publicRuntimeConfig.baseUrlLeave;

async function getLeaveBalance(): Promise<LeaveBalanceInterface> {
  const { accessToken, organization, user_id } = await getSessionDetails();

  const response = await fetch(
    `${baseUrl}/${organization?.code}/users/${user_id}/leave-balances`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );

  const userLeaves = await response.json();

  if (!response.ok) {
    throw new Error(userLeaves.error || 'Failed to fetch reimbursement');
  }

  const { leave_balances, message } = userLeaves;

  return {
    leave_balances,
    message
  };
}

export async function LeaveBalance() {
  const { leave_balances: LeaveBalanceList } = await getLeaveBalance();

  return (
    <Card>
      <CardHeader className='flex flex-row place-content-between items-center'>
        <CardTitle>Leave Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-8'>
          {LeaveBalanceList.map((leaveBalance) => {
            return (
              <div className='flex items-center' key={leaveBalance.id}>
                <div className='ml-4 space-y-1'>
                  <p className='text-base font-medium leading-none'>
                    {leaveBalance.leave_type_name}
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    Balance: {leaveBalance.balance}
                  </p>
                </div>
                <div className='ml-auto font-medium'>
                  <p className='text-base font-medium leading-none'>
                    &#8369;{`${leaveBalance.convertible_balance}`}
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    Convertible Balance
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
