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
      className="mx-auto mt-12 w-full max-w-xs rounded-md bg-pm-black py-3 px-6 text-xs font-bold text-white"
    >
      {text}
    </button>
  );
};

export default Button;
