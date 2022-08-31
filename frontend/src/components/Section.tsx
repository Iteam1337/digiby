const Section = ({
  details,
  departures,
  children,
}: {
  details?: boolean;
  departures?: boolean;
  children: JSX.Element | JSX.Element[];
}) => {
  if (details) {
    return <section className="h-full w-full bg-pm-black">{children}</section>;
  } else if (departures) {
    return (
      <section className="mx-auto min-h-screen w-full max-w-screen-sm px-6 pt-6">
        {children}
      </section>
    );
  }
  return (
    <section className="mx-auto h-full w-full max-w-screen-sm px-6 pt-6">
      {children}
    </section>
  );
};

export default Section;
