import { mockReimbursementList } from '../../data';

export async function GET() {
  return Response.json(mockReimbursementList);
}
