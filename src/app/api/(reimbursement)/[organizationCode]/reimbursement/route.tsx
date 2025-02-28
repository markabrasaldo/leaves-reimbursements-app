import { NextRequest } from 'next/server';
import { mockReimbursementList } from '../../data';
import { matchSorter } from 'match-sorter';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('search');
  const limit = searchParams.get('limit');
  const page = searchParams.get('page');
  const status = searchParams.get('status');

  let newResponse = mockReimbursementList;

  // filter by status/categories
  if (status) {
    const statusArray = status ? status.split('.') : [];

    if (statusArray.length > 0) {
      newResponse = mockReimbursementList.filter((reimbursement) =>
        statusArray.includes(reimbursement.status)
      );
    }
  }
  //search
  if (query) {
    newResponse = matchSorter(mockReimbursementList, query, {
      keys: ['organization', 'reimbursementType', 'status']
    });
  }

  //pagination
  const offset = (Number(page) - 1) * Number(limit);
  const paginatedResponse = newResponse.slice(offset, offset + Number(limit));

  const totalReimbursements = newResponse.length ?? 0;

  const data = {
    total_reimbursements: totalReimbursements,
    reimbursements: !searchParams.toString() ? newResponse : paginatedResponse
  };

  return Response.json(data);
}

export async function POST(request: Request) {
  const reimbursement = await request.json();

  const newReimbursement = {
    //might add new fields
    ...reimbursement,
    organization: {
      id: reimbursement.organization_id,
      name: 'Posted Org Name'
    },
    reimbursement_type: {
      code: reimbursement.reimbursement_type_code,
      name: 'Posted Reimbursement Allowance'
    }
  };

  mockReimbursementList.push(newReimbursement);

  return new Response(JSON.stringify(newReimbursement), {
    headers: { 'Content-Type': 'application/json' },
    status: 201
  });
}
