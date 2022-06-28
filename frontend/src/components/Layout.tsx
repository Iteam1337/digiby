import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';

import { departuresAtom } from '../utils/atoms';
import ArrowIcon from '../icons/ArrowIcon';

const Layout = ({ children }: { children: JSX.Element }) => {
  const [page, setPage] = useState('');
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [departures] = useAtom(departuresAtom);

  const { data } = departures;

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
                  <h2 className="ml-4 text-center font-bold text-white">
                    {data &&
                      data[0].departure.stop_position.name +
                        ' - ' +
                        data[0].destination.stop_position.name}
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
