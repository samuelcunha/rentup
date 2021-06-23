package com.rentup.app.service.mapper;

import com.rentup.app.domain.user.Address;
import com.rentup.app.service.dto.AddressDTO;

public class AddressMapper {

    public static AddressDTO addressToAddressDTO(Address address) {
        if (address == null) {
            return null;
        } else {
            var addressDTO = new AddressDTO();
            addressDTO.setCountry(address.getCountry());
            addressDTO.setState(address.getState());
            addressDTO.setCity(address.getCity());
            addressDTO.setStreet(address.getStreet());
            addressDTO.setZipCode(address.getZipCode());
            addressDTO.setComplement(address.getComplement());
            addressDTO.setNumber(address.getNumber());
            return addressDTO;
        }
    }

    public static Address addressDTOToAddress(AddressDTO addressDTO) {
        if (addressDTO == null) {
            return null;
        } else {
            var address = new Address();
            address.setCountry(addressDTO.getCountry());
            address.setState(addressDTO.getState());
            address.setCity(addressDTO.getCity());
            address.setStreet(addressDTO.getStreet());
            address.setZipCode(addressDTO.getZipCode());
            address.setNumber(addressDTO.getNumber());
            address.setComplement(addressDTO.getComplement());
            return address;
        }
    }
}
