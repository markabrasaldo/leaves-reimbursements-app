'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import { toTitleCase } from '@/lib/utils';
import { Icons } from '@/components/icons';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { downloadFile } from '@/lib/utils';

const SpreadSheetIcon = Icons.fileSpreadSheet;

export function ReimbursementGroupedBarGraph({ dateRange }: any) {
  const { data: session } = useSession();
  const [chartData, setChartData] = useState([]);
  const [categories, setCategories] = useState<string[]>([]);

  const exportToCSV = async () => {
    const startDate = dateRange?.startDate?.toLocaleDateString('en-CA');
    const endDate = dateRange?.endDate?.toLocaleDateString('en-CA');

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_REIMBURSEMENT;
    const exportCSVURL = `${baseUrl}/${session?.user?.organization?.code}/reimbursement/export-to-csv?start_date=${startDate}&end_date=${endDate}&status=APPROVED`;
    try {
      const response = await fetch(exportCSVURL, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken}`,
          'Content-Type': 'text/csv'
        }
      });

      if (!response.ok) throw new Error('Failed to download');
      downloadFile(`reimbursement`, 'csv', response);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  useEffect(() => {
    const getReimbursements = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_REIMBURSEMENT;

      const startDate = new Date(dateRange?.startDate)?.toLocaleDateString(
        'en-CA'
      );
      const endDate = new Date(dateRange?.endDate)?.toLocaleDateString('en-CA');

      const url = `${baseUrl}/${session?.user?.organization?.code}/reimbursements/summary?start_date=${startDate}&end_date=${endDate}`;

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
      if (reimbursementList?.data && reimbursementList?.data?.length > 0) {
        const categories = Object.keys(reimbursementList?.data[0]).filter(
          (key) => key !== 'month'
        );
        setCategories(categories);
        setChartData(reimbursementList?.data);
      }
    };

    getReimbursements();
  }, [dateRange]);
  return (
    <Card className='flex flex-1 flex-col dark:bg-[#1E1E1E]/100'>
      <CardHeader className='text-center'>
        <CardTitle className='w-full'>
          <div className='m-auto flex w-full items-center'>
            <div className='flex-1'></div>
            <div className='flex-1 text-center font-semibold'>
              Reimbursements
            </div>
            <div className='flex flex-1 justify-end gap-2 text-[#5b5454]'>
              <div
                onClick={() => exportToCSV()}
                className='cursor-pointer'
                title='Export to CSV'
              >
                <SpreadSheetIcon />
              </div>
            </div>
          </div>
        </CardTitle>
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
            <Legend formatter={(value) => toTitleCase(value)} />
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
