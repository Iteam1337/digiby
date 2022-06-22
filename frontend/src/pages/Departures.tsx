import { useQuery } from 'react-query';

import DeparturesCard from '../components/DeparturesCard';
import getTransports from '../utils/getTransports';

const Departures = () => {
  // todo: find solution to ts error below by adding generics (<..., Error>)?
  const { isLoading, isError, data, error } = useQuery(
    'transports',
    getTransports
  );

  if (isLoading) {
    return <span>Söker...</span>;
  }

  if (isError) {
    // @ts-ignore: Unreachable code error
    return <span>Något gick fel: {error.message}</span>;
  }

  return (
    <section className=" mx-4 bg-pm-background">
      <h3 className="my-6 text-xl font-bold">Idag</h3>
      <DeparturesCard
        vehicle={data[0].route_id}
        vehicleInfo={data[0].transportation_type}
        time={`${data[0].departure.arrives_at.slice(
          11,
          16
        )}–${data[0].destination.arrives_at.slice(11, 16)}`}
        totalTime={`${data[0].travel_time} min`}
        cost={`${data[0].cost} SEK`}
      />
      <DeparturesCard
        vehicle={data[0].route_id}
        vehicleInfo={data[0].transportation_type}
        time={`${data[0].departure.arrives_at.slice(
          11,
          16
        )}–${data[0].destination.arrives_at.slice(11, 16)}`}
        totalTime={`${data[0].travel_time} min`}
        cost={`${data[0].cost} SEK`}
      />
    </section>
  );
};

export default Departures;
