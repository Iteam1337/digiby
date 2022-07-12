import moment from 'moment';

const formatDate = (date: Date) => {
  return moment(date).format('YYYY-MM-DD');
};

const formatTime = (date: Date) => {
  return moment(date).format('HH:mm');
};

const getHoursAndMinutes = (stops: Array<any>) => {
  const departureTime = stops[0].arrival_time;
  const hoursAndMinutesDeparture = departureTime.split(':', 2);

  const arrivalTime = stops[stops.length - 1].arrival_time;
  const hoursAndMinutesArrival = arrivalTime.split(':', 2);

  return `${hoursAndMinutesDeparture[0]}:${hoursAndMinutesDeparture[1]} — ${hoursAndMinutesArrival[0]}:${hoursAndMinutesArrival[1]}`;
};

const humanizeTime = (timeInSeconds: number) => {
  const totalMinutes = timeInSeconds / 60;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.floor(totalMinutes % 60);
  const str = hours > 0 ? `${hours}h ` : '';
  return str + `${minutes} min`;
};

export { formatDate, formatTime, getHoursAndMinutes, humanizeTime };
