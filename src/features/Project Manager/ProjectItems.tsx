import React, { useContext, useState, useEffect, useRef, useCallback } from 'react';
import deleteImg from '@/assets/image/delete.png';
import danger from '@/assets/image/danger.png';
import emptyData from '@/assets/image/empty.svg';
import { Check, ChevronDown, Eye, Pencil, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import dayjs from 'dayjs';
import { Skeleton } from '@/components/ui/skeleton';
import { ActionMessageDes, ActionMessageTitle, ActionType, projectTypeDisplayMap, selectProjectItem } from '@/constants/projectType';
import { Link } from 'react-router-dom';
import { IProject } from '@/types';
import { SidebarContext } from '@/layout/Layout';
import { cn } from '@/lib/utils';
import { Active, Delete, Inactive } from '@/api';
import toast from 'react-hot-toast';
import { validateError } from '@/utils';
import { AutoSizer, List, ListRowProps, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import { ERROR_MESSAGES, TOAST_MESSAGES } from '@/constants';

interface ProjectItemsProps {
  projects: IProject[]
  loadingProject: boolean
  refetchDataQuantity: () => void
  refetchData: () => void
  status: string
}

const ProjectItems = ({ projects, refetchDataQuantity, loadingProject, refetchData, status }: ProjectItemsProps): JSX.Element => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [action, setAction] = useState<'delete' | 'active' | 'inactive'>('delete');
  const [projectId, setProjectId] = useState<string | null>(null);
  const { expanded } = useContext(SidebarContext);
  const [submitting, setSubmitting] = useState(false);
  const listRef = useRef<List>(null);

  const getProjectTypeDisplay = (projectType: number): string => {
    return projectType in projectTypeDisplayMap ? projectTypeDisplayMap[projectType] : 'Unknown';
  };

  const handleAction = async (projectId: string, action: ActionType): Promise<void> => {
    setSubmitting(true);
    const actionFunctions = {
      [ActionType.DELETE]: {
        actionFunction: Delete,
        successMessage: TOAST_MESSAGES.success.delete_success,
        errorMessage: ERROR_MESSAGES.projectIteam.delete
      },
      [ActionType.ACTIVE]: {
        actionFunction: Active,
        successMessage: TOAST_MESSAGES.success.active_success,
        errorMessage: ERROR_MESSAGES.projectIteam.active
      },
      [ActionType.INACTIVE]: {
        actionFunction: Inactive,
        successMessage: TOAST_MESSAGES.success.inactive_success,
        errorMessage: ERROR_MESSAGES.projectIteam.inactive
      }
    };
    try {
      const { actionFunction, successMessage, errorMessage } = actionFunctions[action];
      const response = await actionFunction(projectId);
      if (response.success) {
        toast.success(successMessage);
        setOpenDialog(false);
      } else {
        console.error(errorMessage);
      }
      refetchData();
      refetchDataQuantity();
    } catch (error) {
      toast.error(validateError(error));
    } finally {
      setSubmitting(false);
    }
  };

  const groupedProjects: Record<string, IProject[]> = projects.reduce((acc: Record<string, IProject[]>, project) => {
    if (typeof acc[project.customerName] === 'undefined') {
      acc[project.customerName] = [];
    }
    acc[project.customerName].push(project);
    return acc;
  }, {});

  const cache = useRef(new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 100
  }));

  useEffect(() => {
    if (listRef.current !== null) {
      cache.current.clearAll();
      listRef.current.recomputeRowHeights();
    }
  }, [projects]);
  const renderProjectRow = useCallback(({ index, key, parent, style }: ListRowProps): JSX.Element => {
    const customerName = Object.keys(groupedProjects)[index];
    return (
      <CellMeasurer
        key={key}
        cache={cache.current}
        parent={parent}
        columnIndex={0}
        rowIndex={index}
      >
        <div style={style} className='mx-5'>
          <div className='h-10'>
            <div className='p-2 pl-4 rounded-xl text-white border-2 border-primary-400 bg-gradient-to-tr from-primary-400 to-primary-700 duration-150 cursor-pointer'>
              <div className='text-xl italic font-bold truncate w-[20vw]'>{customerName}</div>
            </div>
          </div>
          {groupedProjects[customerName].map((project: IProject) => (
            <div key={project.id} className='flex-col mt-4 mb-2'>
              <div className='w-full flex border rounded-xl hover:bg-primary-100 dark:hover:bg-primary-800 transition-transform duration-300 transform hover:scale-[1.01]'>
                <div className='flex w-9/12'>
                  <div className={cn('p-4 truncate', expanded ? 'xl:w-72 w-80' : 'xl:w-80 w-80')}>{project.name}</div>
                  <div className='text-xs text-center items-center my-auto'>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className={cn('bg-[#2e95ea] p-2 text-white border-2 border-primary-200 rounded-lg truncate', expanded ? 'xl:max-w-36 max-w-24' : 'xl:max-w-64 max-w-24')}>
                            {project.pms.join(', ')}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className='bg-primary-500 text-white border-2 border-primary-200'>
                          {project.pms.join(', ')}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className='p-2 text-xs my-auto'>
                    <div className='bg-red-500 p-2 w-24 text-white border-2 border-primary-100 rounded-lg text-center'>
                      {project.activeMember} members
                    </div>
                  </div>
                  {project.projectType in projectTypeDisplayMap && (
                    <div className='p-2 text-xs my-auto w-20'>
                      <div className='bg-orange-500 p-2 text-center border-2 border-primary-100 text-white rounded-lg'>
                        {getProjectTypeDisplay(project.projectType)}
                      </div>
                    </div>
                  )}
                  <div className='p-2 text-xs my-auto'>
                    <div className='bg-[#4caf50] p-2 w-40 text-center border-2 border-primary-100 text-white rounded-lg'>
                      {dayjs(project.timeStart).format('DD/MM/YYYY')} -{' '}
                      {project.timeEnd !== null ? dayjs(project.timeEnd).format('DD/MM/YYYY') : 'Date Empty'}
                    </div>
                  </div>
                </div>
                <div className='p-2 text-sm w-3/12 pr-10'>
                  <div className='flex justify-end pt-2'>
                    {status === ' '
                      ? <div className={cn('w-16 h-8 rounded-md mr-5 m-auto', project.status === 1 ? 'bg-gray-300' : 'bg-primary-500')}>
                        <div className='text-base text-center text-white'>{project.status === 1 ? 'Inactive' : 'Active'}</div>
                      </div>
                      : ''
                    }
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className='w-32'>
                          <div className='flex justify-between items-center'>
                            Action
                            <ChevronDown className='pl-2'/>
                          </div>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-32">
                        <DropdownMenuGroup>
                          <Link to={`/projects/edit/general/${project.id}`}>
                            <DropdownMenuItem>
                              {selectProjectItem.edit}
                              <DropdownMenuShortcut><Pencil/></DropdownMenuShortcut>
                            </DropdownMenuItem>
                          </Link>
                          <Link to={`/projects/view/tasks/${project.id}`}>
                            <DropdownMenuItem>
                              {selectProjectItem.view}
                              <DropdownMenuShortcut><Eye/></DropdownMenuShortcut>
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem onClick={() => { setProjectId(project.id.toString()); setOpenDialog(true); project.status === 1 ? setAction('active') : setAction('inactive'); }}>
                            {project.status === 1 ? 'Active' : 'Deactive'}
                            <DropdownMenuShortcut>{project.status === 1 ? <Check/> : <X/>}</DropdownMenuShortcut>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setProjectId(project.id.toString()); setOpenDialog(true); setAction('delete'); }}>
                            {selectProjectItem.delete}
                            <DropdownMenuShortcut><Trash2/></DropdownMenuShortcut>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {projectId === project.id.toString() && (
                      <AlertDialog open={openDialog}>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            {action === 'delete' ? <img src={deleteImg} alt="delete" className='w-24 m-auto'/> : <img src={danger} alt="delete" className='w-24 m-auto'/>}
                            <AlertDialogTitle className='text-center text-xl font-bold'>
                              {ActionMessageTitle[action]}
                            </AlertDialogTitle>
                            <AlertDialogDescription className='text-center'>
                              {ActionMessageDes[action]}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className='flex m-auto'>
                            <AlertDialogCancel onClick={() => { setProjectId(null); setOpenDialog(false); } }>{selectProjectItem.cancel}</AlertDialogCancel>
                            <AlertDialogAction onClick={() => { void handleAction(project.id.toString(), action as ActionType); }} disabled={submitting}>
                              {selectProjectItem.continute}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CellMeasurer>
    );
  }, [groupedProjects, expanded, action, openDialog, projectId, submitting, status]);
  if (loadingProject) {
    return (
      <div>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className='mx-5'>
            <div className='h-10'>
              <Skeleton className='p-2 pl-4 h-10'/>
            </div>
            {Array.from({ length: 3 }).map((_, subIndex) => (
              <div key={subIndex} className='flex-col'>
                <div className='flex'>
                  <div className='w-9/12 pt-2 flex'>
                    <Skeleton className='p-4 w-72 h-8' />
                    <Skeleton className='p-2 w-24 h-8' />
                    <Skeleton className='p-2 w-48  h-8' />
                    <Skeleton className='p-2 w-20 h-8' />
                    <Skeleton className='p-2 w-40 h-8' />
                  </div>
                  <div className='w3/12 p-2 text-sm flex justify-end'>
                    <Skeleton className='w-[120px] h-8' />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
  if (projects.length === 0) {
    return (
      <div className='h-[65vh] flex flex-col items-center justify-center'>
        <img src={emptyData} alt="empty" className='w-36'/>
        <span className='font-bold text-[#919eab] text-xl'>No results found</span>
      </div>
    );
  }
  return (
    <div className='h-[65vh]'>
      <AutoSizer>
        {({ height, width }) => (
          <List
            ref={listRef}
            width={width}
            height={height}
            rowCount={Object.keys(groupedProjects).length}
            rowHeight={cache.current.rowHeight}
            deferredMeasurementCache={cache.current}
            rowRenderer={renderProjectRow}
          />
        )}
      </AutoSizer>
    </div>
  );
};

export default ProjectItems;
