package com.foodwaste.controller;

import com.foodwaste.dto.DonorPointsResponse;
import com.foodwaste.dto.LeaderboardEntry;
import com.foodwaste.model.Role;
import com.foodwaste.model.User;
import com.foodwaste.repository.DonationRepository;
import com.foodwaste.repository.UserRepository;
import com.foodwaste.service.PointsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class LeaderboardController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private PointsService pointsService;

    @GetMapping("/leaderboard")
    public ResponseEntity<List<LeaderboardEntry>> getLeaderboard() {
        List<User> topDonors = userRepository.findTop10ByRoleAndIsActiveTrueOrderByPointsDesc(Role.DONOR);
        List<LeaderboardEntry> leaderboard = new ArrayList<>();
        
        int rank = 1;
        for (User user : topDonors) {
            int points = user.getPoints() != null ? user.getPoints() : 0;
            long donationCount = donationRepository.countByDonorId(user.getId());
            leaderboard.add(LeaderboardEntry.builder()
                    .rank(rank++)
                    .name(user.getName())
                    .city(user.getCity())
                    .points(points)
                    .donationCount(donationCount)
                    .badge(getBadge(points))
                    .build());
        }
        
        return ResponseEntity.ok(leaderboard);
    }

    @GetMapping("/donors/me/points")
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<?> getMyPoints() {
        try {
            User currentDonor = getCurrentUser();
            int points = currentDonor.getPoints() != null ? currentDonor.getPoints() : 0;
            DonorPointsResponse response = DonorPointsResponse.builder()
                    .points(points)
                    .badge(getBadge(points))
                    .history(pointsService.getHistory(currentDonor.getId()))
                    .build();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private User getCurrentUser() {
        com.foodwaste.security.UserDetailsImpl userDetails = (com.foodwaste.security.UserDetailsImpl) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();
        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    private String getBadge(int points) {
        if (points >= 300) return "PLATINUM";
        if (points >= 150) return "GOLD";
        if (points >= 50) return "SILVER";
        return "BRONZE";
    }
}
