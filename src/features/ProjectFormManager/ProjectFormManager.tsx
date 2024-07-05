import React, { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { useNavigate, useLocation, useParams } from 'react-router';
import { tabsListCreate } from '@/constants/tabList';
import { useClient } from './General/hooks/useClient';
import { useTask } from './Tasks/hooks/useTask';
import { useBranch, useUsers } from './Team/hooks/useUsers';
import { useEdit } from './hooks/useEdit';
import { ColumnsState, IGeneralProject, IProjectCredential, ITask, ITaskSelection, IUserSelection } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateProject } from './hooks/useCreate';
import { validateError } from '@/utils';
import { ButtonName, CREATE, EDIT, ERROR_MESSAGES, HOME, PROJECT_CREATE_GENERAL, PROJECT_CREATE_TASKS, PROJECT_CREATE_TEAM, PROJECT_EDIT_GENERAL, PROJECT_EDIT_TASKS, PROJECT_EDIT_TEAM, TOAST_MESSAGES, pageTitle } from '@/constants';
const ProjectFormManager = (): JSX.Element => {
  const nav = useNavigate();
  const [usersData, setUsersData] = useState<IUserSelection[]>([]);
  const [tasksData, setTasksData] = useState<ITaskSelection[]>([]);
  const [projectTargetUsers, setProjectTargetUsers] = useState<IProjectCredential['projectTargetUsers']>([]);
  const { pathname } = useLocation();
  const { id } = useParams<{ id?: string }>();
  const { clients, refetchData } = useClient();
  const { task, loadingTask } = useTask();
  const { data: users } = useUsers();
  const { data: branches } = useBranch();
  const shouldCallUseEdit = id !== undefined;
  const [submitting, setSubmitting] = useState(false);
  const { formEditData: editData, loading: loadingEdit } = shouldCallUseEdit ? useEdit(id) : { formEditData: [], loading: false };
  useEffect(() => {
    if (task.length > 0) {
      const filteredTasks = task.filter((t: ITask) => t.type === 0);
      const taskSelections: ITaskSelection[] = filteredTasks.map(t => ({
        taskId: t.id,
        billable: true
      }));
      setTasksData(taskSelections);
    }
  }, [task]);
  useEffect(() => {
    const formDataTaskIds = new Set(tasksData.map((t) => t.taskId));
    const currentTasks = task.filter((t) => formDataTaskIds.has(t.id));
    const additionTasks = task.filter((t) => !formDataTaskIds.has(t.id));
    setColumns({
      current: { id: 'current', list: currentTasks, billable: true },
      addition: { id: 'addition', list: additionTasks }
    });
  }, [tasksData]);
  const isEditing = id !== undefined;
  const generalSchema = z.object({
    customerId: z.number({
      required_error: ERROR_MESSAGES.general.required_error
    }),
    name: z.string().min(1, {
      message: ERROR_MESSAGES.general.name_min_length
    }),
    code: z.string().min(1, {
      message: ERROR_MESSAGES.general.code_min_length
    }),
    timeStart: z.string().optional(),
    timeEnd: z.string().optional().nullable(),
    note: z.string().optional().nullable(),
    isAllUserBelongTo: z.boolean(),
    projectType: z.number().default(4)
  }).refine(data => {
    if (data.timeStart !== null && data.timeStart !== undefined && data.timeEnd !== null && data.timeEnd !== undefined) {
      return new Date(data.timeStart) <= new Date(data.timeEnd);
    }
    return true;
  }, {
    path: ['timeEnd'],
    message: ERROR_MESSAGES.general.time_end_after_start
  });
  const [columns, setColumns] = useState<ColumnsState>({
    current: { id: 'current', list: [], billable: true },
    addition: { id: 'addition', list: [] }
  });
  const notificationSchema = z.object({
    komuChannelId: z.string().trim(),
    isNoticeKMApproveRequestOffDate: z.boolean(),
    isNoticeKMRequestOffDate: z.boolean(),
    isNoticeKMApproveChangeWorkingTime: z.boolean(),
    isNoticeKMRequestChangeWorkingTime: z.boolean(),
    isNoticeKMSubmitTS: z.boolean()
  });
  const resetAllForms = (): void => {
    formGeneral.reset();
    formNotification.reset();
    setTasksData([]);
    setUsersData([]);
  };
  useEffect(() => {
    if (!isEditing) {
      resetAllForms();
    }
  }, [isEditing]);
  useEffect(() => {
    if (isEditing && !loadingEdit) {
      if (editData != null) {
        const projectData = editData as IProjectCredential;
        formGeneral.reset({
          customerId: projectData.customerId,
          name: projectData.name,
          code: projectData.code,
          timeStart: projectData.timeStart,
          timeEnd: projectData.timeEnd,
          note: projectData.note,
          isAllUserBelongTo: projectData.isAllUserBelongTo,
          projectType: projectData.projectType
        });
        formNotification.reset({
          komuChannelId: projectData.komuChannelId,
          isNoticeKMApproveRequestOffDate: projectData.isNoticeKMApproveChangeWorkingTime,
          isNoticeKMRequestOffDate: projectData.isNoticeKMRequestOffDate,
          isNoticeKMApproveChangeWorkingTime: projectData.isNoticeKMApproveChangeWorkingTime,
          isNoticeKMRequestChangeWorkingTime: projectData.isNoticeKMRequestChangeWorkingTime,
          isNoticeKMSubmitTS: projectData.isNoticeKMSubmitTS
        });
        const userSelections: IUserSelection[] = projectData.users.map((user) => ({
          userId: user.userId,
          isTemp: user.isTemp,
          type: user.type !== undefined ? user.type : 0
        }));
        setUsersData(userSelections);
        const TaskSelections: ITaskSelection[] = projectData.tasks.map((tasks) => ({
          taskId: tasks.taskId,
          billable: tasks.billable
        }));
        setTasksData(TaskSelections);
        const userTarget: IProjectCredential['projectTargetUsers'] = projectData.projectTargetUsers.map((target) => ({
          userId: target.userId,
          roleName: target.roleName
        }));
        setProjectTargetUsers(userTarget);
      } else {
        toast.error('Not found ID Project');
        nav(HOME);
      }
    }
  }, [isEditing, loadingEdit, editData]);
  const formGeneral = useForm<IGeneralProject>({
    resolver: zodResolver(generalSchema),
    defaultValues: {
      customerId: undefined,
      name: '',
      code: '',
      isAllUserBelongTo: false,
      projectType: 0,
      note: ''
    }
  });
  const formNotification = useForm<z.infer<typeof notificationSchema>>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      komuChannelId: '',
      isNoticeKMApproveRequestOffDate: false,
      isNoticeKMRequestOffDate: false,
      isNoticeKMApproveChangeWorkingTime: false,
      isNoticeKMRequestChangeWorkingTime: false,
      isNoticeKMSubmitTS: false
    }
  });
  const { createProject } = useCreateProject();
  const handleSubmit = async (): Promise<void> => {
    setSubmitting(true);
    const formGeneralData = formGeneral.getValues();
    const formNotificationData = formNotification.getValues();
    const userData = usersData;
    const taskData = tasksData;
    const isGeneralValid = await formGeneral.trigger();
    const isTeamValid = userData.length > 0;
    const isTaskValid = taskData.length > 0;
    const hasTypeOneUser = userData.some(user => user.type === 1);
    const errorConditions = [
      { valid: isGeneralValid, message: ERROR_MESSAGES.general.general_valid, nav: isEditing ? PROJECT_EDIT_GENERAL(id) : PROJECT_CREATE_GENERAL },
      { valid: isTeamValid, message: ERROR_MESSAGES.team.no_users_added, nav: isEditing ? PROJECT_EDIT_TEAM(id) : PROJECT_CREATE_TEAM },
      { valid: isTaskValid, message: ERROR_MESSAGES.tasks.no_tasks_added, nav: isEditing ? PROJECT_EDIT_TASKS(id) : PROJECT_CREATE_TASKS },
      { valid: hasTypeOneUser, message: ERROR_MESSAGES.team.at_least_one_PM, nav: isEditing ? PROJECT_EDIT_TEAM(id) : PROJECT_CREATE_TEAM }
    ];
    const newErrors: string[] = [];
    const firstInvalidCondition = errorConditions.find(condition => !condition.valid);

    if (firstInvalidCondition !== undefined) {
      newErrors.push(firstInvalidCondition.message);
      nav(firstInvalidCondition.nav);
      toast.error(firstInvalidCondition.message);
      setSubmitting(false);
      return;
    }
    try {
      const idProject = id !== undefined && id !== null ? Number(id) : null;
      const dataToSend = {
        ...(idProject !== null && { id: idProject }),
        projectTargetUsers,
        ...formGeneralData,
        ...formNotificationData,
        users: userData,
        tasks: taskData
      };
      await createProject(dataToSend);
      id !== undefined ? toast.success(TOAST_MESSAGES.success.edit_success) : toast.success(TOAST_MESSAGES.success.create_success);
      nav(HOME);
      resetAllForms();
    } catch (error) {
      setSubmitting(false);
      toast.error(validateError(error));
    }
  };
  if (loadingEdit) {
    return (
      <div className="shadow-xl h-[97.2vh]">
        <div className="pb-5 space-y-3">
          <div className="text-3xl font-bold text-center p-8 border-b-2 border-primary-400">
            <Skeleton className="h-10 w-1/4 mx-auto" />
          </div>
          <div className="flex justify-center items-center">
            <Skeleton className="h-10 w-3/4" />
          </div>
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex justify-center items-center">
              <Skeleton className="h-10 w-1/5 mr-10" />
              <Skeleton className="h-10 w-3/5" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  const pagesTitle = isEditing ? pageTitle.editTitle : pageTitle.createTitle;
  return (
    <form>
      <div className='shadow-2xl w-11/12 m-auto mt-9 border-2 dark:shadow-gray-600'>
        <div className="pb-5 space-y-3">
          <div className="text-3xl font-bold text-center p-7 border-b-2 border-primary-400">
            {pagesTitle}
          </div>
          <div className="flex justify-center items-center">
            <Tabs
              value={pathname}
              onValueChange={(tab) => nav(tab)}
              className="space-y-10 w-[70vw]"
            >
              <TabsList className="grid w-full grid-cols-4">
                {tabsListCreate.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={
                      id !== undefined
                        ? `${EDIT}/${tab.value}/${id}`
                        : `${CREATE}/${tab.value}`
                    }
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <Outlet
                context={{
                  clients,
                  refetchData,
                  branches,
                  users,
                  loadingTask,
                  formGeneral,
                  formNotification,
                  usersData,
                  setUsersData,
                  tasksData,
                  setTasksData,
                  setColumns,
                  columns
                }}
              />
            </Tabs>
          </div>
          <div className="flex justify-end items-center pr-9">
            <Button type='button' onClick={() => {
              void handleSubmit();
            }}
            disabled={submitting}>{ButtonName.submitButton}</Button>
          </div>
        </div>
      </div>
    </form>
  );
};
export default ProjectFormManager;
