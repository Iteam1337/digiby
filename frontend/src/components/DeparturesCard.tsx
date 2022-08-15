import { useAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';

import { Departure } from '../utils/types';
import { departuresDetails } from '../utils/atoms';
import { getHoursAndMinutes, humanizeTime } from '../utils/dateTimeFormatting';

const DeparturesCard = ({ departure }: { departure: Departure }) => {
  const [details, setDetails] = useAtom(departuresDetails);
  const navigate = useNavigate();

  const handleClick = () => {
    setDetails(departure);
    navigate('/departure-details');
  };

  return (
    <button
      onClick={() => handleClick()}
      className="mb-4 w-full rounded-md bg-pm-white p-4"
    >
      <div className="flex justify-between">
        <p className="font-bold">
          {`${departure.transportation_type} ${
            departure.line_number ? departure.line_number : ''
          }`}
        </p>
        <p>{getHoursAndMinutes(departure.stops)}</p>
      </div>
      <div className="flex justify-between pb-6">
        <p className="text-xs">{departure.agency}</p>
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
