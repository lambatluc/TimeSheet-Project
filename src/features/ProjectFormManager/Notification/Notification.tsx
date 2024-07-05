import React from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useOutletContext } from 'react-router-dom';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { LABEL_NOTIFICATION } from '@/constants';

const Notification = (): JSX.Element => {
  const { formNotification } = useOutletContext<{
    formNotification: UseFormReturn<{
      komuChannelId: string
      isNoticeKMApproveRequestOffDate: boolean
      isNoticeKMRequestOffDate: boolean
      isNoticeKMApproveChangeWorkingTime: boolean
      isNoticeKMRequestChangeWorkingTime: boolean
      isNoticeKMSubmitTS: boolean
    }, any, undefined>
  }>();
  return (
    <Form {...formNotification}>
      <form>
        <div className='w-full min-h-[60vh]'>
          <div className="w-full">
            <FormField
              control={formNotification.control}
              name="komuChannelId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Komu Chanel Id"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <div>
              <FormField
                control={formNotification.control}
                name="isNoticeKMSubmitTS"
                render={({ field }) => (
                  <FormItem className="pt-5 pb-3">
                    <FormControl>
                      <Checkbox
                        id='isNoticeKMSubmitTS'
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-primary-500 pl-5" htmlFor='isNoticeKMSubmitTS'>{LABEL_NOTIFICATION.LABEL_1}</FormLabel>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField
                control={formNotification.control}
                name="isNoticeKMRequestOffDate"
                render={({ field }) => (
                  <FormItem className="pb-3">
                    <FormControl>
                      <Checkbox
                        id='isNoticeKMRequestOffDate'
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-primary-500 pl-5" htmlFor='isNoticeKMRequestOffDate'>
                      {LABEL_NOTIFICATION.LABEL_2}
                    </FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={formNotification.control}
                name="isNoticeKMApproveRequestOffDate"
                render={({ field }) => (
                  <FormItem className="pb-3">
                    <FormControl>
                      <Checkbox
                        id='isNoticeKMApproveRequestOffDate'
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-primary-500 pl-5" htmlFor='isNoticeKMApproveRequestOffDate'>
                      {LABEL_NOTIFICATION.LABEL_3}
                    </FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={formNotification.control}
                name="isNoticeKMRequestChangeWorkingTime"
                render={({ field }) => (
                  <FormItem className="pb-3">
                    <FormControl>
                      <Checkbox
                        id='isNoticeKMRequestChangeWorkingTime'
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-primary-500 pl-5" htmlFor='isNoticeKMRequestChangeWorkingTime'>
                      {LABEL_NOTIFICATION.LABEL_4}
                    </FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={formNotification.control}
                name="isNoticeKMApproveChangeWorkingTime"
                render={({ field }) => (
                  <FormItem className="pb-3">
                    <FormControl>
                      <Checkbox
                        id='isNoticeKMApproveChangeWorkingTime'
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-primary-500 pl-5" htmlFor='isNoticeKMApproveChangeWorkingTime'>
                      {LABEL_NOTIFICATION.LABEL_5}
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default Notification;
