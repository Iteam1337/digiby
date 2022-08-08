const Button = ({
  text,
  type,
}: {
  text: string;
  type: 'button' | 'reset' | 'submit' | undefined;
}) => {
  return (
    <button
      type={type}
      className="mx-auto mt-12 w-full max-w-xs rounded-md bg-pm-black py-3 px-6 text-xs font-bold text-pm-white focus:outline-none focus-visible:ring-2 focus-visible:ring-pm-dark-grey focus-visible:ring-offset-2 focus-visible:ring-offset-pm-white"
    >
      {text}
    </button>
  );
};

export default Button;
