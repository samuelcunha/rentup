package com.rentup.app.web.rest;

import static org.springframework.web.util.UriComponentsBuilder.fromHttpRequest;
import static tech.jhipster.web.util.PaginationUtil.generatePaginationHttpHeaders;

import com.rentup.app.application.product.ProductSearchService;
import com.rentup.app.application.product.model.ProductDTO;
import com.rentup.app.application.user.UserService;
import com.rentup.app.security.AuthoritiesConstants;
import java.util.ArrayList;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/admin")
public class ProductSearchResource {

    private final Logger log = LoggerFactory.getLogger(ProductSearchResource.class);

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserService userService;
    private final ProductSearchService productSearchService;

    public ProductSearchResource(UserService userService, ProductSearchService productSearchService) {
        this.userService = userService;
        this.productSearchService = productSearchService;
    }

    /**
     * {@code GET  /admin/products/search}  : Return products by search
     * <p>
     * Return products by search
     *
     * @param request  a {@link ServerHttpRequest} request.
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body all products by search.
     */
    @GetMapping("/products/search")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public Mono<ResponseEntity<Flux<ProductDTO>>> getProductsAvailableSearch(
        @RequestParam(required = false) String filter,
        ServerHttpRequest request,
        Pageable pageable
    ) {
        log.debug("REST request to get all Products for an user with filter {}", filter);

        return userService
            .getUserWithAuthorities()
            .flatMap(
                user ->
                    productSearchService
                        .countProductsByDiffUserAndFilterAndAvailable(filter, user.getId())
                        .map(total -> new PageImpl<>(new ArrayList<>(), pageable, total))
                        .map(
                            page ->
                                ResponseEntity
                                    .ok()
                                    .headers(generatePaginationHttpHeaders(fromHttpRequest(request), page))
                                    .body(productSearchService.getAllByFilterAndDiffUser(filter, user.getId(), pageable))
                        )
            );
    }
}
