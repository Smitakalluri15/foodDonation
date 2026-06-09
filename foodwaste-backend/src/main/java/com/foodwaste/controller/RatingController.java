package com.foodwaste.controller;

import com.foodwaste.dto.RatingRequest;
import com.foodwaste.dto.RatingResponse;
import com.foodwaste.service.RatingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    @Autowired
    private RatingService ratingService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> submitRating(@Valid @RequestBody RatingRequest request) {
        try {
            RatingResponse response = ratingService.submitRating(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/donation/{id}")
    public ResponseEntity<List<RatingResponse>> getRatingsForDonation(@PathVariable Long id) {
        return ResponseEntity.ok(ratingService.getRatingsForDonation(id));
    }

    @GetMapping("/user/{id}/average")
    public ResponseEntity<?> getAverageRating(@PathVariable Long id) {
        try {
            Double average = ratingService.getAverageRating(id);
            return ResponseEntity.ok(Map.of("userId", id, "averageRating", average));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
