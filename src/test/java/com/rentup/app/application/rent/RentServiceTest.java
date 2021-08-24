package com.rentup.app.application.rent;

import static com.rentup.app.domain.rent.RentStatus.CONFIRMED;
import static com.rentup.app.domain.rent.RentStatus.FINISHED;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.rentup.app.domain.product.Price;
import com.rentup.app.domain.product.PriceType;
import com.rentup.app.domain.product.Product;
import com.rentup.app.domain.product.ProductStatus;
import com.rentup.app.domain.rent.Rent;
import com.rentup.app.domain.rent.RentStatus;
import com.rentup.app.repository.ProductRepository;
import com.rentup.app.repository.RentRepository;
import java.util.Locale;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.MessageSource;
import reactor.core.publisher.Mono;

@ExtendWith(MockitoExtension.class)
class RentServiceTest {

    private RentService rentService;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private RentRepository rentRepository;

    @Mock
    private MessageSource messageSource;

    @BeforeEach
    public void init() {
        this.rentService = new RentService(productRepository, rentRepository, messageSource);
    }

    @Test
    void shouldConvertRentToDTOWithPrice() {
        var rent = mockRent();

        when(messageSource.getMessage("price.description.hour", null, new Locale("pt", "BR"))).thenReturn("Por hora");

        var returnedRentDTO = rentService.convertRentToDTO(rent);

        assertThat(returnedRentDTO).isNotNull();
        assertThat(returnedRentDTO.getUserRentId()).isEqualTo("user-rent");
        assertThat(returnedRentDTO.getUserOwnerId()).isEqualTo("user-owner");
        assertThat(returnedRentDTO.getPaymentType()).isEqualTo("Credit");
        assertThat(returnedRentDTO.getPriceBase()).isEqualTo("500");
        assertThat(returnedRentDTO.getPriceCurrency()).isEqualTo("BR");
        assertThat(returnedRentDTO.getPriceType()).isEqualTo("HOUR");
        assertThat(returnedRentDTO.getPriceTypeDescription()).isEqualTo("Por hora");
    }

    @Test
    void shouldReturnRentDTOWithoutPropertiesWhenRentIsNull() {
        var returnedRentDTO = rentService.convertRentToDTO(null);

        assertThat(returnedRentDTO).isNotNull();
        assertThat(returnedRentDTO.getUserRentId()).isNull();
    }

    @Test
    void shouldReturnRentSavedAndUpdateProductStatusWhenRentIsTerminalStatus() {
        var rentBeforeSave = new Rent();
        rentBeforeSave.setStatus(FINISHED);
        rentBeforeSave.setId("id");
        var rentDTOBeforeSave = new RentDTO();
        rentDTOBeforeSave.setId("id");
        rentDTOBeforeSave.setStatus("FINISHED");
        var productBeforeUpdate = new Product();
        productBeforeUpdate.setStatus(ProductStatus.UNAVAILABLE);

        var argumentCaptorProduct = ArgumentCaptor.forClass(Product.class);
        var argumentCaptorRent = ArgumentCaptor.forClass(Rent.class);

        when(productRepository.findOneById(any())).thenReturn(Mono.just(productBeforeUpdate));
        when(rentRepository.save(argumentCaptorRent.capture())).thenReturn(Mono.just(rentBeforeSave));
        when(productRepository.save(argumentCaptorProduct.capture())).thenReturn(Mono.just(productBeforeUpdate));

        var returnedRentAfterSave = rentService.updateStatusRentOrder(rentBeforeSave, rentDTOBeforeSave).block();

        var productWithNewStatus = argumentCaptorProduct.getValue();
        var rentWithNewStatus = argumentCaptorRent.getValue();

        assertThat(productWithNewStatus.getStatus()).isEqualTo(ProductStatus.AVAILABLE);
        assertThat(returnedRentAfterSave).isNotNull();
        assertThat(rentWithNewStatus.getStatus()).isEqualTo(returnedRentAfterSave.getStatus());
    }

    @Test
    void shouldReturnRentAfterSaveWithoutCallProductUpdateWhenRentIsNotTerminalStatus() {
        var rentBeforeSave = new Rent();
        rentBeforeSave.setStatus(CONFIRMED);
        var rentDTOBeforeSave = new RentDTO();
        rentDTOBeforeSave.setStatus("CONFIRMED");

        when(rentRepository.save(any())).thenReturn(Mono.just(rentBeforeSave));

        var returnedRentAfterSave = rentService.updateStatusRentOrder(rentBeforeSave, rentDTOBeforeSave).block();

        verify(productRepository, never()).save(any());
        assertThat(returnedRentAfterSave).isNotNull();
        assertThat(returnedRentAfterSave.getStatus()).isEqualTo(rentBeforeSave.getStatus());
    }

    private Rent mockRent() {
        var rent = new Rent();

        rent.setStatus(RentStatus.REQUESTED);
        rent.setUserRentId("user-rent");
        rent.setUserOwnerId("user-owner");
        rent.setPaymentType("Credit");
        rent.setPrice(new Price("500", "BR", PriceType.HOUR));

        return rent;
    }
}
