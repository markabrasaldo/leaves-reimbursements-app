'use client';

import { searchParams } from '@/lib/searchparams';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

export function useTableFilters() {
  const [searchQuery, setSearchQuery] = useQueryState(
    'q',
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault('')
  );

  const [statusFilter, setStatusFilter] = useQueryState(
    'status',
    searchParams.status.withOptions({ shallow: false }).withDefault('')
  );

  const [leaveFilter, setLeaveFilter] = useQueryState(
    'leave_type',
    searchParams.status.withOptions({ shallow: false }).withDefault('')
  );

  const [reimbursementFilter, setReimbursementFilter] = useQueryState(
    'reimbursement_type',
    searchParams.status.withOptions({ shallow: false }).withDefault('')
  );

  const [orderFilter, setOrderFilter] = useQueryState(
    'order',
    searchParams.status.withOptions({ shallow: false }).withDefault('')
  );

  const [sortFilter, setSortFilter] = useQueryState(
    'sort',
    searchParams.status.withOptions({ shallow: false }).withDefault('')
  );

  const [page, setPage] = useQueryState(
    'page',
    searchParams.page.withDefault(1)
  );

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setStatusFilter(null);
    setLeaveFilter(null);
    setReimbursementFilter(null);

    setPage(1);
  }, [setSearchQuery, setStatusFilter, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return (
      !!searchQuery || !!statusFilter || !!leaveFilter || !!reimbursementFilter
    );
  }, [searchQuery, statusFilter, leaveFilter, reimbursementFilter]);

  return {
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
    statusFilter,
    setStatusFilter,
    leaveFilter,
    setLeaveFilter,
    reimbursementFilter,
    setReimbursementFilter,
    orderFilter,
    setOrderFilter,
    sortFilter,
    setSortFilter
  };
}
