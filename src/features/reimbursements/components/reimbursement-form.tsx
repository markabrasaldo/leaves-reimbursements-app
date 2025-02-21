'use client';

import { useEffect } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import {
  ReimbursementType,
  useReimbursementStore
} from '../utils/reimbursement-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Attachment, Reimbursement } from '../types';
import React from 'react';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

const formSchema = z.object({
  attachments: z
    .any()
    .refine((files) => files?.length == 1, 'Image is required.')
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      '.jpg, .jpeg, .png and .webp files are accepted.'
    ),
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.'
  }),
  reimbursementType: z.string(),
  amount: z.number(),
  status: z.string(),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.'
  })
});

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
    reimbursementType: initialData?.reimbursementType?.name || '',
    amount: initialData?.amount || 0,
    description: initialData?.description || '',
    status: initialData?.status || '',
    attachments: newFiles
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: defaultValues
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const payload = {
      ...initialData,
      ...values,
      created_by: 'temp',
      updated_by: 'temp'
    };
  }

  const { reimbursementTypes, initializeReimbursementTypes } =
    useReimbursementStore();

  useEffect(() => {
    initializeReimbursementTypes(reimbursementTypesData);
  }, [reimbursementTypesData, initializeReimbursementTypes]);

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
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
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select reimbursement' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {reimbursementTypes?.map((value) => {
                            return (
                              <SelectItem value={value.name} key={value.id}>
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
                        step='0.01'
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
            <Button type='submit'>
              {initialData ? 'Submit' : 'Add Reimbursement'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
