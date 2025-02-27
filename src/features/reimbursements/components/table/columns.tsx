'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Reimbursement } from '../../types';
import { format } from 'date-fns';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { getStatusColor } from '@/features/leaves/components/table/columns';

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
          {/* {row.original.reimbursement_type.name} */}
          {row.original['reimbursement_type_code']}
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
