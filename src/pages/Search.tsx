import { Formik, Field } from 'formik';

const Search = () => {
  type initialFormState = {
    from: string;
    to: string;
    time: string;
    date: string;
  };

  const initialFormState: initialFormState = {
    from: '',
    to: '',
    time: '',
    date: '',
  };

  const handleSubmit = () => {
    console.log('submitting form');
  };

  return (
    <>
      <h1 className="mb-10">Sök resa</h1>
      <Formik initialValues={initialFormState} onSubmit={handleSubmit}>
        <div className="items-left flex w-full max-w-md flex-col gap-10">
          <label htmlFor="from">Från</label>
          <Field name="from" placeholder="Välj start" />
          <label htmlFor="to">Till</label>
          <Field name="to" placeholder="Välj mål" />
          <label htmlFor="date">Datum</label>
          <Field type="date" name="date" />
          <label htmlFor="time">Time</label>
          <Field type="time" />
          <button type="submit">Sök</button>
        </div>
      </Formik>
    </>
  );
};

export default Search;
