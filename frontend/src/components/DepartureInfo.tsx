import { useState } from 'react';

import ArrowIcon from '../icons/ArrowIcon';
// import DragIcon from '../icons/DragIcon';
import { Departure } from '../utils/types';

const DepartureInfo = ({ departure }: { departure: Departure }) => {
  const [open, setOpen] = useState(false);
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

  const myPositionTime = (distance: number, arrival: string) => {
    // Convert meters_from_query_to_stop to milliseconds.
    // 5km/h is the normal walking pacem which equals to 83m/min.
    const millisecondsToDepartureStop = (distance / 83) * 60000;

    // Convert departure arrival_time to milliseconds.
    const [hours, minutes, seconds] = arrival.split(':');
    const arrivalTimeMilliseconds =
      +hours * 60 * 60000 + +minutes * 60000 + +seconds * 1000;

    // Return time to start walking by subtractong the walking distance to the first stop.
    return new Date(arrivalTimeMilliseconds - millisecondsToDepartureStop)
      .toISOString()
      .substring(11, 16);
  };

  return (
    <details className="absolute left-0 bottom-0 right-0 z-10 max-h-screen overflow-scroll rounded-t-md bg-pm-white">
      <summary
        className="mx-6 max-w-screen-sm cursor-pointer list-none pb-6 sm:mx-auto sm:w-full"
        onClick={() => setOpen(!open)}
      >
        <p className="sr-only">Information om din resa</p>
        <div className="flex w-full justify-center py-3" aria-hidden="true">
          <ArrowIcon
            className={` fill-pm-dark-grey ${
              open ? 'rotate-[270deg]' : 'rotate-90'
            } overflow-y-scroll`}
          />
          {/* todo: add swipte functionality to open details */}
          {/* <ArrowIcon
            className={`invisible fill-pm-dark-grey md:visible ${
              open ? 'rotate-[270deg]' : 'rotate-90'
            } overflow-y-scroll`}
          />
          <DragIcon className="visible fill-pm-dark-grey md:invisible" /> */}
        </div>
        <div className="flex justify-between">
          <p className="font-bold">{departure.line_number}</p>
          <p className="text-xs">{formatTime(departure.stops)}</p>
        </div>
        <div className="flex justify-between pb-6">
          <p className="text-xs">{departure.transportation_type}</p>
          <p className="text-xs">{humanizeTime(departure.travel_time)}</p>
        </div>
        <div className="flex justify-end">
          {/* <p className="font-bold">{`${departure.cost} SEK`}</p> */}
          <p className="font-bold">200 SEK</p>
        </div>
      </summary>
      <div className="mx-6 flex max-w-screen-sm border-t border-t-pm-black pt-6 sm:mx-auto sm:w-full">
        <div className="flex flex-col gap-6">
          {departure.departure.meters_from_query_to_stop < 10000 && (
            <p className="text-xs">
              {myPositionTime(
                departure.departure.meters_from_query_to_stop,
                departure.stops[0].arrival_time
              )}
            </p>
          )}
          {departure.stops.map((stop) => (
            <div key={stop.arrival_time} className="">
              <p className="text-xs">{stop.arrival_time.substring(0, 5)}</p>
            </div>
          ))}
        </div>

        <div className="mt-[4px] flex flex-col" aria-hidden="true">
          {departure.departure.meters_from_query_to_stop < 10000 && (
            <div className="flex flex-col">
              <div className="mx-[12px] h-[10px] w-[10px] rounded-full border-2 border-pm-dark-grey" />
              <div className="divide flex h-[30px] divide-x-2 divide-dotted divide-pm-dark-grey">
                <div className=" w-[16px]" />
                <div className=" w-[16px]" />
              </div>
            </div>
          )}
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
          {departure.departure.meters_from_query_to_stop < 10000 && (
            <p className="text-xs">Min position</p>
          )}
          {departure.stops.map((stop) => (
            <div key={stop.arrival_time} className="">
              <p className="text-xs">{stop.stop_position.name}</p>
            </div>
          ))}
        </div>
      </div>
    </details>
  );
};

export default DepartureInfo;
