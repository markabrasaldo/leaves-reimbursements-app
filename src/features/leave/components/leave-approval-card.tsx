'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays } from 'lucide-react';

type LeaveApprovalCardProps = {
  id: number;
  name: {
    name: string;
  };
  status: string;
  start_date: string;
  end_date: string;
  leave_type: {
    name: string;
  };
  reason: string;
};

export function LeaveApprovalCard({ data }: { data: LeaveApprovalCardProps }) {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleApprove = () => console.log('approved');
  const handleReject = () => console.log('rejected');

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            <span>{data?.name?.name}</span>

            <Badge
              variant={
                data?.status === 'PENDING'
                  ? 'outline'
                  : data?.status === 'approved'
                    ? 'default'
                    : 'destructive'
              }
            >
              {data?.status.charAt(0).toUpperCase() + data?.status.slice(1)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            <div className='flex items-center'>
              <CalendarDays className='mr-2 h-4 w-4' />
              <span>
                {formatDate(data?.start_date)} to {formatDate(data?.end_date)}
              </span>
            </div>
            <div>
              <strong>Type:</strong> {data?.leave_type?.name}
            </div>
            <div>
              <strong>Reason:</strong> {data?.reason}
            </div>
          </div>
        </CardContent>
        <CardFooter className='flex justify-end space-x-2'>
          <Button onClick={handleApprove} variant='outline'>
            Approve
          </Button>
          <Button onClick={handleReject} variant='destructive'>
            Reject
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
