package com.foodwaste.dto;

import com.foodwaste.model.FoodType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDateTime;

public class DonationRequest {

    @NotBlank(message = "Food name is required")
    private String foodName;

    private String description;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be positive")
    private Integer quantity;

    private String quantityUnit;
    private FoodType foodType;
    private LocalDateTime bestBefore;

    @NotBlank(message = "Pickup address is required")
    private String pickupAddress;

    private String city;
    private LocalDateTime pickupTime;

    public String getFoodName()             { return foodName; }
    public String getDescription()          { return description; }
    public Integer getQuantity()            { return quantity; }
    public String getQuantityUnit()         { return quantityUnit; }
    public FoodType getFoodType()           { return foodType; }
    public LocalDateTime getBestBefore()    { return bestBefore; }
    public String getPickupAddress()        { return pickupAddress; }
    public String getCity()                 { return city; }
    public LocalDateTime getPickupTime()    { return pickupTime; }

    public void setFoodName(String v)           { this.foodName = v; }
    public void setDescription(String v)        { this.description = v; }
    public void setQuantity(Integer v)          { this.quantity = v; }
    public void setQuantityUnit(String v)       { this.quantityUnit = v; }
    public void setFoodType(FoodType v)         { this.foodType = v; }
    public void setBestBefore(LocalDateTime v)  { this.bestBefore = v; }
    public void setPickupAddress(String v)      { this.pickupAddress = v; }
    public void setCity(String v)               { this.city = v; }
    public void setPickupTime(LocalDateTime v)  { this.pickupTime = v; }
}