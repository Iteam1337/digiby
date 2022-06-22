import moment from 'moment';

const formatDate = (date: Date) => {
  return moment(date).format('L');
};

const formatTime = (date: Date) => {
  return moment(date).format('HH:mm');
};

export { formatDate, formatTime };
