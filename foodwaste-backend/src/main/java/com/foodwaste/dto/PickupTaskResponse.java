package com.foodwaste.dto;

import com.foodwaste.model.PickupStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PickupTaskResponse {
    private Long id;
    private Long donationId;
    private String foodName;
    private String pickupAddress;
    private String city;
    private Integer quantity;
    private String quantityUnit;
    private LocalDateTime pickupTime;
    private Long ngoId;
    private String ngoName;
    private Long volunteerId;
    private String volunteerName;
    private PickupStatus status;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime assignedAt;
    private LocalDateTime completedAt;
}
