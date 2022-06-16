import { useState } from 'react';
import {
  Formik,
  Field,
  ErrorMessage,
  useField,
  useFormikContext,
} from 'formik';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import * as Yup from 'yup';

import Button from '../components/Button';
import TimeIcon from '../components/TimeIcon';
import PosIcon from '../components/PosIcon';

export const DatePickerField = ({
  name,
  startDate,
  setStartDate,
}: {
  name: string;
  startDate: Date;
  setStartDate: (date: Date) => void;
}) => {
  const { setFieldValue, setFieldTouched } = useFormikContext();
  const [field] = useField(name);
  const [open, setOpen] = useState(false);
  return (
    <div>
      <DatePicker
        name={name}
        selected={startDate}
        onChange={(date: Date) => {
          setFieldValue(field.name, date);
          setStartDate(date);
        }}
        onChangeRaw={() => {
          setFieldTouched(field.name, true, true);
        }}
        onFocus={() => setOpen(!open)}
        onBlur={() => setOpen(!open)}
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

const Search = () => {
  const [startDate, setStartDate] = useState(new Date());

  const formatDate = (date: Date) => {
    return moment(date).format('L');
  };
  const formatTime = (date: Date) => {
    return moment(date).format('HH:mm');
  };

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

  const SignupSchema = Yup.object().shape({
    from: Yup.string()
      .min(2, 'För kort')
      .max(70, 'För långt')
      .required('Lägg till din position'),
    to: Yup.string()
      .min(2, 'För kort')
      .max(70, 'För långt')
      .required('Lägg till ditt slutmål'),
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
              <Field
                name="from"
                placeholder="Välj start"
                className="peer rounded-md bg-pm-grey py-2 pl-8 pr-3 text-xs"
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
              <Field
                name="to"
                placeholder="Välj mål"
                className="peer rounded-md bg-pm-grey  py-2 pl-8 pr-3 text-xs"
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
