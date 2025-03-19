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
import { redirect, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Roles } from 'next-auth';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

export function LeaveForm({
  leaveTypesData,
  initialData,
  pageTitle
}: {
  leaveTypesData: LeaveType[];
  initialData: Leave | null;
  pageTitle: string;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isRejecting, setRejectStatus] = useState(false);

  const searchParams = useSearchParams();
  const calendarStartDate = searchParams.get('start_date');

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
      initialData?.start_date ||
      (state?.formData?.startDate as string) ||
      calendarStartDate ||
      '',
    endDate:
      initialData?.end_date || (state?.formData?.endDate as string) || '',
    leaveType:
      initialData?.leave_type?.id ||
      (state?.formData?.leaveType as string) ||
      '',
    descriptions:
      initialData?.descriptions ||
      (state?.formData?.descriptions as string) ||
      '',
    remarks: initialData?.remarks || (state?.formData?.remarks as string) || '',
    status: initialData?.status || '',
    daysApplied: initialData?.days_applied || 0
  };

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    values: defaultValues
  });

  //Note: refactor below code into a dropdown provider
  const { leaveTypes, initializeLeaveTypes } = useLeaveStore();

  const { data } = useSession();

  const createdLeaveRequestStatus = [
    'DRAFT',
    'SUBMITTED',
    'APPROVED',
    'REJECTED',
    'CANCEL'
  ].includes(initialData?.status as string);

  const fieldsDisabled = !isEditing && createdLeaveRequestStatus;
  const isAdmin = data?.user?.role === ('Administrator' as unknown as Roles);
  const userAllowedToCancel =
    data?.user?.user_id === initialData?.user_id &&
    initialData?.status === 'APPROVED';

  useEffect(() => {
    if (state?.status) {
      toastUtil(state);
      if (state?.status === 'success') {
        redirect(
          calendarStartDate ? '/dashboard/overview' : '/dashboard/leave'
        );
      }
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
    formData.append('remarks', remarksInputValue as string);

    const leavesFormData = Object.fromEntries(formData);

    startTransition(() => {
      leaveRequestAction(formData);
    });
  };

  const remarksInputValue = form.watch('remarks');

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          <div className='flex flex-row justify-between'>{pageTitle}</div>
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
              <div className='col-span-2 grid grid-cols-subgrid gap-4'>
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
              </div>

              {createdLeaveRequestStatus && (
                <div className='col-span-2 grid grid-cols-subgrid gap-4'>
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
                  <FormField
                    control={form.control}
                    name='daysApplied'
                    disabled={true}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Days Applied</FormLabel>
                        <FormControl>
                          <Input type='number' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <div className='col-span-full'>
                <FormField
                  control={form.control}
                  name='descriptions'
                  disabled={fieldsDisabled}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Leave reason</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {(isRejecting || initialData?.status === 'REJECTED') && (
                <div className='col-span-full'>
                  <FormField
                    control={form.control}
                    name='remarks'
                    disabled={!isRejecting}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Remarks (Min. 6 characters)</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            <div className='space-x-2'>
              {/* Start of buttons for approval scenario. */}
              {initialData?.status === 'SUBMITTED' &&
                !isRejecting &&
                isAdmin && (
                  <>
                    <Button
                      type='button'
                      onClick={() => handleLeaveActionsRequest('approve')}
                    >
                      Approve
                    </Button>
                    <Button
                      type='button'
                      onClick={() => setRejectStatus((prev) => !prev)}
                    >
                      Reject
                    </Button>
                  </>
                )}

              {isRejecting && isAdmin && (
                <>
                  <Button
                    type='button'
                    disabled={
                      !remarksInputValue || remarksInputValue.length < 6
                    }
                    onClick={() => {
                      handleLeaveActionsRequest('reject');
                    }}
                  >
                    Proceed to Reject
                  </Button>
                  <Button
                    type='button'
                    onClick={() => setRejectStatus((prev) => !prev)}
                  >
                    Cancel
                  </Button>
                </>
              )}
              {/* End of buttons for approval scenario. */}

              {/* Start of button for positng leaves. */}
              {!createdLeaveRequestStatus && (
                <Button type='submit' disabled={isPending}>
                  {isPending
                    ? 'Please wait ...'
                    : initialData
                      ? 'Submit'
                      : 'Request Leave'}
                </Button>
              )}
              {/* End of button for positng leaves. */}

              {/* Start of button for updating draft leaves. */}
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
              {/* End of button for updating draft leaves. */}

              {/* Start of button for canceling leaves. */}
              {userAllowedToCancel && (
                <Button
                  className={cn('border-red-400 text-red-400')}
                  variant='outline'
                  type='button'
                  onClick={() => handleLeaveActionsRequest('cancel')}
                >
                  Cancel Request
                </Button>
              )}
              {/* End of button for canceling leaves. */}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
