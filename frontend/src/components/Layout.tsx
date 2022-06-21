import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }: { children: JSX.Element }) => {
  const [backgroundColor, setBackgroundColor] = useState('');
  const { pathname } = useLocation();

  useEffect(() => {
    switch (pathname) {
      case '/':
        setBackgroundColor('home');
        break;
      case '/departures':
        setBackgroundColor('departures');
        break;
      default:
        break;
    }
  }, [pathname]);

  return (
    <>
      <div
        className={`${
          backgroundColor === 'home' ? 'bg-pm-green' : 'bg-pm-background'
        } h-screen`}
      >
        <header className="mb-6 bg-pm-green p-6">Header</header>
        <main className="mx-auto w-full max-w-screen-sm">{children}</main>
      </div>
    </>
  );
};

export default Layout;
