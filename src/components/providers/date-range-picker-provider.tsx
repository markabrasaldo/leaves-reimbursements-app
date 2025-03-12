'use client';
import React, { createContext, useContext, useState } from 'react';
import { subDays, startOfMonth, endOfMonth } from 'date-fns';

// Define the context type
interface DateRange {
  startDate: Date;
  endDate: Date;
  key: string;
}

interface DateRangeContextType {
  range: DateRange[];
  setRange: (range: DateRange[]) => void;
  presetRanges: Record<string, [Date, Date]>;
}

const DateRangeContext = createContext<DateRangeContextType | undefined>(
  undefined
);

export const DateRangeProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [range, setRange] = useState<DateRange[]>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);

  const presetRanges: Record<string, [Date, Date]> = {
    Today: [new Date(), new Date()],
    'Last 7 Days': [subDays(new Date(), 6), new Date()],
    'Last 30 Days': [subDays(new Date(), 29), new Date()],
    'This Month': [startOfMonth(new Date()), endOfMonth(new Date())],
    'Last Month': [
      startOfMonth(subDays(new Date(), 30)),
      endOfMonth(subDays(new Date(), 30))
    ]
  };

  return (
    <DateRangeContext.Provider value={{ range, setRange, presetRanges }}>
      {children}
    </DateRangeContext.Provider>
  );
};

export const useDateRange = (): DateRangeContextType => {
  const context = useContext(DateRangeContext);
  if (!context) {
    throw new Error('useDateRange must be used within a DateRangeProvider');
  }
  return context;
};
