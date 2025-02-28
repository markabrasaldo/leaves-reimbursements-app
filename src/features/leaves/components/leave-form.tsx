'use client';

import React, {
  startTransition,
  useActionState,
  useEffect,
  useState
} from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { leaveAction, submitForm } from '../actions/actions';
import { useLeaveStore } from '../utils/leave-store';
import { toastUtil } from '@/app/utils/toastUtil';
import { Leave, LeaveType } from '../types';
import { useForm } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form
} from '@/components/ui/form';
import { schema } from '../actions/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Roles } from 'next-auth';
import { cn } from '@/lib/utils';

export function LeaveForm({
  leaveTypesData,
  initialData,
  pageTitle
}: {
  leaveTypesData: LeaveType[];
  initialData: Leave | null;
  pageTitle: string;
}) {
  const [state, formAction, isPending] = useActionState(submitForm, {
    status: '',
    message: '',
    formData: {
      startDate: '',
      endDate: '',
      leaveType: '',
      status: ''
    }
  });

  const [leaveRequestState, leaveRequestAction, isRequesting] = useActionState(
    leaveAction,
    {
      status: '',
      message: ''
    }
  );

  const defaultValues = {
    startDate:
      initialData?.start_date || (state?.formData?.startDate as string) || '',
    endDate:
      initialData?.end_date || (state?.formData?.endDate as string) || '',
    leaveType:
      initialData?.leave_type?.id ||
      (state?.formData?.leaveType as string) ||
      '',
    remarks: initialData?.remarks || (state?.formData?.remarks as string) || '',
    status: initialData?.status || ''
  };

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    values: defaultValues
  });

  //will refactor below code into a dropdown provider
  const { leaveTypes, initializeLeaveTypes } = useLeaveStore();

  const { data } = useSession();
  const isAdmin = data?.user?.role === ('Administrator' as unknown as Roles);
  const userAllowedToCancel =
    data?.user?.user_id === initialData?.user_id &&
    initialData?.status !== 'REJECTED';

  const [isMobile, setIsMobile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (state?.status) {
      toastUtil(state);
      if (state?.status === 'success') redirect('/dashboard/leave');
    }
    if (leaveRequestState?.status) {
      toastUtil(leaveRequestState);
      if (leaveRequestState?.status === 'success') redirect('/dashboard/leave');
    }
  }, [state, leaveRequestState]);

  //will refactor below code into a dropdown provider
  useEffect(() => {
    initializeLeaveTypes(leaveTypesData);
  }, [leaveTypesData, initializeLeaveTypes]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    form.trigger();
    const formData = new FormData(event.currentTarget);

    if (isEditing) {
      formData.append('status', initialData?.status as string);
      formData.append('leaveId', initialData?.id as string);
    }

    startTransition(() => {
      formAction(formData);
    });
  };

  const handleLeaveActionsRequest = async (action: string) => {
    const formData = new FormData();

    formData.append('action', action);
    formData.append('leaveId', initialData?.id as string);

    startTransition(() => {
      leaveRequestAction(formData);
    });
  };

  const createdLeaveRequestStatus = [
    'DRAFT',
    'SUBMITTED',
    'APPROVED',
    'REJECTED',
    'CANCEL'
  ].includes(initialData?.status as string);

  const fieldsDisabled = !isEditing && createdLeaveRequestStatus;

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          <div className='flex flex-row justify-between'>
            {pageTitle}
            {userAllowedToCancel && (
              <Button
                className={cn('border-red-400 text-red-400')}
                variant='outline'
                type='button'
                onClick={() => handleLeaveActionsRequest('cancel')}
              >
                Cancel
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleFormSubmit} className='space-y-8'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='leaveType'
                disabled={fieldsDisabled}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Leave Type</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(value)}
                        {...form.register('leaveType', {
                          required: true
                        })}
                        {...field}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select leave' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {leaveTypes?.map((value) => {
                            return (
                              <SelectItem value={value.id} key={value.id}>
                                {value.name}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name='remarks'
                disabled={fieldsDisabled}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remarks</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='startDate'
                disabled={fieldsDisabled}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type='date' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='endDate'
                disabled={fieldsDisabled}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type='date' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {initialData?.status && (
                <FormField
                  control={form.control}
                  name='status'
                  disabled={true}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className='space-x-2'>
              {initialData?.status === 'SUBMITTED' && isAdmin && (
                <>
                  <Button
                    type='button'
                    onClick={() => handleLeaveActionsRequest('approve')}
                  >
                    Approve
                  </Button>
                  <Button
                    type='button'
                    onClick={() => handleLeaveActionsRequest('reject')}
                  >
                    Reject
                  </Button>
                </>
              )}

              {!createdLeaveRequestStatus && (
                <Button type='submit' disabled={isPending}>
                  {isPending
                    ? 'Please wait ...'
                    : initialData
                      ? 'Submit'
                      : 'Request Leave'}
                </Button>
              )}

              {initialData?.status === 'DRAFT' && !isEditing && (
                <>
                  <Button
                    type='button'
                    onClick={() => handleLeaveActionsRequest('submit')}
                    disabled={isPending}
                  >
                    {isPending ? 'Submitting Request...' : 'Submit Leave'}
                  </Button>
                  <Button
                    type='button'
                    onClick={() => setIsEditing((prev) => !prev)}
                  >
                    Edit
                  </Button>
                </>
              )}

              {isEditing && (
                <>
                  <Button type='submit' disabled={isPending}>
                    {isPending ? 'Please wait ...' : 'Save as draft'}
                  </Button>
                  <Button
                    type='button'
                    onClick={() => setIsEditing((prev) => !prev)}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
