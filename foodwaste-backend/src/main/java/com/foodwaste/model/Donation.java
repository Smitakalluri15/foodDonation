package com.foodwaste.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "donations")
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "food_name", nullable = false)
    private String foodName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull
    private Integer quantity;

    @Column(name = "quantity_unit")
    private String quantityUnit;

    @Enumerated(EnumType.STRING)
    @Column(name = "food_type")
    private FoodType foodType;

    @Column(name = "best_before")
    private LocalDateTime bestBefore;

    @Column(name = "pickup_address", nullable = false)
    private String pickupAddress;

    private String city;

    @Column(name = "pickup_time")
    private LocalDateTime pickupTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DonationStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donor_id", nullable = false)
    private User donor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "claimed_by_ngo_id")
    private User claimedByNgo;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToOne(mappedBy = "donation", cascade = CascadeType.ALL)
    private PickupTask pickupTask;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) status = DonationStatus.AVAILABLE;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // ── Constructors ─────────────────────────────────────────────────────────
    public Donation() {}

    private Donation(Builder b) {
        this.foodName     = b.foodName;
        this.description  = b.description;
        this.quantity     = b.quantity;
        this.quantityUnit = b.quantityUnit;
        this.foodType     = b.foodType;
        this.bestBefore   = b.bestBefore;
        this.pickupAddress= b.pickupAddress;
        this.city         = b.city;
        this.pickupTime   = b.pickupTime;
        this.status       = b.status;
        this.donor        = b.donor;
        this.claimedByNgo = b.claimedByNgo;
    }

    // ── Builder ──────────────────────────────────────────────────────────────
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String foodName, description, quantityUnit, pickupAddress, city;
        private Integer quantity;
        private FoodType foodType;
        private LocalDateTime bestBefore, pickupTime;
        private DonationStatus status;
        private User donor, claimedByNgo;

        public Builder foodName(String v)          { this.foodName = v; return this; }
        public Builder description(String v)       { this.description = v; return this; }
        public Builder quantity(Integer v)         { this.quantity = v; return this; }
        public Builder quantityUnit(String v)      { this.quantityUnit = v; return this; }
        public Builder foodType(FoodType v)        { this.foodType = v; return this; }
        public Builder bestBefore(LocalDateTime v) { this.bestBefore = v; return this; }
        public Builder pickupAddress(String v)     { this.pickupAddress = v; return this; }
        public Builder city(String v)              { this.city = v; return this; }
        public Builder pickupTime(LocalDateTime v) { this.pickupTime = v; return this; }
        public Builder status(DonationStatus v)    { this.status = v; return this; }
        public Builder donor(User v)               { this.donor = v; return this; }
        public Builder claimedByNgo(User v)        { this.claimedByNgo = v; return this; }
        public Donation build()                    { return new Donation(this); }
    }

    // ── Getters ──────────────────────────────────────────────────────────────
    public Long getId()                     { return id; }
    public String getFoodName()             { return foodName; }
    public String getDescription()          { return description; }
    public Integer getQuantity()            { return quantity; }
    public String getQuantityUnit()         { return quantityUnit; }
    public FoodType getFoodType()           { return foodType; }
    public LocalDateTime getBestBefore()    { return bestBefore; }
    public String getPickupAddress()        { return pickupAddress; }
    public String getCity()                 { return city; }
    public LocalDateTime getPickupTime()    { return pickupTime; }
    public DonationStatus getStatus()       { return status; }
    public User getDonor()                  { return donor; }
    public User getClaimedByNgo()           { return claimedByNgo; }
    public LocalDateTime getCreatedAt()     { return createdAt; }
    public LocalDateTime getUpdatedAt()     { return updatedAt; }
    public PickupTask getPickupTask()       { return pickupTask; }

    // ── Setters ──────────────────────────────────────────────────────────────
    public void setId(Long id)                      { this.id = id; }
    public void setFoodName(String v)               { this.foodName = v; }
    public void setDescription(String v)            { this.description = v; }
    public void setQuantity(Integer v)              { this.quantity = v; }
    public void setQuantityUnit(String v)           { this.quantityUnit = v; }
    public void setFoodType(FoodType v)             { this.foodType = v; }
    public void setBestBefore(LocalDateTime v)      { this.bestBefore = v; }
    public void setPickupAddress(String v)          { this.pickupAddress = v; }
    public void setCity(String v)                   { this.city = v; }
    public void setPickupTime(LocalDateTime v)      { this.pickupTime = v; }
    public void setStatus(DonationStatus v)         { this.status = v; }
    public void setDonor(User v)                    { this.donor = v; }
    public void setClaimedByNgo(User v)             { this.claimedByNgo = v; }
    public void setCreatedAt(LocalDateTime v)       { this.createdAt = v; }
    public void setUpdatedAt(LocalDateTime v)       { this.updatedAt = v; }
}