import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { CalendarMinus2, ChevronDown, Check, UserPlus } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ButtonName, projectTypeDisplayMap } from '@/constants/projectType';
import { IClient } from '@/types';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Command, CommandGroup } from '@/components/ui/command';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useOutletContext } from 'react-router-dom';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import Client from './Client/Client';
import { LABEL_GENERAL } from '@/constants';
const General = (): JSX.Element => {
  const { clients, refetchData, formGeneral } = useOutletContext<{
    clients: IClient[]
    id?: string
    refetchData: () => void
    handleSubmit: () => void
    formGeneral: UseFormReturn<{
      customerId: number
      code: string
      isAllUserBelongTo: boolean
      projectType: number
      note: string
      name: string
      timeStart: string
      timeEnd: string
    }, any, undefined>
  }>();
  const [searchClient, setSearchClient] = useState('');
  const [openDia, setOpenDia] = useState(false);
  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchClient.toLowerCase())
  );
  return (
    <div className="min-h-[60vh]">
      <Client openDia={openDia} setOpenDia={setOpenDia} refetchData={refetchData}/>
      <Form {...formGeneral}>
        <form>
          <div className="flex">
            <FormField
              control={formGeneral.control}
              name="customerId"
              render={({ field }) => (
                <FormItem className="block md:flex-row justify-start items-center">
                  <div className='flex'>
                    <FormLabel
                      htmlFor="client"
                      className="w-40 text-base"
                    >
                      {LABEL_GENERAL.CLIENT_LABEL} <span className='text-red-500'>*</span>
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              'w-full md:w-[48.4vw] flex justify-between mt-2 md:mt-0',
                              formGeneral.getValues('customerId') === 0 && 'text-muted-foreground'
                            )}
                          >
                            {formGeneral.getValues('customerId') !== undefined
                              ? clients.find(
                                (client) => client.id === formGeneral.getValues('customerId')
                              )?.name
                              : 'Choose a client'}
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[48.5vw] h-96 p-0">
                        <Command>
                          <Input
                            placeholder="Search client..."
                            className="h-9 focus-visible: ring-white"
                            onInput={(e) => setSearchClient(e.currentTarget.value)}
                          />
                          <CommandGroup className="overflow-y-auto">
                            {filteredClients.map((client) => (
                              <div
                                key={client.id}
                                onClick={() => {
                                  if (client.id !== 0) {
                                    formGeneral.setValue('customerId', client.id);
                                  }
                                }}
                                className={cn(
                                  'cursor-pointer',
                                  client.id === field.value
                                    ? 'text-primary-600'
                                    : 'text-gray-500',
                                  'flex items-center justify-center hover:bg-gray-100 p-3'
                                )}
                              >
                                {client.name}
                                <Check
                                  className={cn(
                                    'ml-auto h-4 w-4',
                                    client.id === field.value
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )}
                                />
                              </div>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <FormMessage className='w-40 ml-40'/>
                </FormItem>
              )}
            />
            <Button type='button' className="xl:ml-10 xl:text-white xl:flex xl:justify-center hidden" onClick={() => { setOpenDia(true); }}>{ButtonName.newClientButton}</Button>
            <UserPlus className='pl-5 w-14 h-10 text-primary-400' onClick={() => { setOpenDia(true); }}/>
          </div>
          <FormField
            control={formGeneral.control}
            name="name"
            render={({ field }) => (
              <FormItem className="block md:flex-row justify-start items-center mt-4">
                <div className='flex'>
                  <FormLabel
                    htmlFor="name"
                    className="w-40 text-base"
                  >
                    {LABEL_GENERAL.PROJECT_NAME_LABEL} <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Project name..."
                      {...field}
                      className="w-full md:w-[48.4vw] mt-2 md:mt-0"
                    />
                  </FormControl>
                </div>
                <FormMessage className='w-44 ml-40'/>
              </FormItem>
            )}
          />
          <FormField
            control={formGeneral.control}
            name="code"
            render={({ field }) => (
              <FormItem className="block md:flex-row justify-start items-center mt-4">
                <div className='flex'>
                  <FormLabel
                    htmlFor="code"
                    className="w-40 text-base"
                  >
                    {LABEL_GENERAL.PROJECT_CODE_LABEL} <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Project code..."
                      {...field}
                      className="w-full md:w-[48.4vw] mt-2 md:mt-0"
                    />
                  </FormControl>
                </div>
                <FormMessage className='w-40 ml-40'/>
              </FormItem>
            )}
          />
          <div className="flex md:flex-row mt-4 items-center">
            <div className="w-40 text-base">
              <span>{LABEL_GENERAL.DATE_LABEL}</span>
            </div>
            <FormField
              control={formGeneral.control}
              name="timeStart"
              render={({ field }) => (
                <FormItem className="flex flex-col md:flex-row justify-start items-center mt-4">
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full md:w-[27.8vh] mt-2 md:mt-0 justify-start md:justify-end text-left md:text-right font-normal'
                          )}
                        >
                          <span className="m-auto">
                            { formGeneral.getValues('timeStart') !== null && formGeneral.getValues('timeStart') !== undefined ? format(formGeneral.getValues('timeStart'), 'dd-MM-yyy') : 'Start at'}
                          </span>
                          <CalendarMinus2 className="ml-2 md:mr-2 h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          initialFocus
                          onDayClick={(selectedDate) => {
                            formGeneral.setValue('timeStart', format(selectedDate, 'yyyy-MM-dd'));
                          }}
                          disabled={(date) => date < new Date('1900-01-01')}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="m-2 p-2 items-center">
              <span>To</span>
            </div>
            <FormField
              control={formGeneral.control}
              name="timeEnd"
              render={({ field }) => (
                <FormItem className="flex flex-col md:flex-row justify-start items-center mt-4">
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full md:w-[27.8vh] mt-2 md:mt-0 justify-start md:justify-end text-left md:text-right font-normal'
                          )}
                        >
                          <span className="m-auto">
                            { formGeneral.getValues('timeEnd') !== null && formGeneral.getValues('timeEnd') !== undefined ? format(formGeneral.getValues('timeEnd'), 'dd-MM-yyy') : 'End at'}
                          </span>
                          <CalendarMinus2 className="ml-2 md:mr-2 h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          initialFocus
                          onDayClick={(selectedDate) => {
                            formGeneral.setValue('timeEnd', format(selectedDate, 'yyyy-MM-dd'));
                          }}
                          disabled={(date) => date < new Date('1900-01-01')}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage className='pl-5 pb-2'/>
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={formGeneral.control}
            name="note"
            render={({ field }) => (
              <FormItem className="flex flex-col md:flex-row justify-start items-center mt-4">
                <FormLabel
                  htmlFor="note"
                  className="w-40 text-base"
                >
                  {LABEL_GENERAL.NOTE_LABEL}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Note here..."
                    {...field}
                    className="w-full md:w-[48.4vw] mt-2 md:mt-0"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formGeneral.control}
            name="isAllUserBelongTo"
            render={({ field }) => (
              <FormItem className="flex flex-col md:flex-row justify-start items-center mt-4">
                <FormLabel
                  htmlFor="allUser"
                  className="w-40 text-base"
                >
                  {LABEL_GENERAL.ALL_USER_LABEL}
                </FormLabel>
                <FormControl>
                  <div className="flex items-start mt-2 md:mt-0">
                    <Checkbox
                      id="projectTypeCheckbox"
                      checked={field.value}
                      onCheckedChange={() =>
                        formGeneral.setValue('isAllUserBelongTo', !formGeneral.getValues('isAllUserBelongTo'))
                      }
                    />
                    <FormLabel className="pl-2" htmlFor="projectTypeCheckbox">
                      {LABEL_GENERAL.ALL_USERS_LABEL}
                    </FormLabel>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formGeneral.control}
            name="projectType"
            render={({ field }) => (
              <FormItem className="flex flex-col md:flex-row justify-start items-center mt-4">
                <FormLabel
                  htmlFor="projectType"
                  className="w-40 text-base"
                >
                  {LABEL_GENERAL.PROJECT_TYPE_LABEL}
                </FormLabel>
                <FormControl>
                  <div className="flex items-start mt-2 md:mt-0">
                    <Select
                      value={field.value.toString()}
                      onValueChange={(value) => {
                        formGeneral.setValue('projectType', Number(value));
                      }}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a fruit" {...field} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {Object.entries(projectTypeDisplayMap).map(
                            ([key, label]) => (
                              <SelectItem key={key} value={key}>
                                {label}
                              </SelectItem>
                            )
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default General;
