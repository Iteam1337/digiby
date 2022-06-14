import { useState } from 'react';
import { Formik, Field } from 'formik';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

const Search = () => {
  const [startDate, setStartDate] = useState(new Date);
  
  const formatDate = (date: Date) => {
    return moment(date).format('L')
  }
  const formatTime = (date: Date) => {
    return moment(date).format('HH:mm')
  }

  type FormData = {
    from: string;
    to: string;
    time: string;
    date: string;
  };

  const initialFormState: FormData = {
    from: '',
    to: '',
    time: formatTime(startDate),
    date: formatDate(startDate),
  };

  return (
    <>
      <h1 className="mb-10">Sök resa</h1>
      <Formik
        initialValues={initialFormState}
        onSubmit={(formState) =>{ 
          formState.time = formatTime(startDate)
          formState.date = formatDate(startDate)
          console.log('submitting form', formState)}}
      >
        {({ handleSubmit }) => (
          <form
            method="get"
            onSubmit={handleSubmit}
            className="items-left flex w-full max-w-md flex-col gap-10"
          >
            <label htmlFor="from">Från</label>
            <Field name="from" placeholder="Välj start" />
            <label htmlFor="to">Till</label>
            <Field name="to" placeholder="Välj mål" />

          <label htmlFor='dateAndTime'>Välj när du vill åka</label>
            <DatePicker
              name='dateAndTime'
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
