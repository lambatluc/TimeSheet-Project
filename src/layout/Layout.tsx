import React, { Suspense, createContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import SideBarApp from './SideBar/SideBarApp';
import { cn } from '@/lib/utils';
import Loading from '@/components/Loading/Loading';
interface SidebarContextType {
  expanded: boolean
  toggleExpanded: () => void
}
const SidebarContext = createContext<SidebarContextType>({
  expanded: true,
  toggleExpanded: () => {}
});
export { SidebarContext };
const Layout = (): JSX.Element => {
  const [showLoading, setShowLoading] = useState(true);
  const [expanded, setExpanded] = useState(true);
  const toggleExpanded = (): void => setExpanded(curr => !curr);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <SidebarContext.Provider value={{ expanded, toggleExpanded }}>
      <div className="flex flex-col">
        {showLoading
          ? <Loading/>
          : <div className="flex flex-grow">
            <div className={`fixed ${expanded ? 'xl:w-72 w-16' : 'xl:w-16'} transition-width duration-300`}>
              <SideBarApp/>
            </div>
            <div className={cn('flex-grow transition-all duration-300', expanded ? 'xl:pl-72 pl-16' : 'pl-16')}>
              <Suspense>
                <Outlet/>
              </Suspense>
            </div>
          </div>
        }
      </div>
    </SidebarContext.Provider>
  );
};

export default Layout;
