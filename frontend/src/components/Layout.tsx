import { useLocation, useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';

import { fromToAddressAtom } from '../utils/atoms';
import ArrowIcon from '../icons/ArrowIcon';

const Layout = ({ children }: { children: JSX.Element }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [fromToAddress] = useAtom(fromToAddressAtom);

  return (
    <>
      {pathname !== '/' && (
        <header className="w-full bg-pm-green p-6">
          <div className="mx-auto max-w-screen-sm">
            <button
              onClick={() => navigate(-1)}
              className="absolute top-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-pm-white focus-visible:ring-offset-8 focus-visible:ring-offset-pm-green"
              aria-label="Gå tillbaka"
            >
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
        </header>
      )}
      <main
        className={`${
          pathname === '/' ? ' bg-pm-green' : 'bg-pm-background'
        } h-full w-full`}
      >
        {children}
      </main>
    </>
  );
};

export default Layout;
