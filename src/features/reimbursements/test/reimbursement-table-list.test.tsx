import { getByTestId, render, screen, waitFor } from '@testing-library/react';
import ReimbursementListPage from '../components/reimbursement-table-list';
import { jest } from '@jest/globals';
import { NuqsTestingAdapter } from 'nuqs/adapters/testing';
import { searchParamsCache } from '@/lib/searchparams';

import { mockReimbursementList } from '@/app/api/(reimbursement)/data';
import Page from '@/app/dashboard/reimbursement/page';

import { useRouter } from 'next/navigation';
import { Suspense } from 'react';

import { GET } from '@/app/api/(reimbursement)/[organizationCode]/reimbursement/route';
import { AppRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';

jest.mock('../../../lib/searchparams', () => jest.fn());
//@ts-ignore
searchParamsCache.get = jest.fn();

jest.mock('../components/reimbursement-table-list');
jest.mock('../components/table/reimbursement-table-action');

jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

async function generateSearchParams(value: {
  [key: string]: string | string[] | undefined;
}) {
  return value;
}

const originalFetch = global.fetch;
let baseUrl = '';

describe('Testing Reimbursement Page', () => {
  it('should render reimbursement page', async () => {
    const params = {
      page: '1'
    };
    const component = await Page({
      searchParams: generateSearchParams(params)
    });

    render(component, {
      wrapper: ({ children }) => {
        return (
          <NuqsTestingAdapter searchParams='?page=1'>
            {children}
          </NuqsTestingAdapter>
        );
      }
    });

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      /Reimbursements/i
    );
  });
});

describe('Testing Reimbursement Table', () => {
  beforeEach(() => {
    baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  });
  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('it should fetch reimbursement list', async () => {
    //@ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockReimbursementList)
      })
    );

    const routerPushMock: jest.Mock = jest.fn();

    //@ts-ignore
    // (useRouter as jest.Mock).mockReturnValue({
    //   push: routerPushMock
    // });
    // const useRouteMock = jest
    //   .spyOn(require('next/navigation'), 'useRouter')
    //   .mockReturnValue({
    //     push: routerPushMock
    //   });
    const component = await ReimbursementListPage();

    render(component, {
      wrapper: ({ children }) => {
        return (
          <NuqsTestingAdapter searchParams='?page=1'>
            <AppRouterContext value={null}>{children}</AppRouterContext>
          </NuqsTestingAdapter>
        );
      }
    });

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      /Reimbursements/i
    );

    // const { container } = render(
    //   <Suspense>
    //     <ReimbursementListPage />
    //   </Suspense>
    // );

    expect(
      getByTestId(document.documentElement, 'reimbursement-table')
    ).toBeInTheDocument();

    // expect(global.fetch).toHaveBeenCalledWith(
    //   'http://localhost:3000/api/ORG001/reimbursement'
    // );
  });
});
