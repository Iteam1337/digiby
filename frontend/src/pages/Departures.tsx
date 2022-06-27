import { useAtom } from 'jotai';
import moment from 'moment';

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

  if (data) {
    console.log(data[0]);
  }

  //TODO: map out all departures

  const totalTravelTime = moment(data[0].travel_time).format('HH-mm-ss');
  // .duration(data[0].travel_time * 1000)
  // .humanize();

  return (
    <section className=" mx-4 bg-pm-background">
      <h3 className="my-6 text-xl font-bold">Idag</h3>
      <DeparturesCard
        vehicle={data[0].line_number}
        vehicleInfo={data[0].transportation_type}
        time={data[0].stops[0].arrival_time}
        totalTime={`${totalTravelTime}`}
        cost={`${data[0].cost} SEK`}
      />
    </section>
  );
};

export default Departures;
