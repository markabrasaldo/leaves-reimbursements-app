import { delay } from '@/constants/mock-api';
import { searchParamsCache } from '@/lib/searchparams';
import { DataTable as ReimbursementTable } from '@/components/ui/table/data-table';
import { columns } from './table/columns';
import { TableFilter } from 'types';
import { Reimbursement, ReimbursementsResponse } from '../types';
import getConfig from 'next/config';
import { getSessionDetails } from '@/app/utils/getSessionDetails';

const { publicRuntimeConfig } = getConfig();
const baseUrl = publicRuntimeConfig.baseUrlReimbursement;

async function getReimbursements(
  filters: TableFilter
): Promise<ReimbursementsResponse> {
  const { accessToken, organization } = await getSessionDetails();

  const url = new URL(`${baseUrl}/${organization?.code}/reimbursement`);
  const params = new URLSearchParams(url.search);

  if (filters) {
    Object.keys(filters).forEach((key: keyof TableFilter) => {
      return params.append(key.toString(), filters[key].toString());
    });
  }

  const response = await fetch(
    params.toString() ? `${url}?${params.toString()}` : url,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );

  const reimbursementList = await response.json();

  if (!response.ok) {
    throw new Error(reimbursementList.error || 'Failed to fetch reimbursement');
  }

  const { data, meta, message } = reimbursementList;

  return {
    data,
    meta,
    message
  };
}

export default async function ReimbursementListPage() {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get('page');
  const q = searchParamsCache.get('q');
  const pageLimit = searchParamsCache.get('limit');
  const reimbursement_type = searchParamsCache.get('reimbursement_type');
  const order = searchParamsCache.get('order');
  const status = searchParamsCache.get('status');
  const sort = searchParamsCache.get('sort');

  const filters = {
    ...(page && { page }),
    ...(pageLimit && { limit: pageLimit }),
    ...(q && { q }),
    ...(status && { status: status }),
    ...(reimbursement_type && { reimbursement_type }),
    ...(order && { order: order?.toUpperCase() }),
    ...(sort && { sort })
  };

  const { data, meta } = await getReimbursements(filters);

  const totalReimbursements = (data && data.length) ?? 0;
  const reimbursements: Reimbursement[] = data ?? [];

  return (
    <ReimbursementTable
      pageCount={meta?.totalPage ?? 1}
      data-testid='reimbursement-table'
      columns={columns}
      data={reimbursements}
      totalItems={totalReimbursements}
    />
  );
}
