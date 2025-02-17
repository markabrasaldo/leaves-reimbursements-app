import { delay, fakeReimbursements } from '@/constants/mock-api';
import { searchParamsCache } from '@/lib/searchparams';
import { DataTable as ReimbursementTable } from '@/components/ui/table/data-table';
import { columns } from './table/columns';
import { TableFilter } from 'types';
import { Reimbursement } from '../types';
import { matchSorter } from 'match-sorter';

// use when endpoint is available
async function getReimbursements(filters: TableFilter) {
  // const { publicRuntimeConfig } = getConfig();
  // const baseUrl = publicRuntimeConfig.baseUrl;
  // const res = await fetch(`${baseUrl}/${organization_code}/reimbursements/`);
  await delay(1500);

  const response = await fakeReimbursements.getReimbursementList();

  let newResponse = response;

  if (filters?.search) {
    newResponse = matchSorter(response, filters.search, {
      keys: ['organization', 'reimbursementType', 'status']
    });
  }
  if (filters?.categories) {
    const categoriesArray = filters.categories
      ? filters.categories.split('.')
      : [];

    if (filters.categories.length > 0) {
      newResponse = response.filter((reimbursement) =>
        categoriesArray.includes(reimbursement.status)
      );
    }
  }
  const totalReimbursements = newResponse.length;

  //pagination
  const offset = (filters.page - 1) * filters.limit;
  const paginatedResponse = newResponse.slice(offset, offset + filters.limit);

  return {
    total_reimbursements: totalReimbursements,
    reimbursements: paginatedResponse
  };
}

export default async function ReimbursementListPage() {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('q');
  const pageLimit = searchParamsCache.get('limit');
  const categories = searchParamsCache.get('categories');

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(categories && { categories: categories })
  };

  const data = await getReimbursements(filters);
  const totalReimbursements = data.total_reimbursements;
  const reimbursements: Reimbursement[] = data.reimbursements;

  return (
    <ReimbursementTable
      columns={columns}
      data={reimbursements}
      totalItems={totalReimbursements}
    />
  );
}
