import Section from './Section';

const LoadingCard = () => {
  return (
    <div className="mb-4  flex  w-full justify-between rounded-md bg-pm-white p-4 align-bottom">
      <div>
        <div className=" mb-3 h-6 w-44 animate-pulse rounded-md bg-pm-grey-primary"></div>
        <div className=" mb-8 h-6 w-32 animate-pulse rounded-md bg-pm-grey-primary"></div>
      </div>
      <div className="h-6 w-32 animate-pulse rounded-md bg-pm-grey-primary"></div>
    </div>
  );
};

const Loading = () => {
  return (
    <Section departures>
      <LoadingCard />
      <LoadingCard />
    </Section>
  );
};

export default Loading;
