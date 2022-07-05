import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';

import { fromToAddressAtom } from '../utils/atoms';
import ArrowIcon from '../icons/ArrowIcon';

const Layout = ({ children }: { children: JSX.Element }) => {
  const [homeScreen, setHomeScreen] = useState(true);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [fromToAddress] = useAtom(fromToAddressAtom);

  useEffect(() => {
    switch (pathname) {
      case '/':
        setHomeScreen(true);
        break;
      case '/departures':
        setHomeScreen(false);
        break;
      case '/departure-details':
        setHomeScreen(false);
        break;
      default:
        break;
    }
  }, [pathname]);

  return (
    <>
      <header className="relative z-10 w-full bg-pm-green p-6">
        {!homeScreen && (
          <div className="mx-auto max-w-screen-sm  ">
            <button onClick={() => navigate('/')} className="absolute top-8">
              <ArrowIcon className="fill-pm-white" />
            </button>
            <div className="flex flex-col justify-center">
              <div className="flex justify-center">
                {fromToAddress && (
                  <h2 className="ml-4 text-center font-bold text-white">
                    {fromToAddress.from + ' - ' + fromToAddress.to}
                  </h2>
                )}
              </div>
              <p className="text-center text-xs text-white">
                Tidigaste avgångar
              </p>
            </div>
          </div>
        )}
      </header>
      <main
        className={`${
          homeScreen ? 'bg-pm-green' : 'bg-pm-background'
        }  h-full min-h-screen w-full pt-6 `}
      >
        <article className="mx-auto w-full max-w-screen-sm">{children}</article>
      </main>
    </>
  );
};

export default Layout;
