import { delay } from '@/constants/mock-api';
import { LeavesList } from '@/features/overview/components/recent-leaves';

export default async function Employees() {
  await delay(2000);
  return <LeavesList />;
}
