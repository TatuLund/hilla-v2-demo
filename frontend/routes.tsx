import MainLayout from 'Frontend/views/MainLayout.js';
import { createBrowserRouter, RouteObject, useMatches } from 'react-router-dom';
import LoginView from './views/LoginView';
import { protectRoutes, RouteObjectWithAuth } from '@vaadin/hilla-react-auth';
import TodoView from 'Frontend/views/todo/TodoView.js';
import StatsView from 'Frontend/views/stats/StatsView.js';
import EditorView from 'Frontend/views/stats/EditorView.js';
import GoogleChartView from 'Frontend/views/stats/GoogleChartView.js';

// const TodoView = lazy(async () => import('Frontend/views/todo/TodoView.js'));
// const StatsView = lazy(async () => import('Frontend/views/stats/StatsView.js'));
// const EditorView = lazy(async () => import('Frontend/views/stats/EditorView.js'));
// const GoogleChartView = lazy(async () => import('Frontend/views/stats/GoogleChartView.js'));

export type MenuProps = Readonly<{
  icon?: string;
  title?: string;
}>;

export type ViewMeta = Readonly<{ handle?: MenuProps }>;

type Override<T, E> = Omit<T, keyof E> & E;

export type ViewRouteObject = Override<RouteObjectWithAuth, ViewMeta>;

type RouteMatch = ReturnType<typeof useMatches> extends (infer T)[] ? T : never;

export type ViewRouteMatch = Readonly<Override<RouteMatch, ViewMeta>>;

export const useViewMatches = useMatches as () => readonly ViewRouteMatch[];

export const routes: readonly RouteObject[] = protectRoutes([
    {
    element: <MainLayout />,
    handle: { icon: 'null', title: 'Main' },
    children: [
      { path: '/', element: <TodoView />, handle: { icon: 'la la-list-alt', title: 'Todo', requiresLogin: true } },
      {
        path: '/stats',
        element: <StatsView />,
        handle: { icon: 'la la-chart-line', title: 'Stats', requiresLogin: true },
      },
      {
        path: '/editor',
        element: <EditorView />,
        handle: { icon: 'la la-table', title: 'Editor', requiresLogin: true, rolesAllowed: ['ROLE_ADMIN'] },
      },
      {
        path: '/chart',
        element: <GoogleChartView />,
        handle: { icon: 'la la-table', title: 'GChart', requiresLogin: true },
      },
    ],
  },
  {
    element: <LoginView />,
    handle: { icon: 'null', title: 'Login' },
    path: '/login',
  },
]);

const router = createBrowserRouter([...routes]);
export default router;
