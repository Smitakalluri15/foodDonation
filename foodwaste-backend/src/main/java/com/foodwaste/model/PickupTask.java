package com.foodwaste.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "pickup_tasks")
public class PickupTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donation_id", nullable = false, unique = true)
    private Donation donation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ngo_id", nullable = false)
    private User ngo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "volunteer_id")
    private User volunteer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PickupStatus status;

    @Column(name = "assigned_at")
    private LocalDateTime assignedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) status = PickupStatus.PENDING;
    }

    // ── Constructors ─────────────────────────────────────────────────────────
    public PickupTask() {}

    private PickupTask(Builder b) {
        this.donation  = b.donation;
        this.ngo       = b.ngo;
        this.volunteer = b.volunteer;
        this.status    = b.status;
        this.notes     = b.notes;
    }

    // ── Builder ──────────────────────────────────────────────────────────────
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Donation donation;
        private User ngo, volunteer;
        private PickupStatus status;
        private String notes;

        public Builder donation(Donation v)   { this.donation = v; return this; }
        public Builder ngo(User v)            { this.ngo = v; return this; }
        public Builder volunteer(User v)      { this.volunteer = v; return this; }
        public Builder status(PickupStatus v) { this.status = v; return this; }
        public Builder notes(String v)        { this.notes = v; return this; }
        public PickupTask build()             { return new PickupTask(this); }
    }

    // ── Getters ──────────────────────────────────────────────────────────────
    public Long getId()                   { return id; }
    public Donation getDonation()         { return donation; }
    public User getNgo()                  { return ngo; }
    public User getVolunteer()            { return volunteer; }
    public PickupStatus getStatus()       { return status; }
    public LocalDateTime getAssignedAt()  { return assignedAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }
    public String getNotes()              { return notes; }
    public LocalDateTime getCreatedAt()   { return createdAt; }

    // ── Setters ──────────────────────────────────────────────────────────────
    public void setId(Long id)                    { this.id = id; }
    public void setDonation(Donation v)           { this.donation = v; }
    public void setNgo(User v)                    { this.ngo = v; }
    public void setVolunteer(User v)              { this.volunteer = v; }
    public void setStatus(PickupStatus v)         { this.status = v; }
    public void setAssignedAt(LocalDateTime v)    { this.assignedAt = v; }
    public void setCompletedAt(LocalDateTime v)   { this.completedAt = v; }
    public void setNotes(String v)                { this.notes = v; }
    public void setCreatedAt(LocalDateTime v)     { this.createdAt = v; }
}