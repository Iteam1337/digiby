import DeparturesCard from '../components/DeparturesCard';

const Departures = () => {
  return (
    <section className=" bg-pm-background mx-4">
      <h3 className='my-6 text-xl font-bold'>Idag</h3>
      <DeparturesCard
        vehicle="Buss 23"
        vehicleInfo="Länstrafiken, stomlinje"
        time="07:32 - 08:45"
        totalTime="1h 17 min"
        cost="153 SEK"
      />
      <DeparturesCard
        vehicle="Buss 23"
        vehicleInfo="Länstrafiken, stomlinje"
        time="07:32 - 08:45"
        totalTime="1h 17 min"
        cost="153 SEK"
      />
    </section>
  );
};

export default Departures;
