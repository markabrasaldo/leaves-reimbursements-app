'use client';

import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { useTableFilters } from './use-table-filters';

export default function ReimbursementTableAction() {
  const {
    categoriesFilter,
    setCategoriesFilter,
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery
  } = useTableFilters();
  return (
    <div className='flex flex-wrap items-center gap-4'>
      <DataTableSearch
        searchKey=''
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setPage={setPage}
      />
      <DataTableFilterBox
        filterKey='status'
        title='Categories'
        options={FILTER_OPTIONS}
        setFilterValue={setCategoriesFilter}
        filterValue={categoriesFilter}
      />
      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}

export const FILTER_OPTIONS = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'SUBMITTED', label: 'Submitted' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'REIMBURSED', label: 'Reimbursed' }
];
