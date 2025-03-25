'use client';

import type React from 'react';

import { startTransition, useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Loader2, Upload } from 'lucide-react';
import { uploadCSVAction } from '../actions/actions';

export default function UploadCSV() {
  const [uploadCSVState, uploadCSVRequestAction, isRequesting] = useActionState(
    uploadCSVAction,
    {
      status: '',
      message: ''
    }
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    startTransition(() => {
      uploadCSVRequestAction(formData);
    });
  };

  return (
    <form>
      <Button
        variant='outline'
        className='w-full sm:w-auto'
        type='button'
        disabled={isRequesting}
      >
        <label className='flex w-full cursor-pointer items-center justify-center gap-2'>
          {isRequesting ? (
            <Loader2 className='h-4 w-4 animate-spin' />
          ) : (
            <Upload className='h-4 w-4' />
          )}
          {isRequesting ? 'Processing...' : 'Choose CSV File'}
          <Input
            type='file'
            name='file'
            accept='.csv,.xlsx,.xls'
            onChange={handleFileChange}
            className='hidden'
            disabled={isRequesting}
          />
        </label>
      </Button>
    </form>
  );
}
