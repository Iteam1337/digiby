import { useNavigate } from 'react-router-dom';

import EmptyStates from '../components/EmptyStates';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <EmptyStates
      heading="Något blev fel"
      text="Sidan du letar efter är för närvarande inte tillgänglig."
      buttonText="Tillbaka till startsidan"
      onClick={() => navigate('/')}
    />
  );
};

export default NotFound;
