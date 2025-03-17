'use client';
import React, { useState, useRef, useEffect } from 'react';
// @ts-ignore
import { DateRange } from 'react-date-range';
import { subDays, startOfMonth, endOfMonth } from 'date-fns';
import { format } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const DateRangePicker = ({
  onChange
}: {
  onChange: (dateRange: any) => void;
}) => {
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLInputElement>(null);

  const presetRanges = {
    Today: [new Date(), new Date()],
    'Last 7 Days': [subDays(new Date(), 6), new Date()],
    'Last 30 Days': [subDays(new Date(), 29), new Date()],
    'This Month': [startOfMonth(new Date()), endOfMonth(new Date())],
    'Last Month': [
      startOfMonth(subDays(new Date(), 30)),
      endOfMonth(subDays(new Date(), 30))
    ]
  };

  useEffect(() => {
    function handleClickOutside(event: Event) {
      if (
        pickerRef.current &&
        !pickerRef.current?.contains(event.target as Node)
      ) {
        onChange(range[0]);
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  return (
    <div className='relative w-80'>
      <input
        type='text'
        className='w-full cursor-pointer rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
        value={`${format(range[0].startDate, 'LLL-dd-yyyy')} - ${format(range[0].endDate, 'LLL-dd-yyyy')}`}
        readOnly
        onClick={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div
          ref={pickerRef}
          className='absolute left-0 z-50 mt-2 rounded-lg border bg-white p-4 shadow-lg'
        >
          <DateRange
            ranges={range}
            onChange={(item: any) => setRange([item.selection])}
            moveRangeOnFirstSelection={false}
            rangeColors={['#2563eb']}
          />
          <div className='flex flex-wrap gap-2'>
            {Object.entries(presetRanges).map(([label, dates]) => (
              <button
                key={label}
                onClick={() =>
                  setRange([
                    { startDate: dates[0], endDate: dates[1], key: 'selection' }
                  ])
                }
                className='rounded-md border border-gray-300 px-3 py-1 text-gray-700 transition hover:bg-blue-500 hover:text-white'
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
