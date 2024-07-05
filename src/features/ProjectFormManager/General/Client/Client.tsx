import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { saveNewClient } from '@/api';
import toast from 'react-hot-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { validateError } from '@/utils';
import { ButtonName, ERROR_MESSAGES, LABEL_GENERAL, TOAST_MESSAGES } from '@/constants';
interface Props {
  openDia: boolean
  setOpenDia: React.Dispatch<React.SetStateAction<boolean>>
  refetchData: () => void
}
const schema = z.object({
  name: z
    .string()
    .min(2, {
      message: ERROR_MESSAGES.client.require_name
    })
    .trim(),
  code: z
    .string()
    .min(2, {
      message: ERROR_MESSAGES.client.require_code
    })
    .trim(),
  address: z.string().trim()
});
const Client = ({ openDia, setOpenDia, refetchData }: Props): JSX.Element => {
  useEffect(() => {
    if (!openDia) {
      form.reset();
    }
  }, [openDia]);
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      code: '',
      address: ''
    }
  });
  const handleAddClient = async (): Promise<void> => {
    const formData = form.getValues();
    const formDataValid = await form.trigger();
    setSubmitting(true);
    if (!formDataValid) {
      toast.error(TOAST_MESSAGES.error.client_invalid);
      setSubmitting(false);
      return;
    }
    try {
      await saveNewClient({ ...formData });
      refetchData();
      toast.success(TOAST_MESSAGES.success.create_success);
      setOpenDia(false);
      setSubmitting(false);
    } catch (error) {
      setSubmitting(false);
      toast.error(validateError(error));
    }
  };
  return (
    <Dialog open={openDia} onOpenChange={setOpenDia}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className='text-center text-2xl border-b-2 border-primary-400 pb-5'>{LABEL_GENERAL.DIALOG_TITLE}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <div className='pb-5 pt-5'>
                    <FormLabel htmlFor='name'>{LABEL_GENERAL.DIALOG_LABEL_NAME}<span className='text-red-500'>*</span></FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Client Name'
                        className='mt-2'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage/>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='code'
              render={({ field }) => (
                <FormItem>
                  <div className='pb-5'>
                    <FormLabel htmlFor='code'>{LABEL_GENERAL.DIALOG_LABEL_CODE}<span className='text-red-500'>*</span></FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Code'
                        className='mt-2'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage/>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='address'
              render={({ field }) => (
                <FormItem>
                  <div className='pb-5'>
                    <FormLabel htmlFor='address'>{LABEL_GENERAL.DIALOG_LABEL_ADDRESS}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Address'
                        className='mt-2'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage/>
                  </div>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type='button'
                onClick={() => { void handleAddClient(); }}
                disabled={submitting}>{ButtonName.saveButton}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default Client;
