package com.rentup.app.domain.product;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.rentup.app.domain.AbstractAuditingEntity;
import java.io.Serializable;
import javax.validation.constraints.NotNull;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Field;

@JsonIgnoreProperties(ignoreUnknown = true)
@org.springframework.data.mongodb.core.mapping.Document(collection = "jhi_product")
public class Product extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull
    @Indexed
    private String user;

    @NotNull
    private String name;

    @NotNull
    private String category;

    @NotNull
    private Price price;

    @Field("image_url")
    private String imageUrl;

    private String description;

    public Product(String id, String user, String name, String category, Price price, String imageUrl, String description) {
        this.id = id;
        this.user = user;
        this.name = name;
        this.category = category;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
    }

    public Product() {}

    public static long getSerialVersionUID() {
        return serialVersionUID;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Price getPrice() {
        return price;
    }

    public void setPrice(Price price) {
        this.price = price;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return (
            "Product{" + "id='" + id + '\'' + ", user='" + user + '\'' + ", name='" + name + '\'' + ", category='" + category + '\'' + '}'
        );
    }
}
