import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SideBar, SidebarItem } from './SideBar';
import {
  User,
  Lock,
  FolderOpenDot,
  CalendarDays,
  CalendarX,
  Clock7,
  Settings,
  LifeBuoy,
  Sun,
  Moon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setTheme, setThemeColor } from '@/store/slice/theme/themeSlice';
import { CONSTRUCTION, HOME } from '@/constants';
export default function SideBarApp (): JSX.Element {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.theme);
  const themeColor = useSelector((state: RootState) => state.theme.themeColor);
  const [isSettingSheetOpen, setSettingSheetOpen] = useState(false);
  const onSelectTheme = (newTheme: 'dark' | 'light'): void => {
    if (theme === newTheme) return;
    dispatch(setTheme(newTheme));
  };
  const onSelectColorTheme = (newColorTheme: 'theme-lime' | 'theme-red' | 'theme-cyan' | 'theme-orange'): void => {
    if (themeColor === newColorTheme) return;
    dispatch(setThemeColor(newColorTheme));
  };

  const handleSettingClick = (): void => {
    setSettingSheetOpen(true);
  };
  const location = useLocation();
  const currentPath = location.pathname;
  return (
    <>
      <div className="flex">
        <SideBar>
          <Link to={CONSTRUCTION}>
            <SidebarItem icon={<User size={20} />} text="My Profile" active={currentPath === '/myprofile'}/>
          </Link>
          <Link to={CONSTRUCTION}>
            <SidebarItem icon={<Lock size={20} />} text="Admin" active={currentPath === '/admin'} />
          </Link>
          <Link to={HOME}>
            <SidebarItem icon={<FolderOpenDot size={20} />} text="Projects" alert active={currentPath.startsWith(HOME)}/>
          </Link>
          <Link to={CONSTRUCTION}>
            <SidebarItem icon={<CalendarDays size={20} />} text="Timesheets" active={currentPath === '/timesheets'}/>
          </Link>
          <Link to={CONSTRUCTION}>
            <SidebarItem icon={<CalendarX size={20} />} text="Team working calendar" active={currentPath === '/myrequest'}/>
          </Link>
          <Link to={CONSTRUCTION}>
            <SidebarItem icon={<Clock7 size={20} />} text="My working time" active={currentPath === '/myworking'}/>
          </Link>
          <hr className="my-3" />
          <SidebarItem icon={<Settings size={20}/>} text="Settings" onClick={handleSettingClick}/>
          <SidebarItem icon={<LifeBuoy size={20} />} text="Help" />
        </SideBar>
        <Sheet open={isSettingSheetOpen} onOpenChange={setSettingSheetOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className='text-center'>Setting Timesheet</SheetTitle>
            </SheetHeader>
            <div className="flex justify-center items-center mt-7 space-x-7">
              <Button className={cn(theme === 'dark' ? 'bg-primary-400' : 'bg-primary-200')} onClick={() => onSelectTheme('light')} disabled={ theme === 'light' }><Sun className="w-20 scale-100"/></Button>
              <Button className={cn(theme === 'dark' ? 'bg-primary-200' : 'bg-primary-400')} onClick={() => onSelectTheme('dark')} disabled={ theme === 'dark' }><Moon className="w-20 scale-100" /></Button>
            </div>
            <div className='mt-5'>
              <Accordion type='multiple' className='w-full'>
                <AccordionItem value='1'>
                  <AccordionTrigger className='text-center'>Change Theme Color</AccordionTrigger>
                  <AccordionContent className='space-x-5 justify-center flex items-center h-20'>
                    <div className='w-full flex justify-center items-center space-x-7'>
                      <button disabled={themeColor === 'theme-lime'} className='hover:scale-125 disabled:hover:scale-100' onClick={() => onSelectColorTheme('theme-lime')}>
                        <div className='rounded-full w-5 h-5 bg-lime-400'></div>
                      </button>
                      <button disabled={themeColor === 'theme-red'} className='hover:scale-125 disabled:hover:scale-100' onClick={() => onSelectColorTheme('theme-red')}>
                        <div className='rounded-full w-5 h-5 bg-red-400'></div>
                      </button>
                      <button disabled={themeColor === 'theme-cyan'} className='hover:scale-125 disabled:hover:scale-100' onClick={() => onSelectColorTheme('theme-cyan')}>
                        <div className='rounded-full w-5 h-5 bg-cyan-400'></div>
                      </button>
                      <button disabled={themeColor === 'theme-orange'} className='hover:scale-125 disabled:hover:scale-100' onClick={() => onSelectColorTheme('theme-orange')}>
                        <div className='rounded-full w-5 h-5 bg-orange-400'></div>
                      </button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
