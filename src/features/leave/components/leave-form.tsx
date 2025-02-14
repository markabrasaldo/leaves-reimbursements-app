'use client';

import React, { useActionState, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Umbrella, Stethoscope, User } from 'lucide-react';
import { submitForm } from '../actions/actions';

const iconMap = {
  Umbrella,
  Stethoscope,
  User
};

type LeaveType = {
  id: string;
  name: string;
  color: string;
  description: string;
  icon: string;
};

export function LeaveForm({ data }: { data: Array<LeaveType> }) {
  const [selectedLeaveType, setSelectedLeaveType] = useState('');
  const [state, formAction, pending] = useActionState(submitForm, {
    message: ''
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSubmit = (formData: FormData) => {
    formData.append('leaveType', selectedLeaveType);
    formAction(formData);
  };

  return (
    <form action={handleSubmit} className='space-y-4'>
      <h1 className='text-lg font-semibold sm:text-xl'>
        Select a leave type and fill in the details to submit your leave
        request.
      </h1>

      <div className='space-y-4'>
        {isMobile ? (
          <Select
            onValueChange={setSelectedLeaveType}
            value={selectedLeaveType}
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select leave type' />
            </SelectTrigger>
            <SelectContent>
              {data.map((leaveType) => (
                <SelectItem key={leaveType.id} value={leaveType.id}>
                  {leaveType.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {data.map((leaveType) => {
              const Icon = iconMap[leaveType.icon as keyof typeof iconMap];

              return (
                <Card
                  key={leaveType.id}
                  className={`cursor-pointer transition-all ${
                    selectedLeaveType === leaveType.id
                      ? 'ring-2 ring-primary'
                      : ''
                  }`}
                  onClick={() => setSelectedLeaveType(leaveType.id)}
                >
                  <CardContent className='flex h-full flex-col items-center justify-between p-2 sm:p-4'>
                    <div className='mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary sm:h-12 sm:w-12'>
                      {Icon && <Icon className='h-4 w-4 sm:h-5 sm:w-5' />}
                    </div>
                    <h3 className='mb-1 line-clamp-1 text-center text-sm font-semibold sm:text-base'>
                      {leaveType.name}
                    </h3>
                    <p
                      className='line-clamp-2 text-center text-xs text-gray-600 sm:text-sm'
                      title={leaveType.description}
                    >
                      {leaveType.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <div className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div>
              <Label htmlFor='start-date' className='text-sm sm:text-base'>
                Start Date
              </Label>
              <Input
                name='startDate'
                type='date'
                id='start-date'
                required
                className='mt-1 w-full'
              />
            </div>
            <div>
              <Label htmlFor='end-date' className='text-sm sm:text-base'>
                End Date
              </Label>
              <Input
                name='endDate'
                type='date'
                id='end-date'
                required
                className='mt-1 w-full'
              />
            </div>
          </div>
          <div>
            <Label htmlFor='reason' className='text-sm sm:text-base'>
              Reason
            </Label>
            <Input
              name='reason'
              id='reason'
              placeholder='Enter reason for leave'
              required
              className='mt-1 w-full'
            />
          </div>
        </div>
      </div>
      <Button type='submit' className='w-full' disabled={!selectedLeaveType}>
        Submit Leave Request
      </Button>
    </form>
  );
}
