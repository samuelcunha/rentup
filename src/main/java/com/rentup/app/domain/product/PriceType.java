package com.rentup.app.domain.product;

public enum PriceType {
    HOUR("Hourly price"),
    DAY("Price per day"),
    WEEK("Price per week"),
    MONTH("Price per month");

    String description;

    PriceType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
