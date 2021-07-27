package com.rentup.app.web.rest;

import static com.rentup.app.web.rest.UserResourceFixture.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.rentup.app.IntegrationTest;
import com.rentup.app.TestUtil;
import com.rentup.app.domain.user.User;
import com.rentup.app.repository.UserRepository;
import com.rentup.app.security.AuthoritiesConstants;
import com.rentup.app.service.dto.AdminUserDTO;
import com.rentup.app.web.rest.vm.ManagedUserVM;
import java.text.ParseException;
import java.util.Collections;
import java.util.List;
import java.util.function.Consumer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;

/**
 * Integration tests for the {@link UserResource} REST controller.
 */
@AutoConfigureWebTestClient
@WithMockUser(authorities = AuthoritiesConstants.ADMIN)
@IntegrationTest
class UserResourceIT {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WebTestClient webTestClient;

    private User user;

    @BeforeEach
    public void initTest() throws ParseException {
        user = initTestUser(userRepository);
    }

    @Test
    void shouldCreateUserWhenCallPostUsers() throws Exception {
        int databaseSizeBeforeCreate = userRepository.findAll().collectList().block().size();

        ManagedUserVM managedUserVM = new ManagedUserVM();
        managedUserVM.setLogin(DEFAULT_LOGIN);
        managedUserVM.setPassword(DEFAULT_PASSWORD);
        managedUserVM.setFirstName(DEFAULT_FIRSTNAME);
        managedUserVM.setLastName(DEFAULT_LASTNAME);
        managedUserVM.setEmail(DEFAULT_EMAIL);
        managedUserVM.setBirthDate("2003-06-20");
        managedUserVM.setActivated(true);
        managedUserVM.setImageUrl(DEFAULT_IMAGEURL);
        managedUserVM.setLangKey(DEFAULT_LANGKEY);
        managedUserVM.setAuthorities(Collections.singleton(AuthoritiesConstants.USER));

        webTestClient
            .post()
            .uri("/api/admin/users")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(managedUserVM))
            .exchange()
            .expectStatus()
            .isCreated();

