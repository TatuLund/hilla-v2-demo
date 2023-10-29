import MainLayout from 'Frontend/views/MainLayout.js';
import { lazy } from 'react';
import { createBrowserRouter, IndexRouteObject, NonIndexRouteObject, useMatches } from 'react-router-dom';
import LoginView from './views/LoginView';

const TodoView = lazy(async () => import('Frontend/views/todo/TodoView.js'));
const StatsView = lazy(async () => import('Frontend/views/stats/StatsView.js'));
const EditorView = lazy(async () => import('Frontend/views/stats/EditorView.js'));

export type MenuProps = Readonly<{
  icon?: string;
  title?: string;
}>;

export type ViewMeta = Readonly<{ handle?: MenuProps }>;

type Override<T, E> = Omit<T, keyof E> & E;

export type IndexViewRouteObject = Override<IndexRouteObject, ViewMeta>;
export type NonIndexViewRouteObject = Override<
  Override<NonIndexRouteObject, ViewMeta>,
  {
    children?: ViewRouteObject[];
  }
>;
export type ViewRouteObject = IndexViewRouteObject | NonIndexViewRouteObject;

type RouteMatch = ReturnType<typeof useMatches> extends (infer T)[] ? T : never;

export type ViewRouteMatch = Readonly<Override<RouteMatch, ViewMeta>>;

export const useViewMatches = useMatches as () => readonly ViewRouteMatch[];

export const routes: readonly ViewRouteObject[] = [
  {
    element: <MainLayout />,
    handle: { icon: 'null', title: 'Main' },
    children: [
      { path: '/', element: <TodoView />, handle: { icon: 'la la-list-alt', title: 'Todo' } },
      { path: '/stats', element: <StatsView />, handle: { icon: 'la la-chart-line', title: 'Stats' } },
      { path: '/editor', element: <EditorView />, handle: { icon: 'la la-table', title: 'Editor' } },
    ],
  },
  {
    element: <LoginView />,
    handle: { icon: 'null', title: 'Login' },
    path: '/login',
  }
];

const router = createBrowserRouter([...routes]);
export default router;
