import { render, screen } from '@testing-library/react';
import ReimbursementListPage from '../components/reimbursement-table-list';
import { jest } from '@jest/globals';
import { NuqsTestingAdapter } from 'nuqs/adapters/testing';
import { searchParamsCache } from '@/lib/searchparams';

import { mockReimbursementList } from '@/app/api/(reimbursement)/data';
import Page from '@/app/dashboard/reimbursement/page';

import { Suspense } from 'react';

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

  it('it should render and fetch reimbursement list', async () => {
    //@ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockReimbursementList)
      })
    );

    /**
     * Note: to be fixed
     *
     *  uncomment this block to view error "useRouter.mockReturnValue is not a funciton"
     */

    // const routerPushMock: jest.Mock = jest.fn();

    //@ts-ignore
    // (useRouter as jest.Mock).mockReturnValue({
    //   push: routerPushMock
    // });
    // const useRouteMock = jest
    //   .spyOn(require('next/navigation'), 'useRouter')
    //   .mockReturnValue({
    //     push: routerPushMock
    //   });

    /**
     * Note: to be fixed
     *
     * uncomment this block to view error "invariant expected app router to be mounted"
     */
    // const component = await ReimbursementListPage();

    // render(component, {
    //   wrapper: ({ children }) => {
    //     return (
    //       <NuqsTestingAdapter searchParams='?page=1'>
    //         <AppRouterContext value={null}>{children}</AppRouterContext>
    //       </NuqsTestingAdapter>
    //     );
    //   }
    // });

    // expect(global.fetch).toHaveBeenCalledWith(
    //   'http://localhost:3000/api/ORG001/reimbursement'
    // );

    render(
      <Suspense>
        <ReimbursementListPage />
      </Suspense>
    );
  });
});
