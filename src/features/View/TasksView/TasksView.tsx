import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { ITasksView } from '@/types';
import { useOutletContext } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
const TasksView = (): JSX.Element => {
  const { totalWorkingTimeTask, totalWorkingBillableTimeTask, convertMinutesToHours, tasks, calculatePercentage } = useOutletContext<{
    totalWorkingTimeTask: number
    convertMinutesToHours: (minutes: number) => number
    tasks: ITasksView[]
    totalWorkingBillableTimeTask: number
    calculatePercentage: (billableTime: number, totalTime: number) => number
  }>();
  return (
    <div className='min-h-[60vh]'>
      <Table>
        <TableHeader className='font-bold'>
          <TableRow>
            <TableHead>Billable Tasks</TableHead>
            <TableHead>HOURS</TableHead>
            <TableHead></TableHead>
            <TableHead className="text-right">Billable Hours</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className='font-bold'>
            <TableCell className='w-2/6 font-medium'>Total</TableCell>
            <TableCell className='w-1/6'>
              {totalWorkingTimeTask > 0 ? convertMinutesToHours(totalWorkingTimeTask).toFixed(2) : ''}
            </TableCell>
            <TableCell className='w-2'><Progress value={calculatePercentage(totalWorkingBillableTimeTask, totalWorkingTimeTask)}/></TableCell>
            <TableCell className="text-right w-1/6">
              {totalWorkingBillableTimeTask > 0 ? convertMinutesToHours(totalWorkingBillableTimeTask).toFixed(2) : ''} ({calculatePercentage(totalWorkingBillableTimeTask, totalWorkingTimeTask)}%)
            </TableCell>
          </TableRow>
          {tasks.map((task) => (
            <TableRow key={task.taskId}>
              <TableCell className='w-2/6'>{task.taskName}</TableCell>
              <TableCell className='w-1/6'>
                {task.totalWorkingTime > 0 ? convertMinutesToHours(task.totalWorkingTime).toFixed(2) : ''}
              </TableCell>
              <TableCell className='w-2/6'><Progress className='w-full' value={calculatePercentage(task.billableWorkingTime, task.totalWorkingTime)}/></TableCell>
              <TableCell className="text-right w-1/6">{task.billableWorkingTime > 0 ? convertMinutesToHours(task.billableWorkingTime).toFixed(2) : ''} ({calculatePercentage(task.billableWorkingTime, task.totalWorkingTime)}%)</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TasksView;
