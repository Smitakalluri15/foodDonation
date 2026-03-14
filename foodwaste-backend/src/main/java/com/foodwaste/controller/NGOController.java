package com.foodwaste.controller;

import com.foodwaste.dto.DonationResponse;
import com.foodwaste.dto.PickupTaskResponse;
import com.foodwaste.service.DonationService;
import com.foodwaste.service.VolunteerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ngo")
@PreAuthorize("hasRole('NGO')")
public class NGOController {

    @Autowired
    private DonationService donationService;

    @Autowired
    private VolunteerService volunteerService;

    // ── NGO: My claimed donations ────────────────────────────────────────────
    @GetMapping("/donations/claimed")
    public ResponseEntity<List<DonationResponse>> getClaimedDonations() {
        // Reuse the available endpoint filtered by NGO's claims
        // Delegated to DonationService
        return ResponseEntity.ok(donationService.getMyDonations());
    }

    // ── NGO: My pickup tasks ─────────────────────────────────────────────────
    @GetMapping("/tasks")
    public ResponseEntity<List<PickupTaskResponse>> getMyTasks() {
        return ResponseEntity.ok(volunteerService.getTasksForNgo());
    }
}
