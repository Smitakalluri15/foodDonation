package com.foodwaste.dto;

import com.foodwaste.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @Email
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    private String phone;
    private String address;
    private String city;

    @NotNull(message = "Role is required")
    private Role role;

    private String orgName;
    private String registrationNumber;

    // ── Getters ──────────────────────────────────────────────────────────────
    public String getName()               { return name; }
    public String getEmail()              { return email; }
    public String getPassword()           { return password; }
    public String getPhone()              { return phone; }
    public String getAddress()            { return address; }
    public String getCity()               { return city; }
    public Role getRole()                 { return role; }
    public String getOrgName()            { return orgName; }
    public String getRegistrationNumber() { return registrationNumber; }

    // ── Setters ──────────────────────────────────────────────────────────────
    public void setName(String name)                            { this.name = name; }
    public void setEmail(String email)                          { this.email = email; }
    public void setPassword(String password)                    { this.password = password; }
    public void setPhone(String phone)                          { this.phone = phone; }
    public void setAddress(String address)                      { this.address = address; }
    public void setCity(String city)                            { this.city = city; }
    public void setRole(Role role)                              { this.role = role; }
    public void setOrgName(String orgName)                      { this.orgName = orgName; }
    public void setRegistrationNumber(String registrationNumber){ this.registrationNumber = registrationNumber; }
}