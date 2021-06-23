package com.rentup.app.domain.product;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Price {

    private String base;
    private String currency;
    private PriceType type;

    public Price(String base, String currency, PriceType type) {
        this.base = base;
        this.currency = currency;
        this.type = type;
    }

    public Price() {}

    public String getBase() {
        return base;
    }

    public void setBase(String base) {
        this.base = base;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public PriceType getType() {
        return type;
    }

    public void setType(PriceType type) {
        this.type = type;
    }
}
