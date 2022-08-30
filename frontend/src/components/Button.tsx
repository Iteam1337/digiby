const Button = ({
  text,
  type,
  onClick,
  transparent,
  outline,
}: {
  text: string;
  type: 'button' | 'reset' | 'submit' | undefined;
  onClick: () => void;
  transparent?: boolean;
  outline?: boolean;
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
        className="bg-pm-transparent w-full max-w-xs rounded-md border-2 border-pm-black py-4 px-6 text-xs font-bold text-pm-black focus:outline-none focus-visible:ring-2 focus-visible:ring-pm-dark-grey focus-visible:ring-offset-2 focus-visible:ring-offset-pm-white"
        onClick={onClick}
      >
        {text}
      </button>
    );
  }
  return (
    <button
      type={type}
      className="w-full max-w-xs rounded-md bg-pm-black py-4 px-6 text-xs font-bold text-pm-white focus:outline-none focus-visible:ring-2 focus-visible:ring-pm-dark-grey focus-visible:ring-offset-2 focus-visible:ring-offset-pm-white"
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
