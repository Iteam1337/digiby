const DragIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      width="60"
      height="5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect width="60" height="5" rx="2.5" />
    </svg>
  );
};

export default DragIcon;
