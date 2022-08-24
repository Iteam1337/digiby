import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { differenceInDays } from 'date-fns';

import Loading from '../components/Loading';
import { departuresAtom } from '../utils/atoms';
import DeparturesCard from '../components/DeparturesCard';
import { DepartureSearchParams } from '../utils/types';
import { formatDate } from '../utils/dateTimeFormatting';
import Section from '../components/Section';
import EmptyStates from '../components/EmptyStates';

const Departures = () => {
  const [departures, getDepartures] = useAtom(departuresAtom);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
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
    return (
      <EmptyStates
        heading="Inga resor hittades"
        text="Vi hittade inga resor genom er sökning. Prova att ändra hållplats,
    tid, dag eller försök senare."
        buttonText="Tillbaka till sökningen"
        onClick={() => navigate(-1)}
      />
    );
  }

  const getDaysFromToday = (date: string) => {
    const today = formatDate(new Date());
    const diff = differenceInDays(new Date(date), new Date(today));

    if (diff === 0) {
      return 'Idag';
    } else if (diff === 1) {
      return 'Imorgon';
    } else {
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
    <Section departures>
      <h1 className="sr-only">Tidigaste avgångar</h1>
      <>
        {data && (
          <>
            {dates.map((date: string, i: number) => {
              return (
                <div key={i}>
                  {date && (
                    <h2 className="mb-6 text-xl font-bold">
                      {getDaysFromToday(date)}
                    </h2>
                  )}
                  {data.map((item, i) => {
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
      </>
    </Section>
  );
};

export default Departures;
