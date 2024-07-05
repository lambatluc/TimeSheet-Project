import React from 'react';
import Layout from '@/layout/Layout';
import Create from '@/features/ProjectFormManager/ProjectFormManager';
import ProjectManager from '@/features/Project Manager/ProjectManager';
import General from '@/features/ProjectFormManager/General/General';
import Tasks from '@/features/ProjectFormManager/Tasks/Tasks';
import Notification from '@/features/ProjectFormManager/Notification/Notification';
import Team from '@/features/ProjectFormManager/Team/Team';
import Construction from '@/components/Construction/Construction';
import View from '@/features/View/View';
import TasksView from '@/features/View/TasksView/TasksView';
import TeamView from '@/features/View/TeamView/TeamView';
import Page404 from '@/components/404/Page404';
import AnimatedPage from '@/provider/ChangePage';
export const protectedRoutes = [
  {
    element: <Layout />,
    children: [
      {
        element: <ProjectManager />,
        path: '/projects'
      },
      {
        element: <ProjectManager />,
        path: '/'
      },
      {
        element: <Construction />,
        path: '/construction'
      },
      {
        element: <View />,
        children: [
          {
            element: <TasksView />,
            path: '/projects/view/tasks/:id'
          },
          {
            element: <TeamView />,
            path: '/projects/view/team/:id'
          }
        ]
      },
      {
        element: <Create />,
        children: [
          {
            element: <General />,
            path: '/projects/create/general'
          },
          {
            element: <Team />,
            path: '/projects/create/team'
          },
          {
            element: <Tasks />,
            path: '/projects/create/tasks'
          },
          {
            element: <Notification />,
            path: '/projects/create/notification'
          }
        ]
      },
      {
        element: <Create />,
        children: [
          {
            element: <General />,
            path: '/projects/edit/general/:id'
          },
          {
            element: <Team />,
            path: '/projects/edit/team/:id'
          },
          {
            element: <Tasks />,
            path: '/projects/edit/tasks/:id'
          },
          {
            element: <Notification />,
            path: '/projects/edit/notification/:id'
          }
        ]
      }
    ]
  },
  {
    element: (
      <AnimatedPage>
        <Page404 />
      </AnimatedPage>
    ),
    path: '*'
  }
];
