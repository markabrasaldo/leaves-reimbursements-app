import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsString
} from 'nuqs/server';

export const searchParams = {
  page: parseAsInteger,
  limit: parseAsInteger,
  q: parseAsString,
  status: parseAsString,
  leave_type: parseAsString,
  reimbursement_type: parseAsString,
  order: parseAsString
};

export const searchParamsCache = createSearchParamsCache(searchParams);

export const serialize = createSerializer(searchParams);
