'use client';

import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState
} from 'react';
import { FileUploader } from '@/components/form/file-uploader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  ReimbursementType,
  useReimbursementStore
} from '../utils/reimbursement-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Attachment, Reimbursement } from '../types';
import React from 'react';
import { reimbursementAction, submitForm } from '../actions/form';
import { schema } from '../actions/schema';
import { toast } from 'sonner';
import { redirect, useParams } from 'next/navigation';
import { format } from 'date-fns';
import { toastUtil } from '@/app/utils/toastUtil';
import { Textarea } from '@/components/ui/textarea';
import { useSession } from 'next-auth/react';
import { Roles } from 'next-auth';

export default function ReimbursementForm({
  reimbursementTypesData,
  initialData,
  pageTitle
}: {
  reimbursementTypesData: ReimbursementType[];
  initialData: Reimbursement | null;
  pageTitle: string;
}) {
  const { data } = useSession();

  const [isRejecting, setRejectStatus] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const isAdmin = data?.user?.role === ('Administrator' as unknown as Roles);

  const newFiles = initialData?.attachments?.map((image: Attachment) => {
    const blob = new Blob([JSON.stringify(image, null, 2)], {
      type: image.file_type
    });

    let file = new File([blob], image.file_name, {
      type: image.file_type
    });

    return file;
  });

  const defaultValues = {
    name: initialData?.organization?.name || '',
    reimbursementType:
      initialData?.reimbursement_type?.code ||
      // initialData['reimbursement_type_code'] ||
      '',
    amount: initialData?.amount || 0,
    description: initialData?.description || '',
    status: initialData?.status || '',
    dateRequested: initialData ? format(initialData?.date!, 'yyyy-MM-dd') : '',
    attachments: newFiles,
    remarks: initialData?.remarks || ''
  };

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    values: defaultValues
  });

  const [state, formAction, isPending] = useActionState(
    submitForm,
    defaultValues
  );
  const [reimbursementState, reimbursemenAction, isReimbursementRequesting] =
    useActionState(reimbursementAction, {
      status: '',
      message: ''
    });

  useEffect(() => {
    if (state?.status) {
      toastUtil(state);
      if (state?.status === 'success') redirect('/dashboard/reimbursement');
    }
    if (reimbursementState?.status) {
      toastUtil(reimbursementState);
      if (reimbursementState?.status === 'success')
        redirect('/dashboard/reimbursement');
    }
  }, [state, reimbursementState]);

  const { reimbursementTypes, initializeReimbursementTypes } =
    useReimbursementStore();

  useEffect(() => {
    initializeReimbursementTypes(reimbursementTypesData);
  }, [reimbursementTypesData, initializeReimbursementTypes]);

  const onProcessReimbursement = [
    'DRAFT',
    'APPROVED',
    'REJECTED',
    'REIMBURSED',
    'SUBMITTED'
  ].includes(initialData?.status as string);

  const fieldsDisabled = !isEditing && onProcessReimbursement;

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    form.trigger();

    const formData = new FormData(event.currentTarget);
    const attachments = form.getValues('attachments');

    if (isEditing) {
      formData.append('status', initialData?.status as string);
      formData.append('reimbursementId', initialData?.id as string);
    }

    if (attachments && attachments.length) {
      for (let i = 0; i < attachments.length; i++) {
        formData.append('files', attachments[i], attachments[i].name);
      }
    }

    startTransition(() => {
      formAction(formData);
    });
  };

  const handleReimbursementActionsRequest = async (action: string) => {
    const formData = new FormData();
    formData.append('action', action);
    formData.append('reimbursementId', initialData?.id as string);
    formData.append('remarks', remarksInputValue as string);

    startTransition(() => {
      reimbursemenAction(formData);
    });
  };

  const remarksInputValue = form.watch('remarks');

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleFormSubmit} className='space-y-8'>
            <FormField
              control={form.control}
              name='attachments'
              render={({ field }) => {
                return (
                  <div className='space-y-6'>
                    <FormItem className='w-full'>
                      <FormLabel>Attachment</FormLabel>
                      <FormControl>
                        <FileUploader
                          value={field.value}
                          onValueChange={field.onChange}
                          maxFiles={4}
                          maxSize={4 * 1024 * 1024}
                          // register={form.register('attachments')}
                          // disabled={loading}
                          // progresses={progresses}
                          // pass the onUpload function here for direct upload
                          // onUpload={uploadFiles}
                          disabled={fieldsDisabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
                );
              }}
            />
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='reimbursementType'
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Reimbursement Type</FormLabel>
                      <Select
                        disabled={fieldsDisabled}
                        onValueChange={(value) => field.onChange(value)}
                        value={field.value}
                        {...form.register('reimbursementType', {
                          required: true
                        })}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select reimbursement' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {reimbursementTypes?.map((value) => {
                            return (
                              <SelectItem value={value.code} key={value.code}>
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
                name='amount'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        disabled={fieldsDisabled}
                        type='number'
                        min={0}
                        placeholder='Enter amount'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {initialData?.status && (
                <>
                  <FormField
                    control={form.control}
                    name='dateRequested'
                    disabled={fieldsDisabled}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date Requested</FormLabel>
                        <FormControl>
                          <Input type='date' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='status'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                          <Input disabled={fieldsDisabled} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

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
              {initialData?.status === 'SUBMITTED' &&
                !isRejecting &&
                isAdmin && (
                  <>
                    <Button
                      type='button'
                      onClick={() =>
                        handleReimbursementActionsRequest('approve')
                      }
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

              {initialData?.status === 'APPROVED' && isAdmin && (
                <>
                  <Button
                    type='button'
                    onClick={() =>
                      handleReimbursementActionsRequest('reimburse')
                    }
                  >
                    Reimburse
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
                    onClick={() => handleReimbursementActionsRequest('reject')}
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
              {!onProcessReimbursement && (
                <Button type='submit' disabled={isPending}>
                  {isPending
                    ? 'Please wait ...'
                    : initialData
                      ? 'Submit'
                      : 'Save as draft'}
                </Button>
              )}

              {initialData?.status === 'DRAFT' && !isEditing && (
                <>
                  <Button
                    type='button'
                    onClick={() => handleReimbursementActionsRequest('submit')}
                    disabled={isPending}
                  >
                    {isPending
                      ? 'Please wait ...'
                      : initialData
                        ? 'Submit'
                        : 'Save as draft'}
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
