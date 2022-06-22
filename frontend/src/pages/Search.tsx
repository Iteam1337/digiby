import { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useQuery } from 'react-query';

import { FormData } from '../utils/types';
import AutoCompleteAddress from '../components/AutoComplete';
import Button from '../components/Button';
import DatePickerField from '../components/DatePickerField';
import getTransports from '../utils/getTransports';
import { formatDate, formatTime } from '../utils/dateTimeFormatting';

const Search = () => {
  const [startDate, setStartDate] = useState(new Date());

  const initialFormState: FormData = {
    from: {
      coordinates: [0, 0],
      address: '',
    },
    to: {
      coordinates: [0, 0],
      address: '',
    },
    time: formatTime(startDate),
    date: formatDate(startDate),
  };

  const [formData, setFormData] = useState(initialFormState);
  console.log('formData', formData);

  const transportsQuery = useQuery('transports', getTransports);
  // todo: add argument to api call when api accepts this
  // const transportsQuery = useQuery(['transports', formData], () => getTransports(formData));

  const SignupSchema = Yup.object().shape({
    from: Yup.object().shape({
      address: Yup.string()
        .min(2, 'För kort')
        .required('Lägg till ditt slutmål'),
    }),
    to: Yup.object().shape({
      address: Yup.string()
        .min(2, 'För kort')
        .required('Lägg till ditt slutmål'),
    }),
    dateAndTime: Yup.date()
      .nullable()
      .required('Lägg till tidpunkt')
      .min(new Date(), 'Det går inte att välja tidpunkt bakåt i tiden'),
  });

  return (
    <section>
      <h1 className="mx-6 mb-3 text-2xl font-bold text-white">Hej!</h1>
      <h2 className="mx-6 mb-10 text-lg text-white">Hitta din nästa resa</h2>
      <Formik
        initialValues={initialFormState}
        validationSchema={SignupSchema}
        onSubmit={(formState) => {
          formState.time = formatTime(startDate);
          formState.date = formatDate(startDate);
          console.log('submitting form', formState);
          setFormData(formState);
          console.log('transportsQuery', transportsQuery);
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
              name="dateAndTime"
              startDate={startDate}
              setStartDate={setStartDate}
            />
            <span className="mt-2 mr-6 text-xs">
              <ErrorMessage name="dateAndTime" />
            </span>
            <Button type="submit" text="Hitta resa" />
          </form>
        )}
      </Formik>
    </section>
  );
};

export default Search;
