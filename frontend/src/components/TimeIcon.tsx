const TimeIcon = ({ className }: { className: string }) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M8.265 16C3.994 16 .532 12.419.532 8c0-4.419 3.462-8 7.733-8 4.27 0 7.732 3.581 7.732 8 0 4.419-3.461 8-7.732 8ZM7.54 8c0 .25.12.484.323.597l2.9 2a.652.652 0 0 0 .978-.181.74.74 0 0 0-.175-1.041L8.99 7.6V3.75A.742.742 0 0 0 8.238 3c-.375 0-.725.334-.725.75L7.54 8Z" />
    </svg>
  );
};

export default TimeIcon;
