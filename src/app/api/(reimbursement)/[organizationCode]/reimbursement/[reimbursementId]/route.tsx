import { mockReimbursementList } from '../../../data';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ reimbursementId: string }> }
) {
  const { reimbursementId } = await params;
  const reimbursement = mockReimbursementList.find(
    (reimbursement) => reimbursement.id === reimbursementId
  );
  return Response.json(reimbursement);
}
