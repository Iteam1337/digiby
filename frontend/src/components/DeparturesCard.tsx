import { useAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';

import { Departure } from '../utils/types';
import { departuresDetails } from '../utils/atoms';

const DeparturesCard = ({ departure }: { departure: Departure }) => {
  const [details, setDetails] = useAtom(departuresDetails);
  const navigate = useNavigate();

  const handleClick = () => {
    setDetails(departure);
    navigate('/departure-details');
  };

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
    <button
      onClick={() => handleClick()}
      className="mb-4 w-full rounded-md bg-pm-white p-4"
    >
      <div className="flex justify-between">
        <p className="font-bold">{departure.line_number}</p>
        <p>{formatTime(departure.stops)}</p>
      </div>
      <div className="flex justify-between pb-6">
        <p className="text-xs">{departure.transportation_type}</p>
        <p className="text-xs">{humanizeTime(departure.travel_time)}</p>
      </div>
      <div className="flex justify-end">
        {/* <p className="font-bold">{`${departure.cost} SEK`}</p> */}
        <p className="font-bold">200 SEK</p>
      </div>
    </button>
  );
};

export default DeparturesCard;
