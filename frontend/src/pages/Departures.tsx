import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { useSearchParams } from 'react-router-dom';
import { differenceInDays } from 'date-fns';

import Loading from '../components/Loading';
import { departuresAtom, fromToAddressAtom } from '../utils/atoms';
import DeparturesCard from '../components/DeparturesCard';
import { DepartureSearchParams } from '../utils/types';
import { formatDate } from '../utils/dateTimeFormatting';

const Departures = () => {
  const [departures, getDepartures] = useAtom(departuresAtom);
  const [_fromToAddress, setFromToAddress] = useAtom(fromToAddressAtom);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fromAddress = searchParams.get('fromAddress');
    const toAddress = searchParams.get('toAddress');
    if (fromAddress && toAddress) {
      setFromToAddress({ from: fromAddress, to: toAddress });
    }

    const fromLat = searchParams.get('fromLat');
    const fromLng = searchParams.get('fromLng');
    const toLat = searchParams.get('toLat');
    const toLng = searchParams.get('toLng');
    const date = searchParams.get('date');
    const time = searchParams.get('time');

    if (fromLat && fromLng && toLat && toLng && time && date) {
      const departureSearchParams: DepartureSearchParams = {
        fromLat,
        fromLng,
        toLat,
        toLng,
        time,
        date,
      };
      getDepartures(departureSearchParams);
    }
  }, [searchParams]);

  const { loading, data, error } = departures;

  if (loading) {
    return <Loading />;
  }

  if (!loading && error) {
    return <span>Försök igen...</span>;
  }

  const getDaysFromToday = (date: string) => {
    const today = formatDate(new Date());
    const diff = differenceInDays(new Date(date), new Date(today));

    if (diff === 0) {
      return 'Idag';
    }
    if (diff === 1) {
      return 'Imorgon';
    }
    if (diff > 1) {
      return date;
    }
  };

  const dates: string[] = [];

  data?.forEach((item, i) => {
    if (i === 0) {
      dates.push(item.date);
    } else if (dates.indexOf(item.date) === -1) {
      dates.push(item.date);
    }
  });

  return (
    <section className="mx-auto w-full max-w-screen-sm px-6 pt-6">
      {data && (
        <>
          {dates.map((date: string, i: number) => {
            return (
              <div key={i}>
                <h3 className="mb-6 text-xl font-bold">
                  {getDaysFromToday(date)}
                </h3>
                {data?.map((item, i) => {
                  if (item.date === date) {
                    return <DeparturesCard key={i} departure={item} />;
                  }
                })}
              </div>
            );
          })}
        </>
      )}
      {!loading && data?.length === 0 && (
        <div className=" flex flex-col items-center">
          <p>Ingen rutt hittades</p>
          <a className="underline" href="/">
            Tillbaka till sök
          </a>
        </div>
      )}
    </section>
  );
};

export default Departures;
