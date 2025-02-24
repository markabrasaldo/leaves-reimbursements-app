'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Reimbursement } from '../../types';
import { format } from 'date-fns';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export const columns: ColumnDef<Reimbursement>[] = [
  {
    accessorKey: 'reimbursementType',
    header: 'Reimbursement Type',
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
    accessorKey: 'date',
    header: 'Date Initiated',
    cell: ({ row }) => {
      return format(row.original.date, 'MM/dd/yyyy');
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
    accessorKey: 'status',
    header: 'Status'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
