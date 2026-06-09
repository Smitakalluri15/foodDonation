package com.foodwaste.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ratings", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"donation_id", "rater_id"})
})
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donation_id", nullable = false)
    private Donation donation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rater_id", nullable = false)
    private User rater;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ratee_id", nullable = false)
    private User ratee;

    @Column(nullable = false)
    private Integer score;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Rating() {}

    private Rating(Builder b) {
        this.donation = b.donation;
        this.rater = b.rater;
        this.ratee = b.ratee;
        this.score = b.score;
        this.comment = b.comment;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Donation donation;
        private User rater, ratee;
        private Integer score;
        private String comment;

        public Builder donation(Donation v) { this.donation = v; return this; }
        public Builder rater(User v) { this.rater = v; return this; }
        public Builder ratee(User v) { this.ratee = v; return this; }
        public Builder score(Integer v) { this.score = v; return this; }
        public Builder comment(String v) { this.comment = v; return this; }
        public Rating build() { return new Rating(this); }
    }

    // ── Getters & Setters ───────────────────────────────────────────────────
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Donation getDonation() { return donation; }
    public void setDonation(Donation donation) { this.donation = donation; }

    public User getRater() { return rater; }
    public void setRater(User rater) { this.rater = rater; }

    public User getRatee() { return ratee; }
    public void setRatee(User ratee) { this.ratee = ratee; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
