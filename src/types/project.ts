import { DateRange } from '@/constants/projectType';
import { IUserTeam } from './user';
import { addMonths, addQuarters, addWeeks, addYears, subMonths, subQuarters, subWeeks, subYears } from 'date-fns';

export interface IQuantityProject {
  status: number
  quantity: number
}
export interface IBranch {
  name: string
  displayName: string
  id: number
}
export interface ITask {
  name: string
  type: number
  id: number
  isDeleted: boolean
}
export interface IProject {
  activeMember: number
  code: string
  customerName: string
  id: number
  name: string
  pms: string[]
  projectType: number
  status: number
  timeEnd?: null | string
  timeStart?: null | string
}
export interface ColumnsState {
  current: {
    id: 'current'
    list: ITask[]
    billable: boolean
  }
  addition: {
    id: 'addition'
    list: ITask[]
  }
}
export interface IGeneralProject {
  customerId: number
  name: string
  code: string
  isAllUserBelongTo: boolean
  projectType: number
  timeStart?: string
  timeEnd?: string
  note: string
}

export interface INotificationProject {
  komuChannelId: string
  isNoticeKMApproveRequestOffDate: boolean
  isNoticeKMRequestOffDate: boolean
  isNoticeKMApproveChangeWorkingTime: boolean
  isNoticeKMRequestChangeWorkingTime: boolean
  isNoticeKMSubmitTS: boolean
}
export interface IProjectCredential extends IGeneralProject, INotificationProject {
  id?: number
  tasks: ITaskSelection[]
  users: IUserTeam[]
  projectTargetUsers: Array<{
    userId: number
    roleName: string
  }>
}
export interface ITasksView {
  taskId: number
  taskName: string
  billable: boolean
  billableWorkingTime: number
  totalWorkingTime: number
}
export interface IUserSelection {
  userId: number
  isTemp: boolean
  type: number
}
export interface ITaskSelection {
  taskId: number
  billable: boolean
}
export type Range = {
  [key in DateRange]: {
    prev: (date: Date, amount: number) => Date
    next: (date: Date, amount: number) => Date
  };
};
export const rangeFunctions: Range = {
  week: {
    prev: subWeeks,
    next: addWeeks
  },
  month: {
    prev: subMonths,
    next: addMonths
  },
  quarter: {
    prev: subQuarters,
    next: addQuarters
  },
  year: {
    prev: subYears,
    next: addYears
  },
  all: {
    prev: (date: Date) => date,
    next: (date: Date) => date
  },
  custom: {
    prev: (date: Date) => date,
    next: (date: Date) => date
  }
};
