package com.rentup.app.application.rent.mapper;

import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;

import com.rentup.app.application.rent.RentDTO;
import com.rentup.app.domain.product.Price;
import com.rentup.app.domain.product.PriceType;
import com.rentup.app.domain.product.Product;
import com.rentup.app.domain.rent.Rent;
import com.rentup.app.domain.rent.RentStatus;
import java.util.Locale;
import lombok.experimental.UtilityClass;
import org.springframework.context.MessageSource;

@UtilityClass
public class RentMapper {

    private static final Locale BRAZIL = new Locale("pt", "BR");

    public static RentDTO rentToRentDTO(Rent rent, MessageSource messageSource) {
        if (isNull(rent)) {
            return new RentDTO();
        } else {
            var rentDTO = new RentDTO();
            rentDTO.setId(rent.getId());
            rentDTO.setProductId(rent.getProductId());
            rentDTO.setUserOwnerId(rent.getUserOwnerId());
            rentDTO.setUserRentId(rent.getUserRentId());
            rentDTO.setInitialDate(rent.getInitialDate());
            rentDTO.setFinalDate(rent.getFinalDate());
            rentDTO.setStatus(rent.getStatus().name());
            rentDTO.setPaymentType(rent.getPaymentType());
            setPriceByEnum(rent, messageSource, rentDTO);
            return rentDTO;
        }
    }

    public static RentDTO rentToRentDTOWithProduct(Rent rent, Product product, MessageSource messageSource) {
        if (isNull(rent)) {
            return new RentDTO();
        } else {
            var rentDTO = new RentDTO();
            rentDTO.setId(rent.getId());
            rentDTO.setProductId(rent.getProductId());
            rentDTO.setProductName(product.getName());
            rentDTO.setProductImageUrl(product.getImageUrl());
            rentDTO.setUserOwnerId(rent.getUserOwnerId());
            rentDTO.setUserRentId(rent.getUserRentId());
            rentDTO.setInitialDate(rent.getInitialDate());
            rentDTO.setFinalDate(rent.getFinalDate());
            rentDTO.setStatus(rent.getStatus().name());
            rentDTO.setPaymentType(rent.getPaymentType());
            setPriceByEnum(rent, messageSource, rentDTO);
            return rentDTO;
        }
    }

    public static Rent newRentOrderByProduct(RentDTO rentDTO, Product product, String userRentId) {
        var rent = new Rent();
        rent.setProductId(product.getId());
        rent.setUserOwnerId(product.getUser());
        rent.setUserRentId(userRentId);
        rent.setInitialDate(rentDTO.getInitialDate());
        rent.setFinalDate(rentDTO.getFinalDate());
        rent.setStatus(RentStatus.REQUESTED);
        rent.setPaymentType(rentDTO.getPaymentType());
        rent.setPrice(product.getPrice());
        return rent;
    }

    public static Rent rentDTOToRent(RentDTO rentDTO) {
        var rent = new Rent();
        rent.setProductId(rentDTO.getProductId());
        rent.setUserOwnerId(rentDTO.getUserOwnerId());
        rent.setUserRentId(rentDTO.getUserRentId());
        rent.setInitialDate(rentDTO.getInitialDate());
        rent.setFinalDate(rentDTO.getFinalDate());
        rent.setStatus(RentStatus.valueOf(rentDTO.getStatus()));
        rent.setPaymentType(rentDTO.getPaymentType());
        rent.setPrice(new Price(rentDTO.getPriceBase(), rentDTO.getPriceCurrency(), PriceType.valueOf(rentDTO.getPriceType())));
        return rent;
    }

    private static void setPriceByEnum(Rent rent, MessageSource messageSource, RentDTO rentDTO) {
        var price = rent.getPrice();
        if (nonNull(price)) {
            rentDTO.setPriceBase(price.getBase());
            rentDTO.setPriceCurrency(price.getCurrency());
            rentDTO.setPriceType(price.getType().name());
            rentDTO.setPriceTypeDescription(messageSource.getMessage(price.getType().getDescriptionKey(), null, BRAZIL));
        }
    }
}
