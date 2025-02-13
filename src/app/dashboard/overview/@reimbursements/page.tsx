import { delay } from '@/constants/mock-api';
import { ReimbursementsList } from '@/features/overview/components/reimbursements-list';

export default async function Employees() {
  await delay(2000);
  return <ReimbursementsList />;
}
