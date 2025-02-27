import { delay } from '@/constants/mock-api';
import { AttendancePieGraph } from '@/features/overview/components/attendance-pie-graph';

export default async function Stats() {
  await delay(1000);
  return <AttendancePieGraph />;
}
