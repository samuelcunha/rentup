package com.rentup.app.service.dto;

import java.io.Serializable;

public class ProductDTO implements Serializable {

    private static final long serialVersionUID = -6216615539176660452L;

    private String id;
    private String name;
    private String category;
    private String priceBase;
    private String priceCurrency;
    private String priceType;
    private String priceTypeDescription;
    private String imageUrl;
    private String description;

    public ProductDTO(
        String id,
        String name,
        String category,
        String priceBase,
        String priceCurrency,
        String priceType,
        String priceTypeDescription,
        String imageUrl,
        String description
    ) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.priceBase = priceBase;
        this.priceCurrency = priceCurrency;
        this.priceType = priceType;
        this.priceTypeDescription = priceTypeDescription;
        this.imageUrl = imageUrl;
        this.description = description;
    }

    public ProductDTO() {}

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
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

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
