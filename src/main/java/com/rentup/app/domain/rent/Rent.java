package com.rentup.app.domain.rent;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.rentup.app.domain.AbstractAuditingEntity;
import com.rentup.app.domain.product.Price;
import java.io.Serializable;
import java.util.Date;
import javax.validation.constraints.NotNull;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Field;

@JsonIgnoreProperties(ignoreUnknown = true)
@org.springframework.data.mongodb.core.mapping.Document(collection = "jhi_rent")
public class Rent extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 112678696033751941L;

    @Id
    private String id;

    @NotNull
    @Indexed
    @Field("product_id")
    private String productId;

    @NotNull
    @Indexed
    @Field("user_owner_id")
    private String userOwnerId;

    @NotNull
    @Indexed
    @Field("user_rent_id")
    private String userRentId;

    @NotNull
    private Price price;

    @NotNull
    private Date initialDate;

    @NotNull
    private Date finalDate;

    @NotNull
    private RentStatus status;

    private String paymentType;

    public Rent() {}

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public String getUserOwnerId() {
        return userOwnerId;
    }

    public void setUserOwnerId(String userOwnerId) {
        this.userOwnerId = userOwnerId;
    }

    public String getUserRentId() {
        return userRentId;
    }

    public void setUserRentId(String userRentId) {
        this.userRentId = userRentId;
    }

    public Price getPrice() {
        return price;
    }

    public void setPrice(Price price) {
        this.price = price;
    }

    public Date getInitialDate() {
        return initialDate;
    }

    public void setInitialDate(Date initialDate) {
        this.initialDate = initialDate;
    }

    public Date getFinalDate() {
        return finalDate;
    }

    public void setFinalDate(Date finalDate) {
        this.finalDate = finalDate;
    }

    public RentStatus getStatus() {
        return status;
    }

    public void setStatus(RentStatus status) {
        this.status = status;
    }

    public String getPaymentType() {
        return paymentType;
    }

    public void setPaymentType(String paymentType) {
        this.paymentType = paymentType;
    }
}
