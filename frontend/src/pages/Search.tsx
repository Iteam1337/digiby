import { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { Formik, ErrorMessage } from 'formik';
import moment from 'moment';
import * as Yup from 'yup';

import { FormData } from '../utils/types';
import AutoCompleteAddress from '../components/AutoComplete';
import Button from '../components/Button';
import PosIcon from '../components/PosIcon';
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
    time: formatTime(startDate),
    date: formatDate(startDate),
  };

  const SignupSchema = Yup.object().shape({
    from: Yup.object().shape({
      address: Yup.string().required('Lägg till ditt slutmål'),
      coordinates: Yup.array(),
    }),
    to: Yup.object().shape({
      address: Yup.string().required('Lägg till ditt slutmål'),
      coordinates: Yup.array(),
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
        }}
      >
        {({ handleSubmit, setFieldValue }) => (
          <form
            method="get"
            onSubmit={handleSubmit}
            className="mx-6 flex flex-col  rounded-md bg-white p-6 items-center"
          >
            <label htmlFor="from" className="mb-1 text-xs font-bold">
              Var är du?
            </label>
            <div>
              <AutoCompleteAddress
                setFieldValue={setFieldValue}
                value="from"
                placeholder="Välj start"
              />
              <PosIcon className="absolute mt-[-23px] ml-[8px] fill-pm-dark-grey  peer-focus:fill-pm-black" />
            </div>
            <span className="mt-2 mr-6 text-xs">
              <ErrorMessage name="from" />
            </span>
            <label htmlFor="to" className="mb-1 mt-6 text-xs font-bold">
              Till
            </label>
            <div>
              <AutoCompleteAddress
                setFieldValue={setFieldValue}
                value="to"
                placeholder="Välj mål"
              />
              <PosIcon className="absolute mt-[-23px] ml-[8px] fill-pm-dark-grey  peer-focus:fill-pm-black" />
            </div>
            <span className="mt-2 mr-6 text-xs">
              <ErrorMessage name="to" />
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
