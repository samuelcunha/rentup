package com.rentup.app.service.mapper;

import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;

import com.rentup.app.domain.product.Price;
import com.rentup.app.domain.product.PriceType;
import com.rentup.app.domain.product.Product;
import com.rentup.app.service.dto.ProductDTO;

public class ProductMapper {

    public static ProductDTO productToProductDTO(Product product) {
        if (isNull(product)) {
            return new ProductDTO();
        } else {
            var productDTO = new ProductDTO();
            productDTO.setId(product.getId());
            productDTO.setCategory(product.getCategory());
            productDTO.setImageUrl(product.getImageUrl());
            productDTO.setDescription(product.getDescription());
            productDTO.setName(product.getName());
            var price = product.getPrice();
            if (nonNull(price)) {
                productDTO.setPriceBase(price.getBase());
                productDTO.setPriceCurrency(price.getCurrency());
                productDTO.setPriceType(price.getType().getDescription());
            }
            return productDTO;
        }
    }

    public static Product productDTOToProduct(ProductDTO productDTO, String userId) {
        if (isNull(productDTO)) {
            return null;
        } else {
            var product = new Product();
            product.setUser(userId);
            product.setCategory(productDTO.getCategory());
            product.setImageUrl(productDTO.getImageUrl());
            product.setDescription(productDTO.getDescription());
            product.setName(productDTO.getName());
            product.setPrice(
                new Price(productDTO.getPriceBase(), productDTO.getPriceCurrency(), PriceType.valueOf(productDTO.getPriceType()))
            );
            return product;
        }
    }
}
