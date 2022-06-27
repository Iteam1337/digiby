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
            <div className="mx-auto max-w-screen-sm  ">
              <button onClick={() => navigate('/')} className="absolute top-8">
                <ArrowIcon />
              </button>
              <div className="flex flex-col justify-center">
                <div className="flex justify-center">
                  <h2 className="font-bold text-white ">
                    Min position - JokkMokk{' '}
                  </h2>
                </div>
                <p className="text-center text-xs text-white">
                  Tidigast avgång
                </p>
              </div>
            </div>
          )}
        </header>
        <main className="mx-auto w-full max-w-screen-sm">{children}</main>
      </div>
    </>
  );
};

export default Layout;
