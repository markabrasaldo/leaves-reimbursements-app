import { searchParamsCache } from '@/lib/searchparams';
import { DataTable as LeavesTable } from '@/components/ui/table/data-table';
import { Roles, TableFilter } from 'types';
import { Leave, LeavesResponse } from '../types';
import getConfig from 'next/config';
import { columns } from './table/columns';
import { getSessionDetails } from '@/app/utils/getSessionDetails';

const { publicRuntimeConfig } = getConfig();
const baseUrl = publicRuntimeConfig.baseUrlLeave;

async function getLeaves(filters: TableFilter): Promise<LeavesResponse> {
  const { accessToken, organization, role, user_id } =
    await getSessionDetails();

  const url = new URL(
    role === ('Member' as unknown as Roles)
      ? `${baseUrl}/${organization?.code}/users/${user_id}/leaves`
      : `${baseUrl}/${organization?.code}/leaves`
  );
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

  const leaveList = await response.json();

  if (!response.ok) {
    throw new Error(leaveList.error || 'Failed to fetch leave');
  }

  const { data, message, meta } = leaveList;

  return {
    data,
    message,
    meta
  };
}

export default async function LeavesListPage() {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('q');
  const pageLimit = searchParamsCache.get('limit');
  const status = searchParamsCache.get('status');
  const leave_type = searchParamsCache.get('leave_type');
  const order = searchParamsCache.get('order');

  const filters = {
    ...(page && { page }),
    ...(pageLimit && { limit: pageLimit }),
    ...(search && { search }),
    ...(status && { status }),
    ...(leave_type && { leave_type }),
    ...(order && { order })
  };

  const { data, meta } = await getLeaves(filters);

  const totalLeave = (meta && meta?.totalCount) ?? data?.length;
  const leaves: Leave[] = data ?? [];

  return (
    <LeavesTable columns={columns} data={leaves} totalItems={totalLeave} />
  );
}
