import { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { Formik, ErrorMessage } from 'formik';
import moment from 'moment';
import * as Yup from 'yup';

import { FormData } from '../utils/types';
import AutoCompleteAddress from '../components/AutoComplete';
import Button from '../components/Button';
import DatePickerField from '../components/DatePickerField';

const Search = () => {
  const [startDate, setStartDate] = useState(new Date());

  const formatDate = (date: Date) => {
    return moment(date).format('L');
  };
  const formatTime = (date: Date) => {
    return moment(date).format('HH:mm');
  };

  const initialFormState: FormData = {
    from: {
      coordinates: [0, 0],
      address: '',
    },
    to: {
      coordinates: [0, 0],
      address: '',
    },
    date: new Date(),
  };

  const SignupSchema = Yup.object().shape({
    from: Yup.object().shape({
      address: Yup.string().required('Lägg till ditt slutmål'),
    }),
    to: Yup.object().shape({
      address: Yup.string().required('Lägg till ditt slutmål'),
    }),
    date: Yup.date().nullable().required('Lägg till tidpunkt'),
  });

  function submit(formState: FormData) {
    const formattedState = {
      from: {
        address: formState.from.address,
        coordinates: formState.from.coordinates,
      },
      to: {
        address: formState.to.address,
        coordinates: formState.to.coordinates,
      },
      time: formatTime(formState.date),
      date: formatDate(formState.date),
    };
    return console.log('submitting form', formattedState);
  }

  return (
    <section>
      <h1 className="mx-6 mb-3 text-2xl font-bold text-white">Hej!</h1>
      <h2 className="mx-6 mb-10 text-lg text-white">Hitta din nästa resa</h2>
      <Formik
        initialValues={initialFormState}
        validationSchema={SignupSchema}
        onSubmit={(formState) => {
          submit(formState);
        }}
      >
        {({ handleSubmit }) => (
          <form
            method="get"
            onSubmit={handleSubmit}
            className="mx-6 flex flex-col rounded-md bg-white p-6"
          >
            <label htmlFor="from" className="mb-1 text-xs font-bold">
              Var är du?
            </label>
            <div>
              <AutoCompleteAddress name="from" placeholder="Välj start" />
            </div>
            <span className="mt-2 mr-6 text-xs">
              <ErrorMessage name="from.address" />
            </span>
            <label htmlFor="to" className="mb-1 mt-6 text-xs font-bold">
              Till
            </label>
            <div>
              <AutoCompleteAddress name="to" placeholder="Välj mål" />
            </div>
            <span className="mt-2 mr-6 text-xs">
              <ErrorMessage name="to.address" />
            </span>
            <label
              htmlFor="dateAndTime"
              className="mb-1 mt-6 text-xs font-bold"
            >
              När vill du åka?
            </label>
            <DatePickerField
              name="date"
              startDate={startDate}
              setStartDate={setStartDate}
              placeholderText="Välj tidpunkt"
            />
            <span className="mt-2 mr-6 text-xs">
              <ErrorMessage name="date" />
            </span>
            <Button type="submit" text="Hitta resa" />
          </form>
        )}
      </Formik>
    </section>
  );
};

export default Search;
