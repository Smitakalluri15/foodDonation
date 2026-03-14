package com.foodwaste.controller;

import com.foodwaste.dto.DonationRequest;
import com.foodwaste.dto.DonationResponse;
import com.foodwaste.service.DonationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/donations")
public class DonationController {

    @Autowired
    private DonationService donationService;

    // ── DONOR: Create ────────────────────────────────────────────────────────
    @PostMapping("/add")
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<?> addDonation(@Valid @RequestBody DonationRequest request) {
        try {
            return ResponseEntity.ok(donationService.addDonation(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ── DONOR: My donations ──────────────────────────────────────────────────
    @GetMapping("/my")
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<List<DonationResponse>> getMyDonations() {
        return ResponseEntity.ok(donationService.getMyDonations());
    }

    // ── DONOR: Update ────────────────────────────────────────────────────────
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<?> updateDonation(@PathVariable Long id,
                                            @Valid @RequestBody DonationRequest request) {
        try {
            return ResponseEntity.ok(donationService.updateDonation(id, request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ── DONOR: Cancel ────────────────────────────────────────────────────────
    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<?> cancelDonation(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(donationService.cancelDonation(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ── NGO / ALL: Browse available ──────────────────────────────────────────
    @GetMapping("/available")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<DonationResponse>> getAvailable(
            @RequestParam(required = false) String city) {
        return ResponseEntity.ok(donationService.getAvailableDonations(city));
    }

    // ── NGO: Claim donation ──────────────────────────────────────────────────
    @PostMapping("/{id}/claim")
    @PreAuthorize("hasRole('NGO')")
    public ResponseEntity<?> claimDonation(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(donationService.claimDonation(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ── ALL: Get single donation ─────────────────────────────────────────────
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getDonationById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(donationService.getDonationById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
