import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { IUserCredential } from '@/types';
import { useSignIn } from './hooks';
import { signInSuccess } from '@/store/slice/auth/authSlice';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Checkbox } from '@/components/ui/checkbox';
import toast from 'react-hot-toast';
import { ButtonName, ERROR_MESSAGES, HOME, LABEL_LOGIN, TOAST_MESSAGES } from '@/constants';
import { validateError } from '@/utils';
const schema = z.object({
  userNameOrEmailAddress: z.string().min(1, {
    message: ERROR_MESSAGES.login.requireUser
  }),
  password: z.string().min(1, {
    message: ERROR_MESSAGES.login.requirePassword
  }),
  rememberClient: z.boolean().default(false)
});
export default function Login (): JSX.Element {
  const [submitting, setSubmitting] = useState(false);
  const { signIn } = useSignIn();
  const navig = useNavigate();
  const dispatch = useDispatch();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      userNameOrEmailAddress: '',
      password: '',
      rememberClient: false
    }
  });
  const handleSubmit = form.handleSubmit(async (values: IUserCredential): Promise<void> => {
    setSubmitting(true);
    try {
      const value = await signIn(values);
      const accessToken = value.result.accessToken;
      dispatch(signInSuccess(accessToken));
      navig(HOME);
      toast.success(TOAST_MESSAGES.success.login_success);
    } catch (error) {
      setSubmitting(false);
      toast.error(validateError(error));
    }
  });
  return (
    <main className='bg-gradient-to-t from-gray-300 to-gray-400 h-screen flex items-center justify-center p-10'>
      <div className='grid box-animate w-full h-full grid-cols-1 bg-gray-100 md:grid-cols-2'>
        <div className='bg-[rgb(237 237 237)] text-primary-600 flex items-center justify-center flex-col'>
          <div className='my-4 text-center'>
            <h1 className='text-3xl font-semibold'>{LABEL_LOGIN.TITLE}</h1>
          </div>
          <Form {...form}>
            <form onSubmit={(e) => {
              e.preventDefault();
              void handleSubmit();
            }}>
              <FormField
                control={form.control}
                name='userNameOrEmailAddress'
                render={({ field }) => (
                  <FormItem className='pb-3'>
                    <FormLabel htmlFor='userNameOrEmailAddress'>{LABEL_LOGIN.LABEL_USER} <span className='text-red'>*</span></FormLabel>
                    <FormControl>
                      <Input
                        className='mt-2 mb-4 bg-transparent rounded-md'
                        type='text'
                        id='userNameOrEmailAddress'
                        placeholder='User name or Email..'
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
                  <FormItem className='pb-3'>
                    <FormLabel htmlFor='password'>{LABEL_LOGIN.LABEL_PASSWORD} <span className='text-red'>*</span></FormLabel>
                    <FormControl>
                      <Input
                        className='mt-2 mb-4 bg-transparent rounded-md'
                        type='password'
                        id='password'
                        placeholder='Password'
                        { ...field }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rememberClient"
                render={({ field }) => (
                  <FormItem>
                    <div className='flex items-center justify space-x-2'>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="leading-none">
                        <FormLabel>{LABEL_LOGIN.LABEL_RE}</FormLabel>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit' className='w-full mt-6 text-white' disabled={submitting}>
                {ButtonName.loginButton}
              </Button>
            </form>
          </Form>
        </div>
        <div className='relative hidden md:flex md:items-center md:justify-center bg-gradient-to-r from-primary-400 to-primary-600'>
          <div className='my-4 text-center'>
            <h1 className='text-5xl font-semibold text-white'>{LABEL_LOGIN.TEXT_LOGIN}</h1>
            <p className='mt-2 text-2xl text-white '>
              {''}
              {LABEL_LOGIN.TEXT_PAGE}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
