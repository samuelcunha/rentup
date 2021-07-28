package com.rentup.app.domain.product;

public enum PriceType {
    HOUR("price.description.hour"),
    DAY("price.description.day"),
    WEEK("price.description.week"),
    MONTH("price.description.month");

    String descriptionKey;

    PriceType(String descriptionKey) {
        this.descriptionKey = descriptionKey;
    }

    public String getDescriptionKey() {
        return descriptionKey;
    }
}
