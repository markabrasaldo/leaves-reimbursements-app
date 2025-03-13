'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';

export function ReimbursementGroupedBarGraph({ dateRange }: any) {
  const { data: session } = useSession();
  const [chartData, setChartData] = useState([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const getReimbursements = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_REIMBURSEMENT;
      const startDate = dateRange?.startDate.toISOString().split('T')[0];
      const endDate = dateRange?.endDate.toISOString().split('T')[0];
      const url = `${baseUrl}/${session?.user?.organization?.code}/reimbursements/summary?start_date${startDate}&end_date=${endDate}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      const reimbursementList = await response.json();

      if (!response.ok) {
        throw new Error(
          reimbursementList.error ||
            'Failed to fetch data for reimbursement graph'
        );
      }
      const categories = Object.keys(reimbursementList?.data[0]).filter(
        (key) => key !== 'month'
      );
      setCategories(categories);

      setChartData(reimbursementList?.data);
    };

    getReimbursements();
  }, [dateRange]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reimbursements</CardTitle>
        <CardDescription>
          {`Showing reimbursements for ${format(dateRange?.startDate, 'LLL-dd-yyyy')} to ${format(dateRange?.endDate, 'LLL-dd-yyyy')}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className='aspect-auto h-[310px] w-full'>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <XAxis dataKey='month' angle={-45} />
            <YAxis />
            <Tooltip />
            <Legend />
            {categories.map((category, index) => (
              <Bar
                key={category}
                dataKey={category}
                fill={['#FFB74D', '#4DB6AC ', '#10b981', '#e11d48'][index % 4]}
                name={category}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
