import { delay } from '@/constants/mock-api';
import { ReimbursementsList } from '@/features/overview/components/reimbursements-list';

export default async function Reimbursement() {
  await delay(2000);
  return <ReimbursementsList />;
}
