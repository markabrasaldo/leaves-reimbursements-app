import { render, screen, waitFor } from '@testing-library/react';
import ReimbursementListPage from '../components/reimbursement-table-list';
import { jest } from '@jest/globals';
import {
  NuqsTestingAdapter,
  withNuqsTestingAdapter
} from 'nuqs/adapters/testing';
import { createSearchParamsCache } from 'nuqs/server';
import { searchParams } from '@/lib/searchparams';
import { mockReimbursementList } from '@/app/api/(reimbursement)/data';

const originalFetch = global.fetch;
let baseUrl = '';

describe('Testing', () => {
  beforeEach(() => {
    baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    withNuqsTestingAdapter({
      searchParams: '?page=1&limit=10'
    });

    const searchParamsCache = createSearchParamsCache(searchParams);

    searchParamsCache.parse({});
  });
  afterEach(() => {
    global.fetch = originalFetch;

    withNuqsTestingAdapter({
      searchParams: '?page=1&limit=10'
    });
  });

  it('it shoud fetch reimbursement list', async () => {
    //@ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockReimbursementList)
      })
    );

    render(<ReimbursementListPage />, {
      // 1. Setup the test by passing initial search params / querystring:
      wrapper: ({ children }) => {
        return (
          <NuqsTestingAdapter searchParams='?page=2'>
            {children}
          </NuqsTestingAdapter>
        );
      }
    });

    await waitFor(() => {
      expect(screen.getByText(/DRAFT/i)).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      `${baseUrl}/${'ORG0001'}/reimbursement/`
    );
  });
});
