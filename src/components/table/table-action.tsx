'use client';

import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { useTableFilters } from '@/hooks/use-table-filters';

interface FilterOption {
  value: string;
  label: string;
}

export default function TableAction({
  filterStatusOption,
  filterLeaveOption
}: {
  filterStatusOption?: FilterOption[];
  filterLeaveOption?: FilterOption[];
}) {
  const {
    statusFilter,
    setStatusFilter,
    leaveFilter,
    setLeaveFilter,
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
      {filterStatusOption && (
        <DataTableFilterBox
          filterKey='status'
          title='Status'
          options={filterStatusOption}
          setFilterValue={setStatusFilter}
          filterValue={statusFilter}
        />
      )}
      {filterLeaveOption && (
        <DataTableFilterBox
          filterKey='leave'
          title='Leave'
          options={filterLeaveOption}
          setFilterValue={setLeaveFilter}
          filterValue={leaveFilter}
        />
      )}

      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}
