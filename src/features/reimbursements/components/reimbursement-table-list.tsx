import { delay } from '@/constants/mock-api';
import { searchParamsCache } from '@/lib/searchparams';
import { DataTable as ReimbursementTable } from '@/components/ui/table/data-table';
import { columns } from './table/columns';
import { TableFilter } from 'types';
import { Reimbursement } from '../types';
import getConfig from 'next/config';

async function getReimbursements(filters: TableFilter) {
  await delay(1500);

  try {
    const { publicRuntimeConfig } = getConfig();
    const baseUrl = publicRuntimeConfig.baseUrl;
    const url = new URL(`${baseUrl}/api/${'ORG001'}/reimbursement`);
    const params = new URLSearchParams(url.search);

    if (filters) {
      Object.keys(filters).forEach((key: keyof TableFilter) => {
        return params.append(key.toString(), filters[key].toString());
      });
    }

    const response = await fetch(
      // `${baseUrl}/${organization_code}/reimbursement` // when endpoint is available
      params.toString() ? `${url}?${params.toString()}` : url
    );

    const reimbursementList = await response.json();

    return {
      total_reimbursements: reimbursementList.total_reimbursements,
      reimbursements: reimbursementList.reimbursements
    };
  } catch (error) {
    throw new Error('Failed to fetch reimbursements');
  }
}

export default async function ReimbursementListPage() {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('q');
  const pageLimit = searchParamsCache.get('limit');
  const status = searchParamsCache.get('status');

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(status && { status: status })
  };

  const data = await getReimbursements(filters);

  const totalReimbursements = data.total_reimbursements;
  const reimbursements: Reimbursement[] = data.reimbursements;

  return (
    <ReimbursementTable
      data-testid='reimbursement-table'
      columns={columns}
      data={reimbursements}
      totalItems={totalReimbursements}
    />
  );
}
