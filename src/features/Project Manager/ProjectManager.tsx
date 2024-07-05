import React, { useContext, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import ProjectItems from './ProjectItems';
import { useQuantity } from '@/hooks/Projects/useQuantity';
import { SidebarContext } from '@/layout/Layout';
import { cn } from '@/lib/utils';
import { ButtonName, LABEL_MANAGER, pageTitle } from '@/constants';
import { useProjects } from '@/hooks/Projects/useProjects';
import useDebounce from '@/hooks/Projects/useDebounce';
import toast from 'react-hot-toast';
const validStatuses = ['0', '1', ' '];
const ProjectManager = (): JSX.Element => {
  const [searchParams, setSearchParams] = useSearchParams();
  const statusParam = searchParams.get('status') ?? '0';
  const searchParam = searchParams.get('search') ?? '';
  const [status, setStatus] = useState(statusParam);
  const [search, setSearch] = useState(searchParam);
  const debouncedSearchTerm = useDebounce<string>(search, 500);
  const { projects, loadingProject, refetchData, setLoadingProject } = useProjects(status, debouncedSearchTerm);
  const { expanded } = useContext(SidebarContext);
  const { quantities, refetchDataQuantity } = useQuantity();
  useEffect(() => {
    if (!validStatuses.includes(status)) {
      toast.error('Not found status you are finding');
      setStatus('0');
    } else {
      setSearchParams({ status, search });
    }
  }, [status, search, setSearchParams]);
  const handleStatusChange = (value: string): void => {
    setStatus(value);
    setLoadingProject(true);
  };
  const getQuantityByStatus = (status: number | string): number => {
    if (status === ' ') {
      return quantities.reduce((total, item) => total + item.quantity, 0);
    }
    const quantityObj = quantities.find(item => item.status === Number(status));
    if (quantityObj != null) {
      return quantityObj.quantity;
    }
    return 0;
  };
  return (
    <div className='shadow-2xl w-11/12 m-auto mt-9 border-2 dark:shadow-gray-600'>
      <div className='pb-5 min-h-[80vh] space-y-2'>
        <div className='font-bold text-3xl text-center border-b-2 border-primary-600 p-8'>
          {pageTitle.managerTitle}
        </div>
        <div className={cn('px-5 flex justify-start items-center pb-5 pt-5', expanded ? 'xl:space-x-14 space-x-14' : 'xl:space-x-36 space-x-14')}>
          <Link to='/projects/create/general'>
            <Button className='text-xl text-white'>
              {ButtonName.newProject}
            </Button>
          </Link>
          <Select value={statusParam} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='0'>{LABEL_MANAGER.SELECT_ACTIVE} ({getQuantityByStatus(0)})</SelectItem>
              <SelectItem value='1'>{LABEL_MANAGER.SELECT_DEACTIVE} ({getQuantityByStatus(1)})</SelectItem>
              <SelectItem value=' '>{LABEL_MANAGER.SELECT_ALL} ({getQuantityByStatus(' ')})</SelectItem>
            </SelectContent>
          </Select>
          <div className='relative flex items-center'>
            <Search className="absolute left-3 text-gray-500"/>
            <Input
              placeholder='Search by client or project name'
              value={searchParam}
              className={cn('pl-10', expanded ? 'xl:w-[628px] w-[290px]' : 'xl:w-[658px] w-[290px]')}
              onChange={(e) => { setSearch(e.target.value); setLoadingProject(true); }}
            />
          </div>
        </div>
        <div>
          <ProjectItems
            projects = {projects}
            loadingProject = {loadingProject}
            refetchData = {refetchData}
            refetchDataQuantity={refetchDataQuantity}
            status = {status}
          />
        </div>
      </div>
    </div>
  );
};
export default ProjectManager;
