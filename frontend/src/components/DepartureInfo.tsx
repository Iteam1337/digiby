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
    <section className="absolute left-0 bottom-0 right-0 z-10 divide-y divide-pm-black rounded-t-md bg-pm-white p-6">
      <div className="pb-6">
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
      </div>
      <div className="flex pt-6">
        <div className="flex flex-col gap-6">
          {departure.stops.map((stop) => (
            <div key={stop.arrival_time} className="">
              <p className="text-xs">{stop.arrival_time}</p>
            </div>
          ))}
        </div>
        <div className="mt-[4px] flex flex-col">
          {departure.stops.map((stop, i) => {
            return (
              <div className="flex flex-col" key={stop.arrival_time}>
                <div className="mx-[12px] h-[10px] w-[10px] rounded-full border-2 border-pm-dark-grey" />
                <div className="divide flex h-[30px] divide-x-2 divide-pm-dark-grey">
                  {i < departure.stops.length - 1 && (
                    <>
                      <div className=" w-[16px]" />
                      <div className=" w-[16px]" />
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex flex-col gap-6">
          {departure.stops.map((stop) => (
            <div key={stop.arrival_time} className="">
              <p className="text-xs">{stop.stop_position.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DeparturesInfo;
