package com.rentup.app.application.rent;

import static com.rentup.app.application.rent.mapper.RentMapper.*;
import static com.rentup.app.domain.product.ProductStatus.*;

import com.rentup.app.domain.product.Product;
import com.rentup.app.domain.product.ProductStatus;
import com.rentup.app.domain.rent.Rent;
import com.rentup.app.domain.rent.RentStatus;
import com.rentup.app.repository.ProductRepository;
import com.rentup.app.repository.RentRepository;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class RentService {

    private final ProductRepository productRepository;
    private final RentRepository rentRepository;
    private final MessageSource messageSource;

    public RentService(ProductRepository productRepository, RentRepository rentRepository, MessageSource messageSource) {
        this.productRepository = productRepository;
        this.rentRepository = rentRepository;
        this.messageSource = messageSource;
    }

    public Mono<Rent> getById(String id) {
        return rentRepository.findById(id);
    }

    public Flux<RentDTO> getAllRentProcessByOwner(Pageable pageable, String userOwnerId) {
        return rentRepository.findAllByUserOwnerId(pageable, userOwnerId).map(rent -> rentToRentDTO(rent, messageSource));
    }

    public Flux<RentDTO> getAllRentProcessByRent(Pageable pageable, String userRentId) {
        return rentRepository.findAllByUserRentId(pageable, userRentId).map(rent -> rentToRentDTO(rent, messageSource));
    }

    public Mono<Rent> createRentOrder(RentDTO rentDTO, String userRentId) {
        return productRepository
            .findOneByIdAndStatus(rentDTO.getProductId(), AVAILABLE)
            .flatMap(product -> doSaveNewOrder(rentDTO, userRentId, product));
    }

    public Mono<Rent> updateStatusRentOrder(Rent rentToUpdate, RentDTO rentDTO) {
        rentToUpdate.setStatus(RentStatus.valueOf(rentDTO.getStatus()));

        if (rentToUpdate.getStatus().isTerminalStatus()) {
            return productRepository
                .findOneById(rentToUpdate.getProductId())
                .flatMap(product -> doUpdateRentAndProduct(rentToUpdate, product));
        }

        return rentRepository.save(rentToUpdate);
    }

    private Mono<Rent> doUpdateRentAndProduct(Rent rentToUpdate, Product product) {
        return rentRepository.save(rentToUpdate).flatMap(rentSuccessfully -> updateProductStatus(product, rentSuccessfully, AVAILABLE));
    }

    private Mono<Rent> doSaveNewOrder(RentDTO rentDTO, String userRentId, Product product) {
        rentDTO.setStatus(RentStatus.REQUESTED.name());
        var rent = newRentOrderByProduct(rentDTO, product, userRentId);
        return rentRepository.save(rent).flatMap(rentSuccessfully -> updateProductStatus(product, rentSuccessfully, RENTED));
    }

    private Mono<Rent> updateProductStatus(Product product, Rent rentSuccessfully, ProductStatus status) {
        product.setStatus(status);
        return productRepository.save(product).map(productSaved -> rentSuccessfully);
    }

    public Mono<Long> countRentsByUserOwnerId(String userOwnerId) {
        return rentRepository.countAllByUserOwnerId(userOwnerId);
    }

    public Mono<Long> countRentsByUserRentId(String userRentId) {
        return rentRepository.countAllByUserOwnerId(userRentId);
    }

    public RentDTO convertRentToDTO(Rent rent) {
        return rentToRentDTO(rent, messageSource);
    }
}
