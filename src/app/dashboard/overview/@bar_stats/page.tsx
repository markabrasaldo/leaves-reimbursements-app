import { delay } from '@/constants/mock-api';
import { LeaveReimbursementBarGraph } from '@/features/overview/components/leave-reimbursement-bar-graph';

export default async function BarStats() {
  await await delay(1000);

  return <LeaveReimbursementBarGraph />;
}
