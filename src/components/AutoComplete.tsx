import { useState, useMemo } from 'react';
import axios from 'axios';
import { Combobox } from '@headlessui/react';
import debounce from 'lodash.debounce';

import { Address } from '../utils/types';

const getAddress = (
  value: string,
  setSearchAddresses: React.Dispatch<React.SetStateAction<Address[]>>
) => {
  const url = 'https://pelias.iteamdev.io';
  axios
    .get(`${url}/v1/search?text=${encodeURIComponent(value)}`)
    .then((res) => {
      setSearchAddresses(
        res.data.features.map((address: any) => ({
          coordinates: address.geometry.coordinates,
          address: address.properties.name + ' ' + address.properties.county,
        }))
      );
    });
};

type Props = {
  setFieldValue: (arg0: any, arg1: string | undefined) => void;
  value: string;
  placeholder: string;
};

const AutoCompleteAddress = ({ setFieldValue, value, placeholder }: Props) => {
  const [serachAddresses, setSearchAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address>();

  const searchWithDebounce = useMemo(
    () => debounce((q) => getAddress(q, setSearchAddresses), 300),
    []
  );

  return (
    <Combobox
      value={selectedAddress?.address}
      onChange={(address) => {
        setSelectedAddress(address);
        setFieldValue(value, address);
      }}
    >
      <Combobox.Input
        onChange={(event) => {
          if (event.target.value.length === 0) {
            setFieldValue(value, '');
            setSelectedAddress(undefined);
          } else {
            searchWithDebounce(event.target.value);
          }
        }}
        placeholder={placeholder}
      />
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
