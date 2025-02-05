import { ReactNode } from 'react';

declare module './Layout' {
  interface LayoutProps {
    children: ReactNode;
  }

  const Layout: React.ComponentType<LayoutProps>;
  export default Layout;
}