'use client';

import { startTransition, useActionState, useEffect, useRef } from 'react';
import { FileUploader } from '@/components/file-uploader';
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
import { submitForm } from '../actions/form';
import { schema } from '../actions/schema';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';

export default function ReimbursementForm({
  reimbursementTypesData,
  initialData,
  pageTitle
}: {
  reimbursementTypesData: ReimbursementType[];
  initialData: Reimbursement | null;
  pageTitle: string;
}) {
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
    reimbursementType: initialData?.reimbursement_type?.code || '',
    amount: initialData?.amount || 0,
    description: initialData?.description || '',
    status: initialData?.status || '',
    attachments: newFiles
  };

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    values: defaultValues
  });

  const [state, formAction, isPending] = useActionState(
    submitForm,
    defaultValues
  );

  useEffect(() => {
    if (state?.status === 'ok') {
      toast.success(state?.message);

      redirect(`/dashboard/reimbursement`);
    }
  }, [state]);

  const { reimbursementTypes, initializeReimbursementTypes } =
    useReimbursementStore();

  useEffect(() => {
    initializeReimbursementTypes(reimbursementTypesData);
  }, [reimbursementTypesData, initializeReimbursementTypes]);

  const onProcessReimbursement =
    ['APPROVED', 'REJECTED', 'REIMBURSED'].includes(
      initialData?.status as string
    ) || initialData?.status === 'SUBMITTED';

  const formRef = useRef<HTMLFormElement>(null);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    form.trigger();
    const formData = new FormData(event.currentTarget);
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form ref={formRef} onSubmit={handleFormSubmit} className='space-y-8'>
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
                          register={form.register('attachments')}
                          // disabled={loading}
                          // progresses={progresses}
                          // pass the onUpload function here for direct upload
                          // onUpload={uploadFiles}
                          // disabled={isUploading}
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
                <FormField
                  control={form.control}
                  name='status'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Input disabled={true} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <div className='space-x-2'>
              {initialData?.status === 'SUBMITTED' && (
                <>
                  <Button type='submit'>Approve</Button>
                  <Button type='submit'>Reject</Button>
                </>
              )}
              {!onProcessReimbursement && (
                <Button type='submit' disabled={isPending}>
                  {isPending
                    ? 'Please wait ...'
                    : initialData
                      ? 'Submit'
                      : 'Add Reimbursement'}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
