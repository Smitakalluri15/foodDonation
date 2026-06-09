package com.foodwaste.service;

import com.foodwaste.dto.RatingRequest;
import com.foodwaste.dto.RatingResponse;
import com.foodwaste.model.Donation;
import com.foodwaste.model.Rating;
import com.foodwaste.model.User;
import com.foodwaste.repository.DonationRepository;
import com.foodwaste.repository.RatingRepository;
import com.foodwaste.repository.UserRepository;
import com.foodwaste.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RatingService {

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public RatingResponse submitRating(RatingRequest req) {
        User rater = getCurrentUser();
        
        Donation donation = donationRepository.findById(req.getDonationId())
                .orElseThrow(() -> new RuntimeException("Donation not found"));

        User ratee = userRepository.findById(req.getRateeId())
                .orElseThrow(() -> new RuntimeException("Ratee user not found"));

        if (rater.getId().equals(ratee.getId())) {
            throw new RuntimeException("You cannot rate yourself");
        }

        if (ratingRepository.existsByDonation_IdAndRater_Id(donation.getId(), rater.getId())) {
            throw new RuntimeException("You have already rated for this donation");
        }

        Rating rating = Rating.builder()
                .donation(donation)
                .rater(rater)
                .ratee(ratee)
                .score(req.getScore())
                .comment(req.getComment())
                .build();

        Rating saved = ratingRepository.save(rating);
        return toResponse(saved);
    }

    public List<RatingResponse> getRatingsForDonation(Long donationId) {
        return ratingRepository.findByDonation_Id(donationId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public Double getAverageRating(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found");
        }
        Double avg = ratingRepository.findAverageScoreByRatee_Id(userId);
        if (avg == null) {
            return 0.0;
        }
        return Math.round(avg * 10.0) / 10.0;
    }

    private User getCurrentUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();
        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    private RatingResponse toResponse(Rating rating) {
        return RatingResponse.builder()
                .id(rating.getId())
                .donationId(rating.getDonation().getId())
                .raterName(rating.getRater().getName())
                .rateeName(rating.getRatee().getName())
                .score(rating.getScore())
                .comment(rating.getComment())
                .createdAt(rating.getCreatedAt())
                .build();
    }
}
