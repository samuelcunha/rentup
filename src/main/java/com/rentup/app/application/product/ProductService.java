package com.rentup.app.application.product;

import static com.rentup.app.application.product.mapper.ProductMapper.*;

import com.rentup.app.application.product.model.ProductDTO;
import com.rentup.app.config.Constants;
import com.rentup.app.domain.product.Product;
import com.rentup.app.repository.ProductRepository;
import com.rentup.app.security.SecurityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class ProductService {

    private final Logger log = LoggerFactory.getLogger(ProductService.class);

    private final ProductRepository productRepository;
    private final MessageSource messageSource;

    public ProductService(ProductRepository productRepository, MessageSource messageSource) {
        this.productRepository = productRepository;
        this.messageSource = messageSource;
    }

    public Mono<Product> createProduct(ProductDTO productDTO, String userId) {
        var product = productDTOToProduct(productDTO, userId);
        return this.saveProduct(product);
    }

    public Flux<ProductDTO> getAllProductsByUser(Pageable pageable, String userId) {
        return productRepository.findAllByUser(pageable, userId).map(product -> productToProductDTO(product, messageSource));
    }

    public ProductDTO convertProductToDTO(Product product) {
        return productToProductDTO(product, messageSource);
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
