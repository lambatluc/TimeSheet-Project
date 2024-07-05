import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Tabs,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { useTasksView } from './hooks/useTaskView';
import { Outlet, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTeamView } from './hooks/useTeamView';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { endOfWeek, getYear, startOfWeek, format, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear, isValid } from 'date-fns';
import CustomDate from './CustomDate/Custom';
import { tabsListView } from '@/constants/tabList';
import { DateRange, pageTitle, validDateRanges } from '@/constants/projectType';
import { rangeFunctions } from '@/types';
import { HOME, VIEW } from '@/constants';
import toast from 'react-hot-toast';
const View = (): JSX.Element => {
  const nav = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const startDateParams = searchParams.get('startDate');
  const endDateParams = searchParams.get('endDate');
  const selectParams = searchParams.get('select') ?? 'week';
  const [select, setSelect] = useState(selectParams as DateRange);
  const time = {
    startDate:
      startDateParams !== null && isValid(new Date(startDateParams))
        ? new Date(startDateParams)
        : select !== 'all'
          ? startOfWeek(new Date(), { weekStartsOn: 1 })
          : undefined,
    endDate:
      endDateParams !== null && isValid(new Date(endDateParams))
        ? new Date(endDateParams)
        : select !== 'all'
          ? endOfWeek(new Date(), { weekStartsOn: 1 })
          : undefined
  };
  const shouldCallUseView = id !== undefined;
  const [startDate, setStartDate] = useState<Date | undefined>(time.startDate);
  const [endDate, setEndDate] = useState<Date | undefined>(time.endDate);
  const [open, setOpen] = useState<boolean>(false);
  useEffect(() => {
    const isValidDateRange = validDateRanges.includes(selectParams as DateRange);
    const isStartDateValid = startDateParams === null || isValid(new Date(startDateParams));
    const isEndDateValid = endDateParams === null || isValid(new Date(endDateParams));

    if (!isValidDateRange || !isStartDateValid || !isEndDateValid) {
      if (id !== undefined) {
        toast.error('Data Invalid!');
        nav(`${VIEW}/tasks/${id}`);
        return;
      }
    }
    setSelect(selectParams as DateRange);
  }, [selectParams, startDateParams, endDateParams, validDateRanges, setSelect]);
  const updateParams = (newStartDate: Date | undefined, newEndDate: Date | undefined, newSelect: DateRange): void => {
    const params: Record<string, string> = { select: newSelect };
    if (newStartDate !== undefined && newEndDate !== undefined) {
      params.startDate = format(newStartDate, 'yyyy-MM-dd');
      params.endDate = format(newEndDate, 'yyyy-MM-dd');
    } else {
      params.startData = ('');
      params.endData = ('');
    }
    setSearchParams(params);
  };
  const changeTime = (action: 'prev' | 'next', range: DateRange): void => {
    if (startDate != null && endDate != null && typeof startDate !== 'string' && typeof endDate !== 'string') {
      const manipulation = rangeFunctions[range][action];
      const newStartDate = manipulation(startDate, 1);
      const newEndDate = manipulation(endDate, 1);
      setStartDate(newStartDate);
      setEndDate(newEndDate);
      updateParams(newStartDate, newEndDate, select);
    }
  };
  const changeTimeRange = (value: DateRange): void => {
    const today = new Date();
    const rangeFunctions = {
      month: () => {
        const startOfMonthDate = startOfMonth(today);
        const endOfMonthDate = endOfMonth(today);
        setStartDate(startOfMonthDate);
        setEndDate(endOfMonthDate);
        updateParams(startOfMonthDate, endOfMonthDate, value);
      },
      week: () => {
        const startOfWeekDate = startOfWeek(today);
        const endOfWeekDate = endOfWeek(today);
        setStartDate(startOfWeekDate);
        setEndDate(endOfWeekDate);
        updateParams(startOfWeekDate, endOfWeekDate, value);
      },
      quarter: () => {
        const startOfQuarterDate = startOfQuarter(today);
        const endOfQuarterDate = endOfQuarter(today);
        setStartDate(startOfQuarterDate);
        setEndDate(endOfQuarterDate);
        updateParams(startOfQuarterDate, endOfQuarterDate, value);
      },
      year: () => {
        const startOfYearDate = startOfYear(today);
        const endOfYearDate = endOfYear(today);
        setStartDate(startOfYearDate);
        setEndDate(endOfYearDate);
        updateParams(startOfYearDate, endOfYearDate, value);
      },
      all: () => {
        setStartDate(undefined);
        setEndDate(undefined);
        updateParams(undefined, undefined, value);
      },
      custom: () => {
        setOpen(true);
      }
    };
    const rangeFunction = rangeFunctions[value];
    if (rangeFunction !== null) {
      rangeFunction();
      setSelect(value);
    }
  };
  const formatDateString = (startDate: Date, endDate: Date, range: DateRange): string | undefined => {
    const startFormatted = format(startDate, 'dd');
    const endFormatted = format(endDate, 'dd');
    const monthStartFormatted = format(startDate, 'MMM');
    const monthEndFormatted = format(endDate, 'MMM');
    const yearFormatted = getYear(endDate);
    const formatMapping: Record<DateRange, string> = {
      week: monthStartFormatted === monthEndFormatted
        ? `Week: ${startFormatted} - ${endFormatted} ${monthEndFormatted} ${yearFormatted}`
        : `Week: ${startFormatted} ${monthStartFormatted} - ${endFormatted} ${monthEndFormatted} ${yearFormatted}`,
      month: `Month: ${startFormatted} - ${endFormatted} - ${monthEndFormatted} - ${yearFormatted}`,
      quarter: `Quarter: ${startFormatted} ${monthStartFormatted} - ${endFormatted} ${monthEndFormatted} - ${yearFormatted}`,
      year: `Year: ${startFormatted} ${monthStartFormatted} - ${endFormatted} ${monthEndFormatted} - ${yearFormatted}`,
      all: 'All time',
      custom: monthStartFormatted === monthEndFormatted
        ? `Custom: ${startFormatted} - ${endFormatted} ${monthEndFormatted} ${yearFormatted}`
        : `Custom: ${startFormatted} ${monthStartFormatted} - ${endFormatted} ${monthEndFormatted} ${yearFormatted}`
    };
    return formatMapping[range];
  };
  const formattedStartDate = startDate !== undefined && typeof startDate !== 'string' ? format(startDate, 'yyyy-MM-dd') : startDate;
  const formattedEndDate = endDate !== undefined && typeof endDate !== 'string' ? format(endDate, 'yyyy-MM-dd') : endDate;
  const { tasks, loadingTask } = shouldCallUseView ? useTasksView(Number(id), formattedStartDate, formattedEndDate) : { tasks: [], loadingTask: false };
  const { users, loadingTeam } = shouldCallUseView ? useTeamView(Number(id), formattedStartDate, formattedEndDate) : { users: [], loadingTeam: false };
  useEffect(() => {
    if (!loadingTask && !loadingTeam && tasks.length === 0 && users.length === 0) {
      toast.error('Not Found ID Project');
      nav(HOME);
    }
  }, [loadingTask, loadingTeam, tasks, users, nav]);
  const convertMinutesToHours = (minutes: number): number => {
    return minutes / 60;
  };
  const calculatePercentage = (billableTime: number, totalTime: number): number => {
    if (totalTime === 0) return 0;
    return (billableTime / totalTime) * 100;
  };
  const totalWorkingTimeTask = tasks.reduce((total, task) => total + task.totalWorkingTime, 0);
  const totalWorkingBillableTimeTask = tasks.reduce((total, task) => total + task.billableWorkingTime, 0);
  const totalWorkingTimeTeam = users.reduce((total, user) => total + user.totalWorkingTime, 0);
  const totalWorkingBillableTimeTeam = users.reduce((total, user) => total + user.billableWorkingTime, 0);
  const handleTabChange = (tab: string): void => {
    const searchParamsString = searchParams.toString();
    nav(`${tab}?${searchParamsString}`);
  };
  return (
    <div className="shadow-xl w-11/12 m-auto mt-9 border-2 dark:shadow-gray-600">
      <CustomDate open={open} setOpen={setOpen} updateParams={updateParams} setStartDate={setStartDate} setEndDate={setEndDate}/>
      <div className="pb-5 space-y-2 min-h-[80vh]">
        <div className="text-3xl font-bold text-center p-8 border-b-2 border-primary-600">
          {pageTitle.viewTitle}
        </div>
        <div className='flex justify-between items-center w-5/6 m-auto py-5'>
          <div className='flex w-96 items-center'>
            <div className='flex space-x-3'>
              <Button onClick={() => changeTime('prev', select)} disabled={select === 'all' || select === 'custom'}><ChevronLeft/></Button>
              <Button onClick={() => changeTime('next', select)} disabled={select === 'all' || select === 'custom'}><ChevronRight/></Button>
            </div>
            <div className='pl-4'>
              {(startDate !== undefined) && (endDate !== undefined) ? formatDateString(startDate, endDate, selectParams as DateRange) : 'All Time'}
            </div>
          </div>
          <Select
            value={selectParams}
            onValueChange={
              changeTimeRange
            }>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a fruit"/>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="quarter">Quarter</SelectItem>
                <SelectItem value="year">Year</SelectItem>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="custom">Custom Time</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-center items-center w-5/6 m-auto">
          <Tabs
            value={pathname}
            onValueChange={handleTabChange}
            className="w-full">
            <TabsList className="grid grid-cols-2">
              {tabsListView.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={`${VIEW}/${tab.value}/${id ?? ''}`}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <Outlet
              context={{
                totalWorkingTimeTask,
                totalWorkingTimeTeam,
                convertMinutesToHours,
                totalWorkingBillableTimeTask,
                totalWorkingBillableTimeTeam,
                calculatePercentage,
                tasks,
                users,
                loadingTask,
                loadingTeam
              }}
            />
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default View;
