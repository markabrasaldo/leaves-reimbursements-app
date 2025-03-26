'use client';

import { Column, ColumnDef } from '@tanstack/react-table';
import { Reimbursement } from '../../types';
import { format } from 'date-fns';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { getStatusColor } from '@/features/leaves/components/table/columns';
import { useTableFilters } from '@/hooks/use-table-filters';
import { ArrowUpDown } from 'lucide-react';

export const SortOrderButton = (column: Column<Reimbursement, unknown>) => {
  const { setOrderFilter, setSortFilter } = useTableFilters();

  const sort = (e: React.MouseEvent<HTMLElement>) => {
    const sortFn = column.getToggleSortingHandler();
    const currOrder = column.getNextSortingOrder();

    if (sortFn) sortFn(e);

    setOrderFilter(currOrder as string);
    setSortFilter('amount');
  };

  return (
    <Button variant='ghost' onClick={(e) => sort(e)}>
      Reimbursement Type
      <ArrowUpDown className='ml-2 h-4 w-4' />
    </Button>
  );
};

export const columns: ColumnDef<Reimbursement>[] = [
  {
    accessorKey: 'reimbursementType',
    header: ({ column }) => {
      return SortOrderButton(column);
    },
    cell: ({ row }) => {
      return (
        <Link
          href={`/dashboard/reimbursement/${row.original.id}`}
          className={cn(
            buttonVariants({ variant: 'link' }),
            'mt-0 space-y-0 p-0 text-inherit underline underline-offset-4'
          )}
        >
          {row.original.reimbursement_type.name}
        </Link>
      );
    }
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      return `₱${row.original.amount}`;
    }
  },
  {
    accessorKey: 'organization',
    header: 'Organization',
    cell: ({ row }) => {
      return row.original.organization.name;
    }
  },
  {
    accessorKey: 'date',
    header: 'Date Requested',
    cell: ({ row }) => {
      return format(row.original.date, 'MM/dd/yyyy');
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      return <span className={getStatusColor(status)}>{status}</span>;
    }
  }
  // {
  //   id: 'actions',
  //   cell: ({ row }) => <CellAction data={row.original} />
  // }
];
