package com.rentup.app.web.rest;

import static com.rentup.app.domain.util.DateUtil.DATE_FORMAT;

import com.rentup.app.domain.user.User;
import com.rentup.app.repository.UserRepository;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import lombok.experimental.UtilityClass;
import org.apache.commons.lang3.RandomStringUtils;

@UtilityClass
public class UserResourceFixture {

    public static final String DEFAULT_LOGIN = "admin";
    public static final String UPDATED_LOGIN = "new-admin";
    public static final String DEFAULT_ID = "id1";
    public static final String DEFAULT_PASSWORD = "admin-pwd";
    public static final String UPDATED_PASSWORD = "new-admin-pwd";
    public static final String DEFAULT_EMAIL = "admin@localhost";
    public static final String UPDATED_EMAIL = "new-admin@localhost";
    public static final String DEFAULT_FIRSTNAME = "Jesus";
    public static final String UPDATED_FIRSTNAME = "New Jesus";
    public static final String DEFAULT_LASTNAME = "Cunha";
    public static final String UPDATED_LASTNAME = "New Cunha";
    public static final String DEFAULT_IMAGEURL = "http://placehold.it/50x50";
    public static final String UPDATED_IMAGEURL = "http://placehold.it/40x40";
    public static final String DEFAULT_LANGKEY = "en";
    public static final String UPDATED_LANGKEY = "pt";

    public static User createEntity() throws ParseException {
        User user = new User();
        user.setLogin(DEFAULT_LOGIN);
        user.setPassword(RandomStringUtils.random(60));
        user.setActivated(true);
        user.setEmail(DEFAULT_EMAIL);
        user.setBirthDate(new SimpleDateFormat(DATE_FORMAT).parse("2003-06-20"));
        user.setFirstName(DEFAULT_FIRSTNAME);
        user.setLastName(DEFAULT_LASTNAME);
        user.setImageUrl(DEFAULT_IMAGEURL);
        user.setLangKey(DEFAULT_LANGKEY);
        return user;
    }

    public static User initTestUser(UserRepository userRepository) throws ParseException {
        userRepository.deleteAll().block();
        return createEntity();
    }
}
