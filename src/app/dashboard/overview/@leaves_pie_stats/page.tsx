import { delay } from '@/constants/mock-api';
import { LeavesPieGraph } from '@/features/overview/components/leaves-pie-graph';

export default async function Stats() {
  await delay(1000);
  return <LeavesPieGraph />;
}
