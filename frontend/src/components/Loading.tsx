const LoadingCard = () => {
  return (
    <div className="mb-4  flex  w-full justify-between rounded-md bg-pm-white p-4 align-bottom">
      <div>
        <div className=" mb-3 h-6 w-44 animate-pulse rounded-md bg-pm-light-grey"></div>
        <div className=" mb-8 h-6 w-32 animate-pulse rounded-md bg-pm-light-grey"></div>
      </div>
      <div className="h-6 w-32 animate-pulse rounded-md bg-pm-light-grey"></div>
    </div>
  );
};

const Loading = () => {
  return (
    <section className="mx-auto h-full w-full max-w-screen-sm bg-pm-background px-6 pt-6">
      <LoadingCard />
      <LoadingCard />
    </section>
  );
};

export default Loading;
