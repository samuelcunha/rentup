package com.rentup.app.web.rest;

import static java.util.Objects.nonNull;
import static org.springframework.web.util.UriComponentsBuilder.fromHttpRequest;
import static tech.jhipster.web.util.PaginationUtil.generatePaginationHttpHeaders;

import com.rentup.app.application.rent.RentDTO;
import com.rentup.app.application.rent.RentService;
import com.rentup.app.application.user.UserService;
import com.rentup.app.domain.rent.RentStatus;
import com.rentup.app.security.AuthoritiesConstants;
import com.rentup.app.web.rest.exceptions.BadRequestAlertException;
import java.net.URI;
import java.util.ArrayList;
import javax.validation.Valid;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import tech.jhipster.web.util.HeaderUtil;

@RestController
@RequestMapping("/api/admin")
public class RentResource {

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RentService rentService;
    private final UserService userService;

    public RentResource(RentService rentService, UserService userService) {
        this.rentService = rentService;
        this.userService = userService;
    }

    /**
     * {@code GET  /admin/rents/owner}  : Return all rents by logged User
     * <p>
     * Return all rents by logged User
     *
     * @param request  a {@link ServerHttpRequest} request.
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body all rents.
     */
    @GetMapping("/rents/owner")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public Mono<ResponseEntity<Flux<RentDTO>>> getAllRentsOwner(ServerHttpRequest request, Pageable pageable) {
        return userService
            .getUserWithAuthorities()
            .flatMap(
                user ->
                    rentService
                        .countRentsByUserOwnerId(user.getId())
                        .map(total -> new PageImpl<>(new ArrayList<>(), pageable, total))
                        .map(
                            page ->
                                ResponseEntity
                                    .ok()
                                    .headers(generatePaginationHttpHeaders(fromHttpRequest(request), page))
                                    .body(rentService.getAllRentProcessByOwner(pageable, user.getId()))
                        )
            );
    }

    /**
     * {@code GET  /admin/rents/user}  : Return all rents by logged User
     * <p>
     * Return all rents by logged User
     *
     * @param request  a {@link ServerHttpRequest} request.
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body all rents.
     */
    @GetMapping("/rents/user")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public Mono<ResponseEntity<Flux<RentDTO>>> getAllRentsUser(ServerHttpRequest request, Pageable pageable) {
        return userService
            .getUserWithAuthorities()
            .flatMap(
                user ->
                    rentService
                        .countRentsByUserRentId(user.getId())
                        .map(total -> new PageImpl<>(new ArrayList<>(), pageable, total))
                        .map(
                            page ->
                                ResponseEntity
                                    .ok()
                                    .headers(generatePaginationHttpHeaders(fromHttpRequest(request), page))
                                    .body(rentService.getAllRentProcessByRent(pageable, user.getId()))
                        )
            );
    }

    /**
     * {@code POST  /admin/rents}  : Creates a new rent order.
     * <p>
     * Creates a new rent order
     *
     * @param rentDTO the rent order attributes to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new rent, or with status {@code 400 (Bad Request)} if the user dont exists.
     * @throws BadRequestAlertException {@code 400 (Bad Request)} if the user or product dont exists.
     */
    @PostMapping("/rents")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public Mono<ResponseEntity<RentDTO>> createNewRentOrder(@Valid @RequestBody RentDTO rentDTO) {
        if (nonNull(rentDTO.getId())) {
            throw new BadRequestAlertException("A new rent order cannot already have an ID", "rentOrderManagement", "idexists");
        }
        return userService
            .getUserWithAuthorities()
            .flatMap(
                user ->
                    rentService
                        .createRentOrder(rentDTO, user.getId())
                        .map(
                            rent -> {
                                try {
                                    return ResponseEntity
                                        .created(new URI("/api/admin/rents/" + rent.getId()))
                                        .headers(HeaderUtil.createAlert(applicationName, "rentOrderManagement.created", rent.getId()))
                                        .body(rentService.convertRentToDTO(rent));
                                } catch (Exception exception) {
                                    throw new RuntimeException(exception);
                                }
                            }
                        )
            );
    }

    /**
     * {@code PUT  /admin/rents/{id}}  : Update a rent by id
     * <p>
     * Update a rent by id
     *
     * @param rentDTO the rent status to update.
     * @return the {@link ResponseEntity} with status {@code 200 (Ok)}.
     * @throws BadRequestAlertException {@code 400 (Bad Request)} if the status is invalid
     */
    @PutMapping("/rents/{id}")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public Mono<ResponseEntity<RentDTO>> updateStatus(@PathVariable String id, @Valid @RequestBody RentDTO rentDTO) {
        throwIfStatusOrIdIsInvalid(id, rentDTO.getStatus());

        return rentService
            .getById(id)
            .flatMap(
                rentToUpdate ->
                    rentService
                        .updateStatusRentOrder(rentToUpdate, rentDTO)
                        .map(
                            rent -> {
                                try {
                                    return ResponseEntity
                                        .ok()
                                        .headers(HeaderUtil.createAlert(applicationName, "rentOrderManagement.updated", rent.getId()))
                                        .body(rentService.convertRentToDTO(rent));
                                } catch (Exception exception) {
                                    throw new RuntimeException(exception);
                                }
                            }
                        )
            );
    }

    private void throwIfStatusOrIdIsInvalid(String id, String status) {
        try {
            RentStatus.valueOf(status);
            if (StringUtils.isBlank(id)) {
                throw new Exception("Empty id");
            }
        } catch (Exception exception) {
            throw new BadRequestAlertException("Invalid status or id for rent", "rentOrderManagement", "invalidStatus");
        }
    }
}
