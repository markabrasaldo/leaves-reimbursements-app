import { delay } from '@/constants/mock-api';
import { ReimbursementAreaGraph } from '@/features/overview/components/reimbursements-area-graph';

export default async function ReimbursementAreaStats() {
  await await delay(2000);
  return <ReimbursementAreaGraph />;
}
