import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { useOutletContext } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { IUserProjectTeam } from '@/types';
const TeamView = (): JSX.Element => {
  const { totalWorkingTimeTeam, totalWorkingBillableTimeTeam, convertMinutesToHours, users, calculatePercentage } = useOutletContext<{
    totalWorkingTimeTeam: number
    convertMinutesToHours: (minutes: number) => number
    users: IUserProjectTeam[]
    totalWorkingBillableTimeTeam: number
    calculatePercentage: (billableTime: number, totalTime: number) => number
  }>();
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>HOUR</TableHead>
            <TableHead></TableHead>
            <TableHead className="text-right">Billable Hours</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className='font-bold'>
            <TableCell className='w-2/6 font-medium'>Total</TableCell>
            <TableCell className='w-1/6'>
              {totalWorkingTimeTeam > 0 ? convertMinutesToHours(totalWorkingTimeTeam).toFixed(2) : ''}
            </TableCell>
            <TableCell className='w-2'><Progress className='w-full' value={calculatePercentage(totalWorkingBillableTimeTeam, totalWorkingTimeTeam)}/></TableCell>
            <TableCell className="text-right w-1/6">{totalWorkingBillableTimeTeam > 0 ? convertMinutesToHours(totalWorkingBillableTimeTeam).toFixed(2) : ''} ({calculatePercentage(totalWorkingBillableTimeTeam, totalWorkingTimeTeam)}%)</TableCell>
          </TableRow>
          {users.map((user) => (
            <TableRow key={user.userID}>
              <TableCell className='w-2/6'>{user.userName}</TableCell>
              <TableCell className='w-1/6'>
                {user.totalWorkingTime > 0 ? convertMinutesToHours(user.totalWorkingTime).toFixed(2) : ''}
              </TableCell>
              <TableCell className='w-2/6'><Progress className='w-full' value={calculatePercentage(user.billableWorkingTime, user.totalWorkingTime)}/></TableCell>
              <TableCell className="text-right w-1/6">{user.billableWorkingTime > 0 ? convertMinutesToHours(user.billableWorkingTime).toFixed(2) : ''} ({calculatePercentage(user.billableWorkingTime, user.totalWorkingTime)}%)</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TeamView;
