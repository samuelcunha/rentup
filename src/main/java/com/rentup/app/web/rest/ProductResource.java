package com.rentup.app.web.rest;

import static org.springframework.web.util.UriComponentsBuilder.fromHttpRequest;
import static tech.jhipster.web.util.PaginationUtil.generatePaginationHttpHeaders;

import com.rentup.app.application.product.ProductService;
import com.rentup.app.application.product.model.ProductDTO;
import com.rentup.app.application.user.UserService;
import com.rentup.app.security.AuthoritiesConstants;
import com.rentup.app.web.rest.exceptions.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import tech.jhipster.web.util.HeaderUtil;

@RestController
@RequestMapping("/api/admin")
public class ProductResource {

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProductService productService;
    private final UserService userService;

    public ProductResource(ProductService productService, UserService userService) {
        this.productService = productService;
        this.userService = userService;
    }

    /**
     * {@code POST  /admin/products}  : Creates a new product.
     * <p>
     * Creates a new product
     *
     * @param productDTO the product attributes to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new product, or with status {@code 400 (Bad Request)} if the user dont exists.
     * @throws BadRequestAlertException {@code 400 (Bad Request)} if the user dont exists.
     */
    @PostMapping("/products")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public Mono<ResponseEntity<ProductDTO>> createProduct(@Valid @RequestBody ProductDTO productDTO) {
        if (productDTO.getId() != null) {
            throw new BadRequestAlertException("A new product cannot already have an ID", "productManagement", "idexists");
        }
        return userService
            .getUserWithAuthorities()
            .flatMap(
                user ->
                    productService
                        .createProduct(productDTO, user.getId())
                        .map(
                            product -> {
                                try {
                                    return ResponseEntity
                                        .created(new URI("/api/admin/products/" + product.getId()))
                                        .headers(HeaderUtil.createAlert(applicationName, "productManagement.created", product.getId()))
                                        .body(productService.convertProductToDTO(product));
                                } catch (URISyntaxException e) {
                                    throw new RuntimeException(e);
                                }
                            }
                        )
            );
    }

    /**
     * {@code GET  /admin/products}  : Return all products by logged User
     * <p>
     * Return all products by logged User
     *
     * @param request  a {@link ServerHttpRequest} request.
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body all products.
     */
    @GetMapping("/products")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public Mono<ResponseEntity<Flux<ProductDTO>>> getAllProducts(ServerHttpRequest request, Pageable pageable) {
        return userService
            .getUserWithAuthorities()
            .flatMap(
                user ->
                    productService
                        .countProductsByUser(user.getId())
                        .map(total -> new PageImpl<>(new ArrayList<>(), pageable, total))
                        .map(
                            page ->
                                ResponseEntity
                                    .ok()
                                    .headers(generatePaginationHttpHeaders(fromHttpRequest(request), page))
                                    .body(productService.getAllProductsByUser(pageable, user.getId()))
                        )
            );
    }

    /**
     * {@code DELETE /admin/products/:id} : delete the "id" product.
     *
     * @param id of the product to delete
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/products/{id}")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public Mono<ResponseEntity<Void>> deleteProduct(@PathVariable String id) {
        return userService
            .getUserWithAuthorities()
            .flatMap(
                user ->
                    productService
                        .deleteProduct(id, user.getId())
                        .map(
                            it ->
                                ResponseEntity
                                    .noContent()
                                    .headers(HeaderUtil.createAlert(applicationName, "userManagement.deleted", id))
                                    .build()
                        )
            );
    }
}
