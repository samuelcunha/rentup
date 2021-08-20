package com.rentup.app.config.dbmigrations;

import static com.rentup.app.domain.util.DateUtil.DATE_FORMAT;

import com.github.cloudyrock.mongock.ChangeLog;
import com.github.cloudyrock.mongock.ChangeSet;
import com.github.cloudyrock.mongock.driver.mongodb.springdata.v3.decorator.impl.MongockTemplate;
import com.rentup.app.config.Constants;
import com.rentup.app.domain.Authority;
import com.rentup.app.domain.product.Price;
import com.rentup.app.domain.product.PriceType;
import com.rentup.app.domain.product.Product;
import com.rentup.app.domain.product.ProductStatus;
import com.rentup.app.domain.rent.Rent;
import com.rentup.app.domain.rent.RentStatus;
import com.rentup.app.domain.user.Address;
import com.rentup.app.domain.user.User;
import com.rentup.app.security.AuthoritiesConstants;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.UUID;

@ChangeLog(order = "001")
public class InitialSetupMigration {

    private static final String ID_PRODUCT_1 = UUID.randomUUID().toString();
    private static final String ID_PRODUCT_2 = UUID.randomUUID().toString();
    private static final String ID_PRODUCT_3 = UUID.randomUUID().toString();

    @ChangeSet(order = "01", author = "initiator", id = "01-addAuthorities")
    public void addAuthorities(MongockTemplate mongoTemplate) {
        var adminAuthority = new Authority();
        adminAuthority.setName(AuthoritiesConstants.ADMIN);
        var userAuthority = new Authority();
        userAuthority.setName(AuthoritiesConstants.USER);
        mongoTemplate.save(adminAuthority);
        mongoTemplate.save(userAuthority);
    }

    @ChangeSet(order = "02", author = "initiator", id = "02-addUsers")
    public void addUsers(MongockTemplate mongoTemplate) throws ParseException {
        var adminAuthority = new Authority();
        adminAuthority.setName(AuthoritiesConstants.ADMIN);
        var userAuthority = new Authority();
        userAuthority.setName(AuthoritiesConstants.USER);

        var adminUser = new User();
        adminUser.setId("user-1");
        adminUser.setLogin("admin");
        adminUser.setPassword("$2a$10$gSAhZrxMllrbgj/kkK9UceBPpChGWJA7SYIb1Mqo.n5aNLq1/oRrC");
        adminUser.setFirstName("admin");
        adminUser.setLastName("Administrator");
        adminUser.setEmail("admin@localhost");
        adminUser.setActivated(true);
        adminUser.setLangKey("pt-br");
        adminUser.setCreatedBy(Constants.SYSTEM);
        adminUser.setCreatedDate(Instant.now());
        adminUser.getAuthorities().add(adminAuthority);
        adminUser.getAuthorities().add(userAuthority);
        adminUser.setAddress(getAddress());
        adminUser.setBirthDate(new SimpleDateFormat(DATE_FORMAT).parse("2003-06-20"));
        mongoTemplate.save(adminUser);

        var adminUser2 = new User();
        adminUser2.setId("user-2");
        adminUser2.setLogin("admin2");
        adminUser2.setPassword("$2a$10$gSAhZrxMllrbgj/kkK9UceBPpChGWJA7SYIb1Mqo.n5aNLq1/oRrC");
        adminUser2.setFirstName("admin");
        adminUser2.setLastName("Administrator");
        adminUser2.setEmail("admin2@localhost");
        adminUser2.setActivated(true);
        adminUser2.setLangKey("pt-br");
        adminUser2.setCreatedBy(Constants.SYSTEM);
        adminUser2.setCreatedDate(Instant.now());
        adminUser2.getAuthorities().add(adminAuthority);
        adminUser2.getAuthorities().add(userAuthority);
        adminUser2.setAddress(getAddress());
        adminUser2.setBirthDate(new SimpleDateFormat(DATE_FORMAT).parse("2003-06-20"));
        mongoTemplate.save(adminUser2);

        var userUser = new User();
        userUser.setId("user-3");
        userUser.setLogin("user");
        userUser.setPassword("$2a$10$VEjxo0jq2YG9Rbk2HmX9S.k1uZBGYUHdUcid3g/vfiEl7lwWgOH/K");
        userUser.setFirstName("");
        userUser.setLastName("User");
        userUser.setEmail("user@localhost");
        userUser.setActivated(true);
        userUser.setLangKey("pt-br");
        userUser.setCreatedBy(Constants.SYSTEM);
        userUser.setCreatedDate(Instant.now());
        userUser.getAuthorities().add(userAuthority);
        userUser.setAddress(getAddress());
        userUser.setBirthDate(new SimpleDateFormat(DATE_FORMAT).parse("2003-06-20"));
        mongoTemplate.save(userUser);
    }

