type DepaturesInfo = {
  vehicle: string;
  vehicleInfo: string;
  time: string;
  totalTime: string;
  cost: string;
};

const DeparturesCard = ({
  vehicle,
  vehicleInfo,
  time,
  totalTime,
  cost,
}: DepaturesInfo) => {
  return (
    <div className="mb-4 rounded-md bg-pm-white p-4">
      <div className="flex justify-between">
        <p className="font-bold">{vehicle}</p>
        <p>{time}</p>
      </div>
      <div className="flex justify-between pb-6">
        <p className="text-xs">{vehicleInfo}</p>
        <p className="text-xs">{totalTime}</p>
      </div>
      <div className="flex justify-end">
      <p className="font-bold">{cost}</p>
      </div>
    </div>
  );
};

export default DeparturesCard;
