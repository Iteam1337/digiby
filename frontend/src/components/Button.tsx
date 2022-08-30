import CheckIcon from '../icons/CheckIcon';

const Button = ({
  text,
  type,
  onClick,
  transparent,
  outline,
  icon,
}: {
  text: string;
  type: 'button' | 'reset' | 'submit' | undefined;
  onClick: () => void;
  transparent?: boolean;
  outline?: boolean;
  icon?: boolean;
}) => {
  if (transparent) {
    return (
      <button
        type={type}
        className="w-full max-w-xs rounded-md bg-transparent py-4 px-6 text-xs font-normal text-pm-black focus:outline-none focus-visible:ring-2 focus-visible:ring-pm-dark-grey focus-visible:ring-offset-2 focus-visible:ring-offset-pm-white"
        onClick={onClick}
      >
        {text}
      </button>
    );
  } else if (outline) {
    return (
      <button
        type={type}
        className="bg-pm-transparent flex w-full max-w-xs justify-around rounded-md border-2 border-pm-black py-4 px-6 text-xs font-bold text-pm-black focus:outline-none focus-visible:ring-2 focus-visible:ring-pm-dark-grey focus-visible:ring-offset-2 focus-visible:ring-offset-pm-white"
        onClick={onClick}
      >
        {text}
        {icon && <CheckIcon className="ml-2 mt-0.5" />}
      </button>
    );
  }
  return (
    <button
      type={type}
      className="w-full max-w-xs rounded-md border-2 border-pm-black bg-pm-black py-4 px-6 text-xs font-bold text-pm-white focus:outline-none focus-visible:ring-2 focus-visible:ring-pm-dark-grey focus-visible:ring-offset-2 focus-visible:ring-offset-pm-white"
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
