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
  return (
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
      showTimeSelect
      dateFormat="Pp"
    />
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
      .required('Lägg till start'),
    to: Yup.string()
      .min(2, 'För kort')
      .max(70, 'För långt')
      .required('Lägg till mål'),
    dateAndTime: Yup.date()
      .nullable()
      .required('Lägg till tidpunkt')
      .min(new Date(), 'Tidpunkt kan inte vara tidigare än dagens datum'),
  });

  return (
    <>
      <h1 className="mb-10">Sök resa</h1>
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
            className="items-left flex w-full max-w-md flex-col gap-10"
          >
            <label htmlFor="from">Från</label>
            <Field name="from" placeholder="Välj start" />
            <ErrorMessage name="from" />
            <label htmlFor="to">Till</label>
            <Field name="to" placeholder="Välj mål" />
            <ErrorMessage name="to" />
            <label htmlFor="dateAndTime">Välj när du vill åka</label>
            <DatePickerField
              name="dateAndTime"
              startDate={startDate}
              setStartDate={setStartDate}
            />
            <ErrorMessage name="dateAndTime" />
            <button type="submit">Sök</button>
          </form>
        )}
      </Formik>
    </>
  );
};

export default Search;
