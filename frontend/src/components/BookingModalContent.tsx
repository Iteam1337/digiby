import { useState } from 'react';

import Button from '../components/Button';

const BookingModalContent = ({
  type,
  from,
  to,
  seats,
  id,
  close,
  handleBooking,
  previouslyBooked,
}: {
  type: string;
  from: string;
  to: string;
  seats: number[];
  id: string;
  close: () => void;
  handleBooking: (id: string, amount?: number) => void;
  previouslyBooked: string | undefined;
}) => {
  const [amount, setAmount] = useState(1);

  const amountControl = (method: string) => {
    if (method === 'add' && amount <= seats[0] - 1) setAmount(amount + 1);
    if (method === 'subtr' && amount >= 2) setAmount(amount - 1);
  };

  if (type === 'Anropsstyrd Buss') {
    return (
      <>
        <h2 className="mb-3 text-xl">Boka anropsstyrd resa</h2>
        <p className="mb-3 text-xs">
          Denna resa efterfrågestyrd och beställs senast 17:00 en dag före
          resdagen.
        </p>
        <p className="mb-3 text-xs">
          Bokning sker via Länstrafikens kundtjänst:{' '}
          <a className="font-bold underline" href="tel:0771-100 110">
            0771-100 110
          </a>
          .
        </p>
        <div className="flex justify-end">
          <div className="mt-6 w-1/2 sm:w-1/4">
            <Button type="button" onClick={close} text="Okej" />
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      {!previouslyBooked ? (
        <>
          <h2 className="mb-3 text-xl">Boka plats i {type.toLowerCase()}</h2>
          <p className="mb-3 text-xs">
            Denna resa betalas direkt i bilen efter genomförd resa.
          </p>
          <p className="text-xs">
            Avgång <b>{from}</b>
          </p>
          <p className="mb-6 text-xs">
            Ändhållplats <b>{to}</b>
          </p>
          <p className="mb-6 text-xs">
            {/* todo: add available amount from api */}
            <b>{seats[0]}</b> av <b>{seats[1]}</b> platser tillgängliga
          </p>
          <div className="flex items-center justify-between space-x-5">
            <p className="text-xs">Boka plats</p>
            <div className="flex items-center rounded-md bg-pm-grey-primary">
              <button
                className="h-10 w-12 text-xl"
                type="button"
                onClick={() => amountControl('subtr')}
              >
                –
              </button>
              <p className="w-6 text-center text-xs font-bold">{amount}</p>
              <button
                className="h-10 w-12 text-xl"
                type="button"
                onClick={() => amountControl('add')}
              >
                +
              </button>
            </div>
          </div>
          <div className="mt-6 flex space-x-5">
            <Button type="button" onClick={close} text="Tillbaka" transparent />
            <Button
              type="button"
              onClick={() => handleBooking(id, amount)}
              text="Boka"
            />{' '}
          </div>
        </>
      ) : (
        <>
          <h2 className="mb-3 text-xl">Klart!</h2>
          <p className="mb-3 text-xs">
            Du har bokat en plats till denna resa. Du betalar direkt i bilen
            efter genomförd resa.
          </p>
          <div className="flex justify-end">
            <div className="mt-6 w-1/2 sm:w-1/4">
              <Button type="button" onClick={close} text="Okej" />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default BookingModalContent;
