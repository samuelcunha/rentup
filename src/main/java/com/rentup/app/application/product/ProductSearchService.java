package com.rentup.app.application.product;

import static com.rentup.app.application.product.mapper.ProductMapper.productToProductDTO;
import static java.util.Optional.*;

import com.rentup.app.application.product.model.ProductDTO;
import com.rentup.app.domain.product.ProductStatus;
import com.rentup.app.repository.ProductRepository;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class ProductSearchService {

    private final ProductRepository productRepository;
    private final MessageSource messageSource;

    public ProductSearchService(ProductRepository productRepository, MessageSource messageSource) {
        this.productRepository = productRepository;
        this.messageSource = messageSource;
    }

    public Flux<ProductDTO> getAllByFilterAndDiffUser(String filter, String userId, Pageable pageable) {
        return ofNullable(filter)
            .map(validFilter -> getAllWithFilter(validFilter, userId, pageable))
            .orElse(getAllWithoutFilter(userId, pageable));
    }

    public Mono<Long> countProductsByDiffUserAndFilterAndAvailable(String filter, String userId) {
        return ofNullable(filter)
            .map(validFilter -> productRepository.countAllByUserNotAndStatusIsAndNameContains(userId, ProductStatus.AVAILABLE, validFilter))
            .orElse(productRepository.countAllByUserNotAndStatusIs(userId, ProductStatus.AVAILABLE));
    }

    private Flux<ProductDTO> getAllWithFilter(String filter, String userId, Pageable pageable) {
        return productRepository
            .findAllByUserNotAndStatusIsAndNameContains(pageable, userId, ProductStatus.AVAILABLE, filter)
            .map(product -> productToProductDTO(product, messageSource));
    }

    private Flux<ProductDTO> getAllWithoutFilter(String userId, Pageable pageable) {
        return productRepository
            .findAllByUserNotAndStatusIs(pageable, userId, ProductStatus.AVAILABLE)
            .map(product -> productToProductDTO(product, messageSource));
    }
}
