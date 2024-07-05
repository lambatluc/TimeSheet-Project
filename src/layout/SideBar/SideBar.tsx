import { ChevronFirst, ChevronLast, LogOut, MoreVertical } from 'lucide-react';
import logo from '@/assets/image/Timesheet.png';
import React, { ReactNode, useContext } from 'react';
import { SidebarContext } from '../Layout';
import { useCurrentLogin } from './hooks/useCurrentLogin';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from '@/store/slice/auth/authSlice';
import { ButtonName, HOME, LOGIN } from '@/constants';
export const SideBar: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { expanded, toggleExpanded } = useContext(SidebarContext);
  const { user } = useCurrentLogin();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSignOut = (): void => {
    dispatch(signOut());
    navigate(LOGIN);
  };
  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col border-r shadow-sm">
        <div className="p-4 pb-2 h-20 flex justify-between items-center">
          <Link to={HOME}>
            <div className={`flex items-center overflow-hidden transition-all ${expanded ? 'xl:w-52 w-0' : 'w-0'}`}>
              <img
                src={logo}
                className='w-8'
                alt='Timesheet Logo'
              />
              <div className='text-xl font-bold pl-2'>
                    TimeSheet
              </div>
            </div>
          </Link>
          <button onClick={toggleExpanded} className="p-1.5 rounded-lg">
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>
        <ul className="flex-1 px-3">{children}</ul>
        <div className="border-t flex p-3">
          <img src={user?.avatarFullPath} className="w-10 h-10 rounded-md" />
          <div className={`flex justify-between items-center overflow-hidden transition-all ${expanded ? 'xl:w-52 xl:ml-3 w-0' : 'w-0'} `}>
            <div className="leading-4">
              <h4 className="font-semibold">{user?.name}</h4>
              <span className="text-xs text-gray-600">{user?.emailAddress}</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <MoreVertical size={20} />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Accout</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <div className='flex justify-center items-center'>
                    <div>
                      <LogOut/>
                    </div>
                    <div className='pl-3'>
                      {ButtonName.logOut}
                    </div>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    </aside>
  );
};
export const SidebarItem: React.FC<{ icon: ReactNode, text: string, active?: boolean, alert?: boolean, onClick?: () => void }> = ({ icon, text, active, alert, onClick }) => {
  const { expanded } = useContext(SidebarContext);
  return (
    <li
      onClick={onClick}
      className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${active !== undefined && active ? 'bg-gradient-to-tr from-primary-200 to-primary-400 text-gray-600' : 'hover:bg-primary-200'}`}>
      {icon}
      <span className={`overflow-hidden transition-all ${expanded ? 'xl:w-52 xl:ml-3 w-0' : 'w-0'}`}>{text}</span>
      {alert === true && <div className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expanded ? '' : 'top-2'}`}></div>}
      {!expanded && (
        <div className={'absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0'}>
          {text}
        </div>
      )}
    </li>
  );
};