    @ChangeSet(order = "04", author = "initiator", id = "04-addProducts")
    public void addProducts(MongockTemplate mongoTemplate) {
        var product1 = new Product();
        product1.setId(ID_PRODUCT_1);
        product1.setUser("user-1");
        product1.setName("Controle DualSense - Branco PS5");
        product1.setCategory("Videogame");
        product1.setPrice(new Price("300", "BRL", PriceType.HOUR));
        product1.setStatus(ProductStatus.AVAILABLE);
        product1.setImageUrl(
            "https://gmedia.playstation.com/is/image/SIEPDC/co-op-games-duslsense-controllers-image-block-02-en-28jan21?$1600px--t$"
        );
        product1.setDescription("Controle em perfeito estado de funcionamento, apenas com 3 meses de uso.");
        mongoTemplate.save(product1);

        var product2 = new Product();
        product2.setId(ID_PRODUCT_2);
        product2.setUser("user-1");
        product2.setName("Kit Faqueiro Tramontina");
        product2.setCategory("Cozinha");
        product2.setStatus(ProductStatus.AVAILABLE);
        product2.setPrice(new Price("1500", "BRL", PriceType.WEEK));
        product2.setDescription("Kit com 10 peças de facas praticamente novas.");
        mongoTemplate.save(product2);

        var product3 = new Product();
        product3.setId(ID_PRODUCT_3);
        product3.setUser("user-2");
        product3.setName("Kit Faqueiro Tramontina do Outro Usuario");
        product3.setCategory("Cozinha");
        product3.setStatus(ProductStatus.AVAILABLE);
        product3.setPrice(new Price("500", "BRL", PriceType.WEEK));
        product3.setDescription("Kit com 20 peças de facas praticamente novas.");
        mongoTemplate.save(product3);
    }

    @ChangeSet(order = "05", author = "initiator", id = "05-addRents")
    public void addRents(MongockTemplate mongoTemplate) {
        var rent = new Rent();
        var initialDate = new Date();
        var finalDate = Date.from(
            LocalDateTime.from(initialDate.toInstant().atZone(ZoneId.of("UTC"))).plusDays(1).atZone(ZoneId.of("UTC")).toInstant()
        );

        rent.setId(UUID.randomUUID().toString());
        rent.setProductId(ID_PRODUCT_1);
        rent.setUserOwnerId("user-1");
        rent.setUserRentId("user-2");
        rent.setInitialDate(initialDate);
        rent.setFinalDate(finalDate);
        rent.setPrice(new Price("500", "BRL", PriceType.DAY));
        rent.setStatus(RentStatus.REQUESTED);
        rent.setPaymentType("Credit Card");
        mongoTemplate.save(rent);
    }

    private Address getAddress() {
        var address = new Address();
        address.setCountry("Brazil");
        address.setState("MG");
        address.setCity("Belo Horizonte");
        address.setStreet("Rua Jesus");
        address.setZipCode("31270200");
        address.setComplement("Bloco 1 Apto 102");
        address.setNumber("202C");
        return address;
    }
}
