'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

import { LeaveForm } from './leave-form';
import { LeaveType } from '../utils/leave-store';
import { searchParamsCache } from '@/lib/searchparams';

interface LeaveCardProps {
  initialLeaveTypes: LeaveType[];
}

export function LeaveCard({ initialLeaveTypes }: LeaveCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className='space-y-6 p-6'>
        <div className='flex items-center justify-between'>
          <div className='space-y-1'>
            <h2 className='text-2xl font-semibold tracking-tight'>Leaves</h2>
          </div>
          <Button onClick={() => setOpen(true)}>
            <Plus className='gap-2' />
            Add Leave
          </Button>
        </div>

        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <Card className='p-6'>
            <div className='flex items-center gap-4'>
              <div>
                <div className='flex items-baseline gap-2'>
                  <span className='text-3xl font-bold'>1192</span>
                  <span className='text-muted-foreground'>/ 1206</span>
                </div>
                <p className='text-sm text-muted-foreground'>Today Presents</p>
              </div>
            </div>
          </Card>

          <Card className='p-6'>
            <div className='flex items-center gap-4'>
              <div>
                <div className='flex items-baseline gap-2'>
                  <span className='text-3xl font-bold'>128</span>
                  <span className='text-muted-foreground'>/ 1206</span>
                </div>
                <p className='text-sm text-muted-foreground'>Planned Leaves</p>
              </div>
            </div>
          </Card>

          <Card className='p-6'>
            <div className='flex items-center gap-4'>
              <div>
                <div className='flex items-baseline gap-2'>
                  <span className='text-3xl font-bold'>12</span>
                  <span className='text-muted-foreground'>/ 1206</span>
                </div>
                <p className='text-sm text-muted-foreground'>
                  Unplanned Leaves
                </p>
              </div>
            </div>
          </Card>

          <Card className='p-6'>
            <div className='flex items-center gap-4'>
              <div>
                <div className='flex items-baseline gap-2'>
                  <span className='text-3xl font-bold'>50</span>
                  <span className='text-muted-foreground'>/ 70</span>
                </div>
                <p className='text-sm text-muted-foreground'>
                  Pending Requests
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='mx-auto w-[calc(100vw-2rem)] max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl'>
          <DialogHeader>
            <DialogTitle>Request Leave</DialogTitle>
          </DialogHeader>
          <LeaveForm initialLeaveTypes={initialLeaveTypes} />
        </DialogContent>
      </Dialog>
    </>
  );
}
