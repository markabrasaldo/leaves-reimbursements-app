'use client';

import React, { useActionState, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
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

export function LeaveTypeCard({ data }: { data: Array<LeaveType> }) {
  const [selectedLeaveType, setSelectedLeaveType] = useState('');
  const [state, formAction, pending] = useActionState(submitForm, {
    message: ''
  });

  console.log(state);

  const handleSubmit = (formData: FormData) => {
    formData.append('leaveType', selectedLeaveType);
    formAction(formData);
  };

  return (
    <form action={handleSubmit}>
      <Card className='mx-auto w-full'>
        <CardHeader>
          <CardDescription className='text-sm sm:text-base'>
            Select a leave type and fill in the details to submit your leave
            request.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-6'>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {data?.map((leaveType) => {
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
                    <CardContent className='flex h-full flex-col items-center justify-between p-4'>
                      <div className='mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary'>
                        {Icon && (
                          <Icon className='h-5 w-5 flex-shrink-0 sm:h-6 sm:w-6' />
                        )}
                      </div>
                      <h3 className='mb-2 h-7 overflow-hidden text-center text-lg font-semibold'>
                        {leaveType?.name}
                      </h3>
                      <p
                        className='line-clamp-2 h-12 overflow-hidden text-center text-sm text-gray-600'
                        title={leaveType?.description}
                      >
                        {leaveType?.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

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
                    className='mt-1'
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
                    className='mt-1'
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
                  className='mt-1'
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type='submit'
            className='w-full'
            disabled={!selectedLeaveType}
          >
            Submit Leave Request
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
