import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import ArrowIcon from '../icons/ArrowIcon';

const Layout = ({ children }: { children: JSX.Element }) => {
  const [page, setPage] = useState('');
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    switch (pathname) {
      case '/':
        setPage('home');
        break;
      case '/departures':
        setPage('departures');
        break;
      default:
        break;
    }
  }, [pathname]);

  //TODO: get title from global state
  return (
    <>
      <div
        className={`${
          page === 'home' ? 'bg-pm-green' : 'bg-pm-background'
        } h-screen`}
      >
        <header className="mb-6 bg-pm-green p-6">
          {page === 'departures' && (
            <div className="mx-auto flex flex-col max-w-screen-sm">
              <div className='flex justify-center'>
                <button onClick={() => navigate('/')} >
                  <ArrowIcon />
                </button>
                <h2 className='text-white font-bold '>Min position - JokkMokk </h2>
              </div>
              <p className='text-white text-xs text-center'>Tidigast avgång</p>
            </div>
          )}
        </header>
        <main className="mx-auto w-full max-w-screen-sm">{children}</main>
      </div>
    </>
  );
};

export default Layout;
