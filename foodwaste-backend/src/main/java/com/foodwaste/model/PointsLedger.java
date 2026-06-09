package com.foodwaste.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "points_ledger")
public class PointsLedger {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Integer delta;

    @Column(nullable = false)
    private String reason;

    @Column(name = "related_donation_id")
    private Long relatedDonationId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public PointsLedger() {}

    private PointsLedger(Builder b) {
        this.user = b.user;
        this.delta = b.delta;
        this.reason = b.reason;
        this.relatedDonationId = b.relatedDonationId;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private User user;
        private Integer delta;
        private String reason;
        private Long relatedDonationId;

        public Builder user(User v) { this.user = v; return this; }
        public Builder delta(Integer v) { this.delta = v; return this; }
        public Builder reason(String v) { this.reason = v; return this; }
        public Builder relatedDonationId(Long v) { this.relatedDonationId = v; return this; }
        public PointsLedger build() { return new PointsLedger(this); }
    }

    // ── Getters & Setters ───────────────────────────────────────────────────
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Integer getDelta() { return delta; }
    public void setDelta(Integer delta) { this.delta = delta; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public Long getRelatedDonationId() { return relatedDonationId; }
    public void setRelatedDonationId(Long relatedDonationId) { this.relatedDonationId = relatedDonationId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
