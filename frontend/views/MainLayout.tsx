import { AppLayout } from '@hilla/react-components/AppLayout.js';
import { Avatar } from '@hilla/react-components/Avatar.js';
import { Button } from '@hilla/react-components/Button.js';
import { DrawerToggle } from '@hilla/react-components/DrawerToggle.js';
import { useAuth } from 'Frontend/auth.js';
import Placeholder from 'Frontend/components/placeholder/Placeholder';
import { useRouteMetadata } from 'Frontend/util/routing';
import { Suspense } from 'react';
import { Item } from '@hilla/react-components/Item.js';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { MenuProps, routes, useViewMatches, ViewRouteObject } from 'Frontend/routes.js';
import css from './MainLayout.module.css';
import UserInfo from 'Frontend/generated/com/example/application/services/UserInfo';
import { Tooltip } from '@hilla/react-components/Tooltip.js';
import { RouteObjectWithAuth } from '@hilla/react-auth';

type MenuRoute = RouteObjectWithAuth &
  Readonly<{
    path: string;
    handle: Required<MenuProps>;
  }>;

const navLinkClasses = ({ isActive }: any) => {
  return `block rounded-m p-s ${isActive ? 'bg-primary-10 text-primary' : 'text-body'}`;
};

function profilePictureUrl(userInfo: UserInfo): string {
  const profilePictureUrl = `data:image;base64,${btoa(
    userInfo.picture ? userInfo.picture.reduce((str, n) => str + String.fromCharCode((n + 256) % 256), '') : ''
  )}`;
  return profilePictureUrl;
}

export default function MainLayout() {
  const currentTitle = useRouteMetadata()?.title ?? 'My App';
  const menuRoutes = (routes[0]?.children || []).filter(
    (route) => route.path && route.handle && route.handle.icon && route.handle.title
  ) as readonly MenuRoute[];
  const matches = useViewMatches();
  const navigate = useNavigate();
  const { state, logout, hasAccess } = useAuth();

  function Menu() {
    return (
      <nav>
        {menuRoutes
          .filter((route) => hasAccess({ rolesAllowed: route.handle.rolesAllowed }))
          .map(({ path, handle: { icon, title } }) => (
            <MenuLink key={path} path={path} handle={{ icon, title }} />
          ))}
      </nav>
    );
  }

  function LogoutButton() {
    return (
      <Button
        onClick={async () => {
          logout();
          navigate('/login');
        }}
      >
        Sign out
      </Button>
    );
  }

  function Footer() {
    return (
      <footer className="flex flex-col gap-s">
        {state.user ? (
          <>
            <AvatarWithTooltip userInfo={state.user} />
            <LogoutButton />
          </>
        ) : (
          <a href="/login">Sign in</a>
        )}
      </footer>
    );
  }

  return (
    <AppLayout primarySection="drawer">
      <div slot="drawer" className="flex flex-col justify-between h-full p-m">
        <header className="flex flex-col gap-m">
          <h1 className="text-l m-0">My App</h1>
          <Menu />
        </header>
        <Footer />
      </div>

      <DrawerToggle slot="navbar" aria-label="Menu toggle"></DrawerToggle>
      <h2 slot="navbar" className="text-l m-0">
        {currentTitle}
      </h2>

      <Suspense fallback={<Placeholder />}>
        <Outlet />
      </Suspense>
    </AppLayout>
  );
}

function MenuLink({ path, handle: { icon, title } }: MenuRoute) {
  return (
    <NavLink className={({ isActive }) => `${css.navlink} ${isActive ? css.navlink_active : ''}`} key={path} to={path}>
      {({ isActive }) => (
        <Item key={path} selected={isActive}>
          <span className={`${icon} ${css.navicon}`} aria-hidden="true"></span>
          {title}
        </Item>
      )}
    </NavLink>
  );
}

function AvatarWithTooltip({ userInfo }: { userInfo: UserInfo }) {
  return (
    <Avatar
      id="avatar"
      theme="xsmall"
      img={profilePictureUrl(userInfo)}
      name={userInfo.fullName}
      style={{ cursor: 'pointer' }}
    >
      <Tooltip for="avatar" text={userInfo.name} />
    </Avatar>
  );
}
