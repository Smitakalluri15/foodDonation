package com.foodwaste.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users",
       uniqueConstraints = {
           @UniqueConstraint(columnNames = "email"),
           @UniqueConstraint(columnNames = "phone")
       })
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Email
    @NotBlank
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank
    @Column(nullable = false)
    private String password;

    private String phone;
    private String address;
    private String city;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "points", nullable = false)
    private Integer points = 0;

    @Column(name = "org_name")
    private String orgName;

    @Column(name = "registration_number")
    private String registrationNumber;

    @Column(name = "aadhaar_number")
    @Convert(converter = com.foodwaste.security.AadhaarConverter.class)
    private String aadhaarNumber;

    @Column(name = "approved")
    private Boolean approved = true;

    @OneToMany(mappedBy = "donor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Donation> donations;

    @OneToMany(mappedBy = "volunteer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PickupTask> pickupTasks;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // ── Constructors ─────────────────────────────────────────────────────────
    public User() {}

    private User(Builder b) {
        this.name               = b.name;
        this.email              = b.email;
        this.password           = b.password;
        this.phone              = b.phone;
        this.address            = b.address;
        this.city               = b.city;
        this.role               = b.role;
        this.orgName            = b.orgName;
        this.registrationNumber = b.registrationNumber;
        this.aadhaarNumber      = b.aadhaarNumber;
        this.approved           = b.approved;
        this.isActive           = b.isActive;
        this.points             = b.points;
    }

    // ── Builder ──────────────────────────────────────────────────────────────
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String  name, email, password, phone, address, city, orgName, registrationNumber, aadhaarNumber;
        private Role    role;
        private Boolean isActive = true;
        private Boolean approved = true;
        private Integer points = 0;

        public Builder name(String v)               { this.name = v; return this; }
        public Builder email(String v)              { this.email = v; return this; }
        public Builder password(String v)           { this.password = v; return this; }
        public Builder phone(String v)              { this.phone = v; return this; }
        public Builder address(String v)            { this.address = v; return this; }
        public Builder city(String v)               { this.city = v; return this; }
        public Builder role(Role v)                 { this.role = v; return this; }
        public Builder orgName(String v)            { this.orgName = v; return this; }
        public Builder registrationNumber(String v) { this.registrationNumber = v; return this; }
        public Builder aadhaarNumber(String v)      { this.aadhaarNumber = v; return this; }
        public Builder approved(Boolean v)          { this.approved = v; return this; }
        public Builder isActive(Boolean v)          { this.isActive = v; return this; }
        public Builder points(Integer v)            { this.points = v; return this; }
        public User build()                         { return new User(this); }
    }

    // ── Getters ──────────────────────────────────────────────────────────────
    public Long getId()                   { return id; }
    public String getName()               { return name; }
    public String getEmail()              { return email; }
    public String getPassword()           { return password; }
    public String getPhone()              { return phone; }
    public String getAddress()            { return address; }
    public String getCity()               { return city; }
    public Role getRole()                 { return role; }
    public LocalDateTime getCreatedAt()   { return createdAt; }
    public Boolean getIsActive()          { return isActive; }
    public Integer getPoints()            { return points; }
    public String getOrgName()            { return orgName; }
    public String getRegistrationNumber() { return registrationNumber; }
    public String getAadhaarNumber()      { return aadhaarNumber; }
    public Boolean getApproved()          { return approved; }
    public List<Donation> getDonations()  { return donations; }
    public List<PickupTask> getPickupTasks() { return pickupTasks; }

    // ── Setters ──────────────────────────────────────────────────────────────
    public void setId(Long id)                        { this.id = id; }
    public void setName(String name)                  { this.name = name; }
    public void setEmail(String email)                { this.email = email; }
    public void setPassword(String password)          { this.password = password; }
    public void setPhone(String phone)                { this.phone = phone; }
    public void setAddress(String address)            { this.address = address; }
    public void setCity(String city)                  { this.city = city; }
    public void setRole(Role role)                    { this.role = role; }
    public void setIsActive(Boolean isActive)         { this.isActive = isActive; }
    public void setPoints(Integer points)             { this.points = points; }
    public void setOrgName(String orgName)            { this.orgName = orgName; }
    public void setRegistrationNumber(String v)       { this.registrationNumber = v; }
    public void setAadhaarNumber(String v)            { this.aadhaarNumber = v; }
    public void setApproved(Boolean v)                { this.approved = v; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}