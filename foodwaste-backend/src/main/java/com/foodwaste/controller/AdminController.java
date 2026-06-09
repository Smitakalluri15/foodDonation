package com.foodwaste.controller;

import com.foodwaste.model.DonationStatus;
import com.foodwaste.model.User;
import com.foodwaste.model.Role;
import com.foodwaste.repository.DonationRepository;
import com.foodwaste.repository.UserRepository;
import com.foodwaste.service.ExpiryScheduler;
import com.foodwaste.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private ExpiryScheduler expiryScheduler;

    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @PostMapping("/trigger-expiry")
    public ResponseEntity<?> triggerExpiry() {
        try {
            int expiredCount = expiryScheduler.markExpiredDonations();
            return ResponseEntity.ok(Map.of(
                "message", "Expiry check triggered successfully",
                "expiredCount", expiredCount
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "message", "Failed to trigger expiry check",
                "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        try {
            long totalDonations = donationRepository.count();
            long totalUsers = userRepository.count();
            long activeDonations = donationRepository.countByStatus(DonationStatus.AVAILABLE);
            long claimedDonations = donationRepository.countByStatus(DonationStatus.CLAIMED);
            long completedDonations = donationRepository.countByStatus(DonationStatus.COMPLETED);
            long expiredDonations = donationRepository.countByStatus(DonationStatus.EXPIRED);

            // Donations by City
            List<Object[]> cityRaw = donationRepository.countDonationsByCity();
            List<Map<String, Object>> donationsByCity = new ArrayList<>();
            for (Object[] row : cityRaw) {
                donationsByCity.add(Map.of(
                    "city", row[0] != null ? row[0] : "",
                    "count", row[1]
                ));
            }

            // Donations by Status
            List<Object[]> statusRaw = donationRepository.countDonationsByStatus();
            List<Map<String, Object>> donationsByStatus = new ArrayList<>();
            for (Object[] row : statusRaw) {
                donationsByStatus.add(Map.of(
                    "status", row[0] != null ? row[0].toString() : "",
                    "count", row[1]
                ));
            }

            // Top Donors
            List<Object[]> topDonorsRaw = userRepository.findTopDonors(PageRequest.of(0, 10));
            List<Map<String, Object>> topDonors = new ArrayList<>();
            for (Object[] row : topDonorsRaw) {
                topDonors.add(Map.of(
                    "name", row[0] != null ? row[0] : "",
                    "donationCount", row[1] != null ? row[1] : 0L,
                    "points", row[2] != null ? row[2] : 0
                ));
            }

            // Recent Users (Latest 10)
            List<User> usersRaw = userRepository.findAll(PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "id"))).getContent();
            List<Map<String, Object>> users = new ArrayList<>();
            for (User u : usersRaw) {
                Map<String, Object> uMap = new HashMap<>();
                uMap.put("id", u.getId());
                uMap.put("name", u.getName());
                uMap.put("email", u.getEmail());
                uMap.put("role", u.getRole() != null ? u.getRole().toString() : "");
                uMap.put("city", u.getCity() != null ? u.getCity() : "");
                uMap.put("active", u.getIsActive() != null ? u.getIsActive() : false);
                uMap.put("aadhaarNumber", u.getAadhaarNumber() != null ? maskAadhaar(u.getAadhaarNumber()) : "");
                users.add(uMap);
            }

            Map<String, Object> stats = new HashMap<>();
            stats.put("totalDonations", totalDonations);
            stats.put("totalUsers", totalUsers);
            stats.put("activeDonations", activeDonations);
            stats.put("claimedDonations", claimedDonations);
            stats.put("completedDonations", completedDonations);
            stats.put("expiredDonations", expiredDonations);
            stats.put("donationsByCity", donationsByCity);
            stats.put("donationsByStatus", donationsByStatus);
            stats.put("topDonors", topDonors);
            stats.put("users", users);

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "message", "Failed to retrieve administrator metrics",
                "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/volunteers/pending")
    public ResponseEntity<?> getPendingVolunteers() {
        try {
            List<User> volunteers = userRepository.findByRole(Role.VOLUNTEER);
            List<User> pending = new ArrayList<>();
            for (User v : volunteers) {
                if (Boolean.FALSE.equals(v.getApproved())) {
                    pending.add(v);
                }
            }
            return ResponseEntity.ok(pending);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "message", "Failed to retrieve pending volunteers",
                "error", e.getMessage()
            ));
        }
    }

    @PutMapping("/volunteer/approve/{id}")
    public ResponseEntity<?> approveVolunteer(@PathVariable Long id) {
        try {
            User volunteer = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Volunteer not found"));
            if (volunteer.getRole() != Role.VOLUNTEER) {
                throw new RuntimeException("User is not a volunteer");
            }
            volunteer.setApproved(true);
            volunteer.setIsActive(true);
            userRepository.save(volunteer);

            try {
                emailService.sendVolunteerApproved(volunteer);
            } catch (Exception ex) {
                // Safe ignore email send errors
            }

            return ResponseEntity.ok(Map.of("message", "Volunteer approved successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "message", "Failed to approve volunteer",
                "error", e.getMessage()
            ));
        }
    }

    @PutMapping("/volunteer/reject/{id}")
    public ResponseEntity<?> rejectVolunteer(@PathVariable Long id) {
        try {
            User volunteer = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Volunteer not found"));
            if (volunteer.getRole() != Role.VOLUNTEER) {
                throw new RuntimeException("User is not a volunteer");
            }
            userRepository.delete(volunteer);
            return ResponseEntity.ok(Map.of("message", "Volunteer rejected and removed"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "message", "Failed to reject volunteer",
                "error", e.getMessage()
            ));
        }
    }

    @PutMapping("/users/{id}/activate")
    public ResponseEntity<?> setUserActive(@PathVariable Long id, @RequestBody Map<String, Boolean> body) {
        try {
            User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
            Boolean active = body.get("active");
            if (active == null) {
                throw new RuntimeException("active field is required");
            }
            user.setIsActive(active);
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "User status updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "message", "Failed to update user status",
                "error", e.getMessage()
            ));
        }
    }

    private String maskAadhaar(String aadhaar) {
        if (aadhaar == null || aadhaar.isBlank()) {
            return "";
        }
        String clean = aadhaar.trim().replaceAll("\\s+", "");
        if (clean.length() < 4) {
            return clean;
        }
        return "XXXX XXXX " + clean.substring(clean.length() - 4);
    }
}
