package com.rentup.app.service;

import static com.rentup.app.service.mapper.ProductMapper.productToProductDTO;
import static java.util.Optional.*;

import com.rentup.app.repository.ProductRepository;
import com.rentup.app.service.dto.ProductDTO;
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

    public Mono<Long> countProductsByDiffUserAndFilter(String filter, String userId) {
        return ofNullable(filter)
            .map(validFilter -> productRepository.countAllByUserNotAndNameContains(userId, validFilter))
            .orElse(productRepository.countAllByUserNot(userId));
    }

    private Flux<ProductDTO> getAllWithFilter(String filter, String userId, Pageable pageable) {
        return productRepository
            .findAllByUserNotAndNameContains(pageable, userId, filter)
            .map(product -> productToProductDTO(product, messageSource));
    }

    private Flux<ProductDTO> getAllWithoutFilter(String userId, Pageable pageable) {
        return productRepository.findAllByUserNot(pageable, userId).map(product -> productToProductDTO(product, messageSource));
    }
}
