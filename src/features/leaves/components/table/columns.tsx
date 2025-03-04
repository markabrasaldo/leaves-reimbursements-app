'use client';

import { Column, ColumnDef } from '@tanstack/react-table';
import { Leave } from '../../types';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/app/utils/formatDate';
import { useTableFilters } from '@/hooks/use-table-filters';
import { useCallback, useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/use-debounce';

export const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    APPROVED: 'text-blue-500',
    REJECTED: 'text-red-500',
    DRAFT: 'text-green-500',
    SUBMITTED: 'text-orange-500',
    default: 'text-yellow-500'
  };
  return colorMap[status] || colorMap.default;
};

export const SortOrderButton = (column: Column<Leave, unknown>) => {
  const { setOrderFilter } = useTableFilters();

  const sort = (e: React.MouseEvent<HTMLElement>) => {
    const sortFn = column.getToggleSortingHandler();
    const currOrder = column.getNextSortingOrder();

    if (sortFn) sortFn(e);

    setOrderFilter(currOrder as string);
  };

  return (
    <Button variant='ghost' onClick={(e) => sort(e)}>
      User
      <ArrowUpDown className='ml-2 h-4 w-4' />
    </Button>
  );
};

export const columns: ColumnDef<Leave>[] = [
  {
    accessorKey: 'user_email',
    header: ({ column }) => {
      return SortOrderButton(column);
    },
    sortDescFirst: false,
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
      const leaveType = row.original.leave_type.name;
      return <span>{leaveType}</span>;
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
