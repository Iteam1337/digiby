import { useAtom } from 'jotai';

import { departuresAtom } from '../utils/atoms';
import DeparturesCard from '../components/DeparturesCard';

const Departures = () => {
  const [departures] = useAtom(departuresAtom);

  const { loading, data, error } = departures;

  if (loading) {
    return <span>Söker...</span>;
  }

  if (!loading && error) {
    return <span>Försök igen...</span>;
  }

  if (data) {
    console.log(data);
  }

  return (
    <section className=" mx-4 bg-pm-background">
      <h3 className="my-6 text-xl font-bold">Idag</h3>
      {data && <DeparturesCard departure={data[0]} />}
    </section>
  );
};

export default Departures;
