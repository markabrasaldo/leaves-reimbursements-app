'use client';

import { Column, ColumnDef } from '@tanstack/react-table';
import { Leave } from '@/features/leaves/types';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/app/utils/formatDate';
import { useTableFilters } from '@/hooks/use-table-filters';

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
    accessorKey: 'created_by',
    header: ({ column }) => {
      return SortOrderButton(column);
    },
    sortDescFirst: false,
    cell: ({ row }) => {
      const user = row.original.created_by;
      return <span>{user}</span>;
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
    accessorKey: 'start_date',
    header: 'Start Date',
    cell: ({ row }) => formatDate(row.getValue('start_date'))
  },
  {
    accessorKey: 'end_date',
    header: 'End Date',
    cell: ({ row }) => formatDate(row.getValue('end_date'))
  }
];
