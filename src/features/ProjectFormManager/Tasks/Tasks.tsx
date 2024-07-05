import React, { useEffect, useState } from 'react';
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable
} from 'react-beautiful-dnd';
import { ColumnsState, ITask, ITaskSelection } from '@/types/project';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { X, Plus } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { LABEL_TASK } from '@/constants';
const Tasks = (): JSX.Element => {
  const { loadingTask, setTasksData, setColumns, columns, tasksData } = useOutletContext<{
    loadingTask: boolean
    setTasksData: React.Dispatch<React.SetStateAction<ITaskSelection[]>>
    setColumns: React.Dispatch<React.SetStateAction<ColumnsState>>
    columns: ColumnsState
    tasksData: ITaskSelection[]
  }>();
  const [isChecked, setIsChecked] = useState<boolean>(false);
  useEffect(() => {
    const anyTaskNotBillable = tasksData.some((task) => !task.billable);
    setIsChecked(!anyTaskNotBillable);
  }, [tasksData]);
  const isTaskBillable = (taskId: number): boolean => {
    return tasksData.some(task => task.taskId === taskId && task.billable);
  };
  const onRemoveTask = (task: ITask): void => {
    setColumns(prev => {
      const updatedCurrent = prev.current.list.filter(t => t.id !== task.id);
      const updatedAddition = [task, ...prev.addition.list];
      return {
        ...prev,
        current: { ...prev.current, list: updatedCurrent, billable: true },
        addition: { ...prev.addition, list: updatedAddition }
      };
    });
    setTasksData(prev => prev.filter(taskData => taskData.taskId !== task.id));
  };
  const onAddTask = (task: ITask): void => {
    setColumns(prev => {
      const updatedAddition = prev.addition.list.filter(t => t.id !== task.id);
      const updatedCurrent = [task, ...prev.current.list];
      return {
        ...prev,
        addition: { ...prev.addition, list: updatedAddition, billable: true },
        current: { ...prev.current, list: updatedCurrent }
      };
    });
    const updateTask = { taskId: task.id, billable: true };
    setTasksData(prev => [...prev, updateTask]);
  };

  const onDragEnd = ({ source, destination }: DropResult): void => {
    if (destination == null) return;
    const sourceCol = columns[source.droppableId as 'current' | 'addition'];
    const destCol = columns[destination.droppableId as 'current' | 'addition'];
    if (sourceCol === destCol) {
      const newList = Array.from(sourceCol.list);
      const [movedItem] = newList.splice(source.index, 1);
      newList.splice(destination.index, 0, movedItem);
      const newCol = { ...sourceCol, list: newList };
      setColumns((state) => ({ [newCol.id]: newCol, ...state }));
    } else {
      const startList = Array.from(sourceCol.list);
      const [movedItem] = startList.splice(source.index, 1);
      const endList = Array.from(destCol.list);
      endList.splice(destination.index, 0, movedItem);
      setColumns((state) => ({
        ...state,
        [sourceCol.id]: { ...sourceCol, list: startList },
        [destCol.id]: { ...destCol, list: endList }
      }));
      if (source.droppableId === 'addition' && destination.droppableId === 'current') {
        const updateTask = { taskId: movedItem.id, billable: true };
        setTasksData((prev) => ([...prev, updateTask]));
      } else if (source.droppableId === 'current' && destination.droppableId === 'addition') {
        setTasksData((prev) => (prev.filter((taskData) => taskData.taskId !== movedItem.id)));
      }
    }
  };
  const handleCheckboxChange = (taskId: number, checked: boolean): void => {
    setTasksData(prev => prev.map(task => task.taskId === taskId ? { ...task, billable: checked } : task));
    const allTasksAreBillable = tasksData.every(task => task.billable);
    setIsChecked(allTasksAreBillable);
  };
  const handleAllTasksCheckboxChange = (): void => {
    const updatedTasksData = tasksData.map((task) => ({
      ...task,
      billable: !isChecked
    }));
    setTasksData(updatedTasksData);
    setIsChecked(!isChecked);
  };
  if (loadingTask) {
    return (
      <div className="w-[70vw] shadow-xl">
        <div className="pb-5 min-h-[80vh] space-y-3">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex justify-center items-center">
              <Skeleton className="h-10 w-2/5 mr-10" />
              <Skeleton className="h-10 w-2/5" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col space-y-8 w-full min-h-[60vh]">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 gap-1 lg:space-y-0 lg:grid-cols-2 lg:gap-3 space-y-4">
          <Droppable droppableId="current">
            {(provided) => (
              <Card
                className="flex flex-col shadow-md bg-muted h-[60vh]"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <CardTitle className="relative justify-center flex items-center duration-150 p-2">
                  <div className="flex flex-col ml-auto items-center pr-4">
                    <Label className="pb-2">{LABEL_TASK.LABEL_1}</Label>
                    <input
                      type='checkbox'
                      checked={isChecked}
                      className='accent-primary-400 h-4 w-4'
                      onChange={handleAllTasksCheckboxChange}
                    />
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2">
                    {LABEL_TASK.LABEL_2}
                  </div>
                </CardTitle>
                <div className="flex flex-col space-y-2 m-2 overflow-y-auto">
                  {columns.current.list.map((task, index) => (
                    <Draggable
                      key={`current-${task.id}`}
                      draggableId={`current-${task.id}`}
                      index={index}
                    >
                      {(provided) => (
                        <Card
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                        >
                          <CardContent className="flex items-center justify-between duration-150 p-2 hover:bg-primary-200 hover:rounded-lg active:bg-primary-600 dark:hover:text-black">
                            <div className="flex space-x-2 items-center">
                              <X
                                className="w-4 h-4 text-gray-500 cursor-pointer"
                                onClick={() => onRemoveTask(task)}
                              />
                              <span>{task.name}</span>
                            </div>
                            <input
                              type='checkbox'
                              className="accent-primary-400 h-4 w-4 mr-1"
                              checked={isTaskBillable(task.id)}
                              onChange={(e) => handleCheckboxChange(task.id, e.target.checked)}
                            />
                          </CardContent>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </Card>
            )}
          </Droppable>
          <Droppable droppableId="addition">
            {(provided) => (
              <Card
                className="flex flex-col shadow-md bg-muted h-[60vh]"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <CardTitle className="flex items-center justify-center duration-150 p-4">
                  {LABEL_TASK.LABEL_3}
                </CardTitle>
                <div className="flex flex-col space-y-2 m-2 overflow-y-auto h-[500px]">
                  {columns.addition.list.map((task, index) => (
                    <Draggable
                      key={`addition-${task.id}`}
                      draggableId={`addition-${task.id}`}
                      index={index}
                    >
                      {(provided) => (
                        <Card
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                        >
                          <CardContent className="flex items-center justify-between duration-150 p-2 hover:bg-primary-200 hover:rounded-lg active:bg-primary-600 dark:hover:text-black">
                            <span>{task.name}</span>
                            <Plus
                              className="w-4 h-4 text-gray-500 cursor-pointer mr-1"
                              onClick={() => onAddTask(task)}
                            />
                          </CardContent>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </Card>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </div>
  );
};

export default Tasks;
