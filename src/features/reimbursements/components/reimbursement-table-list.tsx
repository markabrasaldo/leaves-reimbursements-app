import { delay, reimbursementList } from '@/constants/mock-api';
import { searchParamsCache } from '@/lib/searchparams';
import { DataTable as ReimbursementTable } from '@/components/ui/table/data-table';
import { columns } from './product-tables/columns';
import { TableFilter } from 'types';
import { Reimbursement } from '../types';

// use when endpoint is available
async function getReimbursements(filters: TableFilter) {
  // const { publicRuntimeConfig } = getConfig();
  // const baseUrl = publicRuntimeConfig.baseUrl;
  // const res = await fetch(`${baseUrl}/${organization_code}/reimbursements/`);
  await delay(1000);

  const response = await reimbursementList;

  const totalReimbursements = response.length;

  return {
    total_reimbursements: totalReimbursements,
    reimbursements: response
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

  console.log('reimbursements', reimbursements);

  return (
    <ReimbursementTable
      columns={columns}
      data={reimbursements}
      totalItems={totalReimbursements}
    />
  );
}
