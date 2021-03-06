package com.rentup.app.application.product.mapper;

import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;

import com.rentup.app.application.product.model.ProductDTO;
import com.rentup.app.domain.product.Price;
import com.rentup.app.domain.product.PriceType;
import com.rentup.app.domain.product.Product;
import com.rentup.app.domain.product.ProductStatus;
import java.util.Locale;
import lombok.experimental.UtilityClass;
import org.springframework.context.MessageSource;

@UtilityClass
public class ProductMapper {

    private static final Locale BRAZIL = new Locale("pt", "BR");

    public static ProductDTO productToProductDTO(Product product, MessageSource messageSource) {
        if (isNull(product)) {
            return new ProductDTO();
        } else {
            var productDTO = new ProductDTO();
            productDTO.setId(product.getId());
            productDTO.setCategory(product.getCategory());
            productDTO.setImageUrl(product.getImageUrl());
            productDTO.setDescription(product.getDescription());
            productDTO.setName(product.getName());
            productDTO.setStatus(product.getStatus().name());
            var price = product.getPrice();
            if (nonNull(price)) {
                productDTO.setPriceBase(price.getBase());
                productDTO.setPriceCurrency(price.getCurrency());
                productDTO.setPriceType(price.getType().name());
                productDTO.setPriceTypeDescription(messageSource.getMessage(price.getType().getDescriptionKey(), null, BRAZIL));
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
            product.setStatus(getStatusOrDefaultAvailable(productDTO));
            product.setPrice(
                new Price(productDTO.getPriceBase(), productDTO.getPriceCurrency(), PriceType.valueOf(productDTO.getPriceType()))
            );
            return product;
        }
    }

    private static ProductStatus getStatusOrDefaultAvailable(ProductDTO productDTO) {
        if (isNull(productDTO.getStatus())) {
            return ProductStatus.AVAILABLE;
        }
        return ProductStatus.valueOf(productDTO.getStatus());
    }
}
