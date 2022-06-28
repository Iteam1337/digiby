import { useAtom } from 'jotai';

import { departuresAtom } from '../utils/atoms';
import DeparturesCard from '../components/DeparturesCard';

const Departures = () => {
  const [departures] = useAtom(departuresAtom);

  const { loading, data, error } = departures;

  if (loading) {
    return <span>Söker...</span>;
  }

  if (!loading && error) {
    return <span>Försök igen...</span>;
  }

  const humanizeTime = (timeInSeconds: number) => {
    const totalMinutes = timeInSeconds / 60;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    const str = hours > 0 ? `${hours}h ` : '';
    return str + `${minutes} min`;
  };

  const formatTime = (stops: Array<any>) => {
    const departureTime = stops[0].arrival_time;
    const arrivalTime = stops[stops.length - 1].arrival_time;
    return `${departureTime} — ${arrivalTime}`;
  };

  return (
    <section className=" mx-4 bg-pm-background">
      <h3 className="my-6 text-xl font-bold">Idag</h3>
      <DeparturesCard
        vehicle={data[0].line_number}
        vehicleInfo={data[0].transportation_type}
        time={formatTime(data[0].stops)}
        totalTime={humanizeTime(data[0].travel_time)}
        cost={`${data[0].cost} SEK`}
      />
    </section>
  );
};

export default Departures;
