import { useState, useMemo } from 'react';
import axios from 'axios';
import { Combobox } from '@headlessui/react';
import debounce from 'lodash.debounce';
import { useFormikContext } from 'formik';

import { Address } from '../utils/types';
import PosIcon from './PosIcon';

const getAddress = (
  name: string,
  setSearchAddresses: React.Dispatch<React.SetStateAction<Address[]>>
) => {
  const url = 'https://pelias.iteamdev.io';
  axios.get(`${url}/v1/search?text=${encodeURIComponent(name)}`).then((res) => {
    setSearchAddresses(
      res.data.features.map((address: any) => ({
        coordinates: address.geometry.coordinates,
        address: address.properties.name + ' ' + address.properties.county,
      }))
    );
  });
};

type Props = {
  name: string;
  placeholder: string;
};

const AutoCompleteAddress = ({ name, placeholder }: Props) => {
  const [searchAddresses, setSearchAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address>();
  const { setFieldValue /*, setFieldTouched */ } = useFormikContext();

  const searchWithDebounce = useMemo(
    () => debounce((q) => getAddress(q, setSearchAddresses), 300),
    []
  );

  return (
    <Combobox
      value={selectedAddress?.address}
      onChange={(address) => {
        setSelectedAddress(address as Address | undefined);
        setFieldValue(name, address);
      }}
    >
      <Combobox.Input
        onChange={(event) => {
          if (event.target.value.length === 0) {
            setFieldValue(name, undefined);
            setSelectedAddress(undefined);
          } else {
            searchWithDebounce(event.target.value);
          }
        }}
        /* onBlur={() => {
          setFieldTouched(name, true, true);
        }} */
        placeholder={placeholder}
        name={name}
        className="peer w-full rounded-md bg-pm-grey py-2 pl-8 pr-3 text-xs"
      />
      <PosIcon className="absolute mt-[-23px] ml-[8px] fill-pm-dark-grey  peer-focus:fill-pm-black" />
      <Combobox.Options
        className={' -10 mt-1 max-h-32 overflow-y-scroll rounded-md bg-pm-grey'}
      >
        {searchAddresses &&
          searchAddresses.map((address, i) => (
            <Combobox.Option
              key={i}
              value={address}
              className="py-2 pl-2 text-xs"
            >
              {address.address}
            </Combobox.Option>
          ))}
      </Combobox.Options>
    </Combobox>
  );
};

export default AutoCompleteAddress;
