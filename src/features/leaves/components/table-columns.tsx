'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Leave } from '../types';
import { formatDate } from '@/app/utils/formatDate';

const getLeaveTypeColor = (leaveType: string): string => {
  const colorMap: Record<string, string> = {
    'Vacation Leave': 'text-blue-500',
    'Sick Leave': 'text-red-500',
    'Sabbatical Leave': 'text-orange-500',
    'Maternity leave': 'text-green-500',
    default: 'text-yellow-500'
  };
  return colorMap[leaveType] || colorMap.default;
};

const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    APPROVED: 'text-blue-500',
    REJECTED: 'text-red-500',
    DRAFT: 'text-green-500',
    SUBMITTED: 'text-orange-500',
    default: 'text-yellow-500'
  };
  return colorMap[status] || colorMap.default;
};

export const columns: ColumnDef<Leave>[] = [
  {
    accessorKey: 'user_email',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          User
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const user = row.original.user_email;
      return (
        <Link
          href={`/dashboard/leave/${row.original.id}`}
          className='underline'
        >
          {user}
        </Link>
      );
    }
  },
  {
    accessorKey: 'leave_type.name',
    header: 'Leave Type',
    cell: ({ row }) => {
      console.log('row.original', row.original);
      const leaveType = row.original.leave_type.name;
      return <span className={getLeaveTypeColor(leaveType)}>{leaveType}</span>;
    }
  },
  {
    accessorKey: 'days_applied',
    header: 'Days Applied'
  },
  {
    accessorKey: 'organization_name',
    header: 'Department'
  },
  {
    accessorKey: 'start_date',
    header: 'Start Date',
    cell: ({ row }) => formatDate(row.getValue('start_date'))
  },
  {
    accessorKey: 'end_date',
    header: 'End Date',
    cell: ({ row }) => formatDate(row.getValue('end_date'))
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      return <span className={getStatusColor(status)}>{status}</span>;
    }
  }
];
