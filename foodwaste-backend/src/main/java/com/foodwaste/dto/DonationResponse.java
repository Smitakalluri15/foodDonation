package com.foodwaste.dto;

import com.foodwaste.model.DonationStatus;
import com.foodwaste.model.FoodType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class DonationResponse {
    private Long id;
    private String foodName;
    private String description;
    private Integer quantity;
    private String quantityUnit;
    private FoodType foodType;
    private LocalDateTime bestBefore;
    private String pickupAddress;
    private String city;
    private LocalDateTime pickupTime;
    private DonationStatus status;
    private Long donorId;
    private String donorName;
    private String donorPhone;
    private Long claimedByNgoId;
    private String claimedByNgoName;
    private LocalDateTime createdAt;
    private Double lat;
    private Double lng;
}
