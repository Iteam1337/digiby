import Button from './Button';
import Section from './Section';

const EmptyStates = ({
  heading,
  text,
  buttonText,
  onClick,
}: {
  heading: string;
  text: string;
  buttonText: string;
  onClick: () => void;
}) => {
  return (
    <Section departures>
      <h1 className="mb-3 mt-24 text-center text-2xl font-bold text-pm-black">
        {heading}
      </h1>
      <p className="text-center">{text}</p>
      <div className="text-center">
        <Button text={buttonText} type="button" onClick={onClick} />
      </div>
    </Section>
  );
};

export default EmptyStates;