        assertPersistedUsers(
            users -> {
                assertThat(users).hasSize(databaseSizeBeforeCreate + 1);
                User testUser = users.get(users.size() - 1);
                assertThat(testUser.getLogin()).isEqualTo(DEFAULT_LOGIN);
                assertThat(testUser.getFirstName()).isEqualTo(DEFAULT_FIRSTNAME);
                assertThat(testUser.getLastName()).isEqualTo(DEFAULT_LASTNAME);
                assertThat(testUser.getEmail()).isEqualTo(DEFAULT_EMAIL);
                assertThat(testUser.getImageUrl()).isEqualTo(DEFAULT_IMAGEURL);
                assertThat(testUser.getLangKey()).isEqualTo(DEFAULT_LANGKEY);
            }
        );
    }

    @Test
    void shouldReturnBadRequestWhenCreateUserWithExistingLogin() throws Exception {
        userRepository.save(user).block();
        int databaseSizeBeforeCreate = userRepository.findAll().collectList().block().size();

        ManagedUserVM managedUserVM = new ManagedUserVM();
        managedUserVM.setLogin(DEFAULT_LOGIN);
        managedUserVM.setPassword(DEFAULT_PASSWORD);
        managedUserVM.setFirstName(DEFAULT_FIRSTNAME);
        managedUserVM.setLastName(DEFAULT_LASTNAME);
        managedUserVM.setEmail("anothermail@localhost");
        managedUserVM.setActivated(true);
        managedUserVM.setImageUrl(DEFAULT_IMAGEURL);
        managedUserVM.setLangKey(DEFAULT_LANGKEY);
        managedUserVM.setAuthorities(Collections.singleton(AuthoritiesConstants.USER));

        webTestClient
            .post()
            .uri("/api/admin/users")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(managedUserVM))
            .exchange()
            .expectStatus()
            .isBadRequest();

        assertPersistedUsers(users -> assertThat(users).hasSize(databaseSizeBeforeCreate));
    }

    @Test
    void shouldReturnAllUsersAfterSaveWithBlock() {
        userRepository.save(user).block();

        AdminUserDTO foundUser = webTestClient
            .get()
            .uri("/api/admin/users?sort=id,DESC")
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .returnResult(AdminUserDTO.class)
            .getResponseBody()
            .blockFirst();

        assertThat(foundUser).isNotNull();
        assertThat(foundUser.getLogin()).isEqualTo(DEFAULT_LOGIN);
        assertThat(foundUser.getFirstName()).isEqualTo(DEFAULT_FIRSTNAME);
        assertThat(foundUser.getLastName()).isEqualTo(DEFAULT_LASTNAME);
        assertThat(foundUser.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(foundUser.getImageUrl()).isEqualTo(DEFAULT_IMAGEURL);
        assertThat(foundUser.getLangKey()).isEqualTo(DEFAULT_LANGKEY);
    }

    @Test
    void shouldReturnUserAndAssertWithJsonPathAssertions() {
        userRepository.save(user).block();

        webTestClient
            .get()
            .uri("/api/admin/users/{login}", user.getLogin())
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.login")
            .isEqualTo(user.getLogin())
            .jsonPath("$.firstName")
            .isEqualTo(DEFAULT_FIRSTNAME)
            .jsonPath("$.lastName")
            .isEqualTo(DEFAULT_LASTNAME)
            .jsonPath("$.email")
            .isEqualTo(DEFAULT_EMAIL)
            .jsonPath("$.imageUrl")
            .isEqualTo(DEFAULT_IMAGEURL)
            .jsonPath("$.langKey")
            .isEqualTo(DEFAULT_LANGKEY);
    }

    @Test
    void shouldReturnNotFoundWhenUserIsUnknown() {
        webTestClient.get().uri("/api/admin/users/unknown").exchange().expectStatus().isNotFound();
    }

    @Test
    void shouldUpdateUser() throws Exception {
        userRepository.save(user).block();
        int databaseSizeBeforeUpdate = userRepository.findAll().collectList().block().size();

        User updatedUser = userRepository.findById(user.getId()).block();

        ManagedUserVM managedUserVM = new ManagedUserVM();
        managedUserVM.setId(updatedUser.getId());
        managedUserVM.setLogin(updatedUser.getLogin());
        managedUserVM.setPassword(UPDATED_PASSWORD);
        managedUserVM.setFirstName(UPDATED_FIRSTNAME);
        managedUserVM.setLastName(UPDATED_LASTNAME);
        managedUserVM.setEmail(UPDATED_EMAIL);
        managedUserVM.setBirthDate("2003-06-03");
        managedUserVM.setActivated(updatedUser.isActivated());
        managedUserVM.setImageUrl(UPDATED_IMAGEURL);
        managedUserVM.setLangKey(UPDATED_LANGKEY);
        managedUserVM.setCreatedBy(updatedUser.getCreatedBy());
        managedUserVM.setCreatedDate(updatedUser.getCreatedDate());
        managedUserVM.setLastModifiedBy(updatedUser.getLastModifiedBy());
        managedUserVM.setLastModifiedDate(updatedUser.getLastModifiedDate());
        managedUserVM.setAuthorities(Collections.singleton(AuthoritiesConstants.USER));

        webTestClient
            .put()
            .uri("/api/admin/users")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(managedUserVM))
            .exchange()
            .expectStatus()
            .isOk();

        assertPersistedUsers(
            users -> {
                assertThat(users).hasSize(databaseSizeBeforeUpdate);
                User testUser = users.stream().filter(usr -> usr.getId().equals(updatedUser.getId())).findFirst().get();
                assertThat(testUser.getFirstName()).isEqualTo(UPDATED_FIRSTNAME);
                assertThat(testUser.getLastName()).isEqualTo(UPDATED_LASTNAME);
                assertThat(testUser.getEmail()).isEqualTo(UPDATED_EMAIL);
                assertThat(testUser.getImageUrl()).isEqualTo(UPDATED_IMAGEURL);
                assertThat(testUser.getLangKey()).isEqualTo(UPDATED_LANGKEY);
            }
        );
    }

    @Test
    void shouldDeleteUserAndSizeIsDecrement() {
        userRepository.save(user).block();
        int databaseSizeBeforeDelete = userRepository.findAll().collectList().block().size();

        webTestClient
            .delete()
            .uri("/api/admin/users/{login}", user.getLogin())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        assertPersistedUsers(users -> assertThat(users).hasSize(databaseSizeBeforeDelete - 1));
    }

    private void assertPersistedUsers(Consumer<List<User>> userAssertion) {
        userAssertion.accept(userRepository.findAll().collectList().block());
    }
}
