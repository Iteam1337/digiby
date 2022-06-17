import { useState } from 'react';
import { Formik } from 'formik';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

import { FormData } from '../utils/types';
import AutoCompleteAddress from '../components/AutoComplete';

const Search = () => {
  const [startDate, setStartDate] = useState(new Date());

  const formatDate = (date: Date) => {
    return moment(date).format('L');
  };
  const formatTime = (date: Date) => {
    return moment(date).format('HH:mm');
  };

  const initialFormState: FormData = {
    from: '',
    to: {
      coordinates: [0, 0],
      address: '',
    },
    time: formatTime(startDate),
    date: formatDate(startDate),
  };

  return (
    <>
      <h1 className="mb-10">Sök resa</h1>
      <Formik
        initialValues={initialFormState}
        onSubmit={(formState) => {
          formState.time = formatTime(startDate);
          formState.date = formatDate(startDate);
          console.log('submitting form', formState);
        }}
      >
        {({ handleSubmit, setFieldValue,  }) => (
          <form
            method="get"
            onSubmit={handleSubmit}
            className="items-left flex w-full max-w-md flex-col gap-10"
          >
            <label htmlFor="from">Från</label>
            <AutoCompleteAddress setFieldValue={setFieldValue} value='from' placeholder='Från' />

            <label htmlFor="to">Till</label>
            <AutoCompleteAddress setFieldValue={setFieldValue} value='to' placeholder='Till' />

            <label htmlFor="dateAndTime">Välj när du vill åka</label>
            <DatePicker
              name="dateAndTime"
              selected={startDate}
              onChange={(date: Date) => setStartDate(date)}
              showTimeSelect
              dateFormat="Pp"
            />
            <button type="submit">Sök</button>
          </form>
        )}
      </Formik>
    </>
  );
};

export default Search;
