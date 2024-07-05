import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ButtonName, DateRange, pageTitle } from '@/constants/projectType';
import toast from 'react-hot-toast';
import { ERROR_MESSAGES, TOAST_MESSAGES } from '@/constants';
interface Props {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  updateParams: (newStartDate: Date | undefined, newEndDate: Date | undefined, newSelect: DateRange) => void
  setStartDate: React.Dispatch<React.SetStateAction<Date | undefined>>
  setEndDate: React.Dispatch<React.SetStateAction<Date | undefined>>
}
const formSchema = z.object({
  startDate: z.date({
    message: ERROR_MESSAGES.customTime.requireStart
  }),
  endDate: z.date({
    message: ERROR_MESSAGES.customTime.requireEnd
  })
}).refine(data => {
  if (data.startDate !== null && data.startDate !== undefined && data.endDate !== null && data.endDate !== undefined) {
    return new Date(data.startDate) <= new Date(data.endDate);
  }
  return true;
}, {
  path: ['endDate'],
  message: ERROR_MESSAGES.general.time_end_after_start
});
const CustomDate = ({ open, setOpen, updateParams, setEndDate, setStartDate }: Props): JSX.Element => {
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });
  const handleSubmit = async (): Promise<void> => {
    const dateValid = await form.trigger();
    if (!dateValid) {
      toast.error(TOAST_MESSAGES.error.client_invalid);
      setSubmitting(false);
      return;
    }

    const date = form.getValues();
    setEndDate(date.endDate);
    setStartDate(date.startDate);
    setSubmitting(true);

    updateParams(date.startDate, date.endDate, 'custom');
    setOpen(false);
    form.reset();
    setSubmitting(false);
  };
  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className='text-center text-xl'>{pageTitle.selectData}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form>
            <div className='space-y-5'>
              <div className='space-y-5'>
                <FormField
                  control={form.control}
                  name='startDate'
                  render={({ field }) => (
                    <FormItem className='space-y-5'>
                      <FormLabel>
                        Start Date: <span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  'w-full pl-3 text-left font-normal',
                                  field.value === undefined &&
                                    'text-muted-foreground'
                                )}
                              >
                                {field.value !== undefined
                                  ? format(field.value, 'dd-MM-yyyy')
                                  : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date('1900-01-01')}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='endDate'
                  render={({ field }) => (
                    <FormItem className='space-y-5'>
                      <FormLabel>
                    End Date: <span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  'w-full pl-3 text-left font-normal',
                                  field.value === undefined &&
                                    'text-muted-foreground'
                                )}
                              >
                                {field.value !== undefined
                                  ? format(field.value, 'dd-MM-yyyy')
                                  : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date('1900-01-01')}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="button"
                  onClick={() => {
                    void handleSubmit();
                  }}
                  disabled={submitting}
                >{ButtonName.saveButton}</Button>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomDate;
