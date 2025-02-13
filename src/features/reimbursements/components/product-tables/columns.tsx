'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Reimbursement } from '../../types';
import { Icons } from '@/components/icons';

export const columns: ColumnDef<Reimbursement>[] = [
  {
    accessorKey: 'organization',
    header: 'Organization',
    cell: ({ row }) => {
      return row.original.organization.name;
    }
  },
  {
    accessorKey: 'reimbursementType',
    header: 'Reimbursement Type',
    cell: ({ row }) => {
      return row.original.reimbursementType.name;
    }
  },
  {
    accessorKey: 'status',
    header: 'Status'
  },
  {
    accessorKey: 'date',
    header: 'Date Initiated'
  },
  {
    accessorKey: 'amount',
    header: 'Amount'
  },
  {
    accessorKey: 'attachments',
    header: 'Attachments',
    cell: ({ row }) => {
      const Icon = Icons['download'];
      // const attachments = row.original.attachments // to download?

      return <Icon />;
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
