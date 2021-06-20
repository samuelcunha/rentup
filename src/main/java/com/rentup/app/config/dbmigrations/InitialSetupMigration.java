package com.rentup.app.config.dbmigrations;

import static com.rentup.app.web.rest.util.DateUtil.DATE_FORMAT;

import com.github.cloudyrock.mongock.ChangeLog;
import com.github.cloudyrock.mongock.ChangeSet;
import com.github.cloudyrock.mongock.driver.mongodb.springdata.v3.decorator.impl.MongockTemplate;
import com.rentup.app.config.Constants;
import com.rentup.app.domain.Address;
import com.rentup.app.domain.Authority;
import com.rentup.app.domain.User;
import com.rentup.app.security.AuthoritiesConstants;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;

/**
 * Creates the initial database setup.
 */
@ChangeLog(order = "001")
public class InitialSetupMigration {

    @ChangeSet(order = "01", author = "initiator", id = "01-addAuthorities")
    public void addAuthorities(MongockTemplate mongoTemplate) {
        Authority adminAuthority = new Authority();
        adminAuthority.setName(AuthoritiesConstants.ADMIN);
        Authority userAuthority = new Authority();
        userAuthority.setName(AuthoritiesConstants.USER);
        mongoTemplate.save(adminAuthority);
        mongoTemplate.save(userAuthority);
    }

    @ChangeSet(order = "02", author = "initiator", id = "02-addUsers")
    public void addUsers(MongockTemplate mongoTemplate) throws ParseException {
        Authority adminAuthority = new Authority();
        adminAuthority.setName(AuthoritiesConstants.ADMIN);
        Authority userAuthority = new Authority();
        userAuthority.setName(AuthoritiesConstants.USER);

        User adminUser = new User();
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

        User userUser = new User();
        userUser.setId("user-2");
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
