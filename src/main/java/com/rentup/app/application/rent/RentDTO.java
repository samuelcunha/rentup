package com.rentup.app.application.rent;

import java.util.Date;

public class RentDTO {

    private String id;
    private String productId;
    private String userOwnerId;
    private String userRentId;
    private String priceBase;
    private String priceCurrency;
    private String priceType;
    private String priceTypeDescription;
    private Date initialDate;
    private Date finalDate;
    private String status;
    private String paymentType;

    public RentDTO() {}

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public String getUserOwnerId() {
        return userOwnerId;
    }

    public void setUserOwnerId(String userOwnerId) {
        this.userOwnerId = userOwnerId;
    }

    public String getUserRentId() {
        return userRentId;
    }

    public void setUserRentId(String userRentId) {
        this.userRentId = userRentId;
    }

    public String getPriceBase() {
        return priceBase;
    }

    public void setPriceBase(String priceBase) {
        this.priceBase = priceBase;
    }

    public String getPriceCurrency() {
        return priceCurrency;
    }

    public void setPriceCurrency(String priceCurrency) {
        this.priceCurrency = priceCurrency;
    }

    public String getPriceType() {
        return priceType;
    }

    public void setPriceType(String priceType) {
        this.priceType = priceType;
    }

    public String getPriceTypeDescription() {
        return priceTypeDescription;
    }

    public void setPriceTypeDescription(String priceTypeDescription) {
        this.priceTypeDescription = priceTypeDescription;
    }

    public Date getInitialDate() {
        return initialDate;
    }

    public void setInitialDate(Date initialDate) {
        this.initialDate = initialDate;
    }

    public Date getFinalDate() {
        return finalDate;
    }

    public void setFinalDate(Date finalDate) {
        this.finalDate = finalDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPaymentType() {
        return paymentType;
    }

    public void setPaymentType(String paymentType) {
        this.paymentType = paymentType;
    }

    @Override
    public String toString() {
        return (
            "RentDTO{" +
            "id='" +
            id +
            '\'' +
            ", productId='" +
            productId +
            '\'' +
            ", userOwnerId='" +
            userOwnerId +
            '\'' +
            ", userRentId='" +
            userRentId +
            '\'' +
            ", priceBase='" +
            priceBase +
            '\'' +
            ", priceCurrency='" +
            priceCurrency +
            '\'' +
            ", priceType='" +
            priceType +
            '\'' +
            ", priceTypeDescription='" +
            priceTypeDescription +
            '\'' +
            ", initialDate=" +
            initialDate +
            ", finalDate=" +
            finalDate +
            ", status='" +
            status +
            '\'' +
            ", paymentType='" +
            paymentType +
            '\'' +
            '}'
        );
    }
}
