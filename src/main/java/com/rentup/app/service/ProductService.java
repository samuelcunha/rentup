package com.rentup.app.service;

import com.rentup.app.config.Constants;
import com.rentup.app.domain.product.Product;
import com.rentup.app.repository.ProductRepository;
import com.rentup.app.security.SecurityUtils;
import com.rentup.app.service.dto.ProductDTO;
import com.rentup.app.service.mapper.ProductMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class ProductService {

    private final Logger log = LoggerFactory.getLogger(ProductService.class);

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    private final ProductRepository productRepository;

    public Mono<Product> createProduct(ProductDTO productDTO, String userId) {
        var product = ProductMapper.productDTOToProduct(productDTO, userId);
        return this.saveProduct(product);
    }

    public Flux<ProductDTO> getAllProductsByUser(Pageable pageable, String userId) {
        return productRepository.findAllByUser(pageable, userId).map(ProductMapper::productToProductDTO);
    }

    public Mono<Long> countProductsByUser(String userId) {
        return productRepository.countAllByUser(userId);
    }

    public Mono<Void> deleteProduct(String id, String userId) {
        return productRepository
            .findOneByIdAndUser(id, userId)
            .flatMap(product -> productRepository.delete(product).thenReturn(product))
            .doOnNext(product -> log.debug("Deleted product: {}", product))
            .then();
    }

    private Mono<Product> saveProduct(Product product) {
        return SecurityUtils
            .getCurrentUserLogin()
            .switchIfEmpty(Mono.just(Constants.SYSTEM))
            .flatMap(
                login -> {
                    if (product.getCreatedBy() == null) {
                        product.setCreatedBy(login);
                    }
                    product.setLastModifiedBy(login);
                    return productRepository.save(product);
                }
            );
    }
}
