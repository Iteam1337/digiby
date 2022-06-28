import { Departure } from '../utils/types';

const DeparturesInfo = ({ departure }: { departure: Departure }) => {
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
    <section className="absolute left-0 bottom-0 right-0 bg-pm-white p-6">
      <div className="flex justify-between">
        <p className="font-bold">{departure.line_number}</p>
        <p>{formatTime(departure.stops)}</p>
      </div>
      <div className="flex justify-between pb-6">
        <p className="text-xs">{departure.transportation_type}</p>
        <p className="text-xs">{humanizeTime(departure.travel_time)}</p>
      </div>
      <div className="flex justify-end">
        <p className="font-bold">{`${departure.cost} SEK`}</p>
      </div>
    </section>
  );
};

export default DeparturesInfo;
