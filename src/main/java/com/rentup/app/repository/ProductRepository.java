package com.rentup.app.repository;

import com.rentup.app.domain.product.Product;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data MongoDB repository for the {@link Product} entity.
 */
@Repository
public interface ProductRepository extends ReactiveMongoRepository<Product, String> {
    Flux<Product> findAllByIdNotNull(Pageable pageable);
    Flux<Product> findAllByUser(Pageable pageable, String user);
    Flux<Product> findAllByUserNot(Pageable pageable, String user);
    Flux<Product> findAllByUserNotAndNameContains(Pageable pageable, String user, String name);
    Flux<Product> findOneByIdAndUser(String id, String userId);

    Mono<Long> countAllByUser(String user);
    Mono<Long> countAllByUserNot(String user);
    Mono<Long> countAllByUserNotAndNameContains(String user, String name);
}
