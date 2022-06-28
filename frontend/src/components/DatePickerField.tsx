import { useFormikContext } from 'formik';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import TimeIcon from '../icons/TimeIcon';

const DatePickerField = ({
  name,
  startDate,
  setStartDate,
  placeholderText,
}: {
  name: string;
  startDate: Date;
  setStartDate: (date: Date) => void;
  placeholderText: string;
}) => {
  const { setFieldValue /* , setFieldTouched */ } = useFormikContext();
  const [open, setOpen] = useState(false);

  return (
    <div>
      <DatePicker
        name={name}
        selected={startDate}
        placeholderText={placeholderText}
        onCalendarOpen={() => {
          setOpen(true);
        }}
        onCalendarClose={() => setOpen(false)}
        onChange={(date: Date) => {
          setFieldValue(name, date);
          setStartDate(date);
        }}
        /* onChangeRaw={() => {
          setFieldTouched(name, true, true);
        }} */
        showTimeSelect
        dateFormat="Pp"
        className="w-full rounded-md bg-pm-grey py-2 pl-8 pr-3 text-xs"
      />
      <TimeIcon
        className={`absolute mt-[-22px] ml-[8px] ${
          open ? 'fill-pm-black' : 'fill-pm-dark-grey'
        }`}
      />
    </div>
  );
};

export default DatePickerField;
