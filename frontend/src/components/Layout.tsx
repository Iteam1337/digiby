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
        <header
          className={`${
            pathname === '/departure-details' && 'absolute z-10'
          } w-full bg-pm-green p-6`}
        >
          <div className="mx-auto max-w-screen-sm  ">
            <button onClick={() => navigate(-1)} className="absolute top-8">
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
        <section className="mx-auto w-full max-w-screen-sm px-6 pt-6">
          {children}
        </section>
      </main>
    </>
  );
};

export default Layout;
