import { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate, createSearchParams } from 'react-router-dom';
import { useAtom } from 'jotai';

import { FormData, FormattedState } from '../utils/types';
import AutoCompleteAddress from '../components/AutoComplete';
import Button from '../components/Button';
import DatePickerField from '../components/DatePickerField';
import { formatDate, formatTime } from '../utils/dateTimeFormatting';
import Section from '../components/Section';
import { fromToAtom } from '../utils/atoms';

const Search = () => {
  const [startDate, setStartDate] = useState(new Date());
  const navigate = useNavigate();
  const [fromTo, setFromTo] = useAtom(fromToAtom);

  const { from, to } = fromTo;

  const initialFormState: FormData = {
    from: {
      coordinates: from.coordinates,
      address: from.address,
    },
    to: {
      coordinates: to.coordinates,
      address: to.address,
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
    const formattedState: FormattedState = {
      ...formState,
      time: formatTime(formState.date),
      date: formatDate(formState.date),
    };

    setFromTo({
      from: {
        address: formattedState.from.address,
        coordinates: formattedState.from.coordinates,
      },
      to: {
        address: formattedState.to.address,
        coordinates: formattedState.from.coordinates,
      },
    });

    navigate({
      pathname: 'departures',
      search: `?${createSearchParams({
        fromLng: formattedState.from.coordinates[0].toString(),
        fromLat: formattedState.from.coordinates[1].toString(),
        toLng: formattedState.to.coordinates[0].toString(),
        toLat: formattedState.to.coordinates[1].toString(),
        time: formattedState.time,
        date: formattedState.date,
        fromAddress: formattedState.from.address,
        toAddress: formattedState.to.address,
      })}`,
    });
    return;
  }

  return (
    <Section>
      <h1 className="mb-3 mt-24 text-2xl font-bold text-pm-white">Hej!</h1>
      <h2 className="mb-10 text-lg text-pm-white">Hitta din nästa resa</h2>
      <Formik
        initialValues={initialFormState}
        validationSchema={SignupSchema}
        onSubmit={(formState) => {
          submit(formState);
        }}
      >
        {({ handleSubmit }) => (
          <form
            autoComplete="off"
            method="get"
            onSubmit={handleSubmit}
            className="flex flex-col rounded-md bg-pm-white p-6"
          >
            <label htmlFor="from" className="mb-1 text-xs font-bold">
              Var är du?
            </label>
            <div>
              <AutoCompleteAddress
                name="from"
                placeholder="Välj start"
                previousSearch={fromTo.from}
              />
            </div>
            <span className="mt-2 mr-6 text-xs">
              <ErrorMessage name="from.address" />
            </span>
            <label htmlFor="to" className="mb-1 mt-6 text-xs font-bold">
              Till
            </label>
            <div>
              <AutoCompleteAddress
                name="to"
                placeholder="Välj mål"
                previousSearch={fromTo.to}
              />
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
            <div className="mt-12 flex justify-center">
              <Button type="submit" text="Hitta resa" />
            </div>
          </form>
        )}
      </Formik>
    </Section>
  );
};

export default Search;
