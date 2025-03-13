import { LeavesPieGraph } from '@/features/overview/components/leaves-pie-graph';

export default async function Stats(dateRange: any) {
  return <LeavesPieGraph dateRange={dateRange} />;
}
