import { delay } from '@/constants/mock-api';
import { EmployeeList } from '@/features/overview/components/employees-list';

export default async function Employees() {
  await delay(2000);
  return <EmployeeList />;
}
