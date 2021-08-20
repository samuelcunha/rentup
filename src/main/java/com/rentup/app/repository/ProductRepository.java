package com.rentup.app.repository;

import com.rentup.app.domain.product.Product;
import com.rentup.app.domain.product.ProductStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface ProductRepository extends ReactiveMongoRepository<Product, String> {
    Flux<Product> findAllByIdNotNull(Pageable pageable);
    Flux<Product> findAllByUser(Pageable pageable, String user);
    Flux<Product> findAllByUserNotAndStatusIs(Pageable pageable, String user, ProductStatus status);
    Flux<Product> findAllByUserNotAndStatusIsAndNameContains(Pageable pageable, String user, ProductStatus status, String name);
    Mono<Product> findOneByIdAndUser(String id, String userId);
    Mono<Product> findOneByIdAndStatus(String id, ProductStatus status);

    Mono<Long> countAllByUser(String user);
    Mono<Long> countAllByUserNotAndStatusIs(String user, ProductStatus status);
    Mono<Long> countAllByUserNotAndStatusIsAndNameContains(String user, ProductStatus status, String name);
}
