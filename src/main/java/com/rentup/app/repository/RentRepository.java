package com.rentup.app.repository;

import com.rentup.app.domain.rent.Rent;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface RentRepository extends ReactiveMongoRepository<Rent, String> {
    Flux<Rent> findAllByUserOwnerId(Pageable pageable, String userOwnerId);
    Flux<Rent> findAllByUserRentId(Pageable pageable, String userRentId);
    Mono<Rent> findById(String id);

    Mono<Long> countAllByUserOwnerId(String userOwnerId);
    Mono<Long> countAllByUserRentId(String userRentId);
}
