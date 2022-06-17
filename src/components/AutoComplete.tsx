import { useState } from 'react';
import axios from 'axios';
import { Combobox } from '@headlessui/react';

import { Address } from '../utils/types';

type Props = {
  setFieldValue: (arg0: any, arg1: string | undefined) => void
  value: string
  placeholder: string
};

const AutoCompleteAddress = ({setFieldValue, value, placeholder}: Props) => {
  const [serachAddresses, setSearchAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address>();

  const getAddress = (value: string) => {
    if (value.length > 1) {
      const url = 'https://pelias.iteamdev.io';
      axios
        .get(`${url}/v1/search?text=${encodeURIComponent(value)}`)
        .then((res) => {
          setSearchAddresses(
            res.data.features.map((address: any) => ({
              coordinates: address.geometry.coordinates,
              address:
                address.properties.name + ' ' + address.properties.county,
            }))
          );
        });
    }
  };

  return (
    <Combobox
      value={selectedAddress?.address}
      onChange={(address) => {
        setSelectedAddress(address);
        setFieldValue(value, address);
      }}
    >
      <Combobox.Input onChange={(event) => getAddress(event.target.value)} placeholder={placeholder} />
      <Combobox.Options>
        {serachAddresses &&
          serachAddresses.map((address, i) => (
            <Combobox.Option key={i} value={address}>
              {address.address}
            </Combobox.Option>
          ))}
      </Combobox.Options>
    </Combobox>
  );
};

export default AutoCompleteAddress;
