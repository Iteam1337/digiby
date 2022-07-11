import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { useSearchParams } from 'react-router-dom';

import { departuresAtom, fromToAddressAtom } from '../utils/atoms';
import DeparturesCard from '../components/DeparturesCard';
import { DepartureSearchParams } from '../utils/types';

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
    return <span>Söker...</span>;
  }

  if (!loading && error) {
    return <span>Försök igen...</span>;
  }

  return (
    <section className=" mx-4 h-full bg-pm-background">
      <h3 className="my-6 text-xl font-bold">Idag</h3>
      {data &&
        data.map((item, i) => <DeparturesCard key={i} departure={item} />)}

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
