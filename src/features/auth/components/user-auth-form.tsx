'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useActionState, useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { authentication } from '@/lib/auth-action';

const formSchema = z.object({
  email: z.string().trim().email({ message: 'Enter a valid email address' }),
  password: z
    .string()
    .trim()
    .min(6, { message: 'Minimum of 6 characters or digits' })
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const defaultValues = {
    email: '',
    password: ''
  };

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const [isPending, startTransition] = useTransition();
  const [loginState, loginFormAction] = useActionState(
    authentication,
    undefined
  );

  useEffect(() => {
    if (loginState?.messageType === 'success') {
      toast.success(loginState.message);
    } else if (loginState?.messageType === 'error') {
      toast.error(loginState.message);
    }
  }, [loginState]);

  const onSubmit = (data: UserFormValue) => {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);

    startTransition(() => {
      loginFormAction(formData);
    });
  };

  return (
    <>
      <Form {...form}>
        <form
          className='w-full space-y-2'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='Enter your email...'
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='Enter your password...'
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {loginState?.messageType === 'error' && (
            <div
              className='mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-gray-800 dark:text-red-400'
              role='alert'
            >
              <span className='font-medium'>{loginState.message}</span>
            </div>
          )}
          <Button disabled={isPending} className='ml-auto w-full' type='submit'>
            Sign In
          </Button>
        </form>
      </Form>
    </>
  );
}
