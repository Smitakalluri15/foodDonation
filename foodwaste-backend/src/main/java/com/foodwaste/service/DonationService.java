package com.foodwaste.service;

import com.foodwaste.dto.DonationRequest;
import com.foodwaste.dto.DonationResponse;
import com.foodwaste.model.*;
import com.foodwaste.repository.DonationRepository;
import com.foodwaste.repository.PickupRepository;
import com.foodwaste.repository.UserRepository;
import com.foodwaste.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DonationService {

    @Autowired private DonationRepository donationRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private PickupRepository pickupRepository;
    @Autowired private PointsService pointsService;
    @Autowired private GeocodeService geocodeService;
    @Autowired private com.foodwaste.config.NotificationWebSocketHandler webSocketHandler;
    @Autowired private EmailService emailService;

    // ── Donor: add new donation ──────────────────────────────────────────────
    @Transactional
    public DonationResponse addDonation(DonationRequest request) {
        User donor = getCurrentUser();
        Donation donation = Donation.builder()
            .foodName(request.getFoodName())
            .description(request.getDescription())
            .quantity(request.getQuantity())
            .quantityUnit(request.getQuantityUnit())
            .foodType(request.getFoodType())
            .bestBefore(request.getBestBefore())
            .pickupAddress(request.getPickupAddress())
            .city(request.getCity())
            .pickupTime(request.getPickupTime())
            .status(DonationStatus.AVAILABLE)
            .donor(donor)
            .build();
        Donation saved = donationRepository.save(donation);

        try {
            String fullAddress = saved.getPickupAddress();
            if (saved.getCity() != null && !saved.getCity().isBlank()) {
                fullAddress += ", " + saved.getCity();
            }
            double[] coords = geocodeService.geocodeAddress(fullAddress);
            if (coords != null) {
                saved.setLatitude(coords[0]);
                saved.setLongitude(coords[1]);
                saved = donationRepository.save(saved);
            }
        } catch (Exception e) {
            // safe catch to prevent blocking donation save
        }

        try {
            webSocketHandler.broadcast("{\"type\":\"DONATION_CREATED\",\"id\":" + saved.getId() + ",\"name\":\"" + saved.getFoodName().replace("\"", "\\\"") + "\",\"city\":\"" + (saved.getCity() != null ? saved.getCity().replace("\"", "\\\"") : "") + "\"}");
        } catch (Exception e) {
            // safe ignore
        }

        return toResponse(saved);
    }

    // ── Donor: view own donations ────────────────────────────────────────────
    public List<DonationResponse> getMyDonations() {
        User donor = getCurrentUser();
        return donationRepository.findByDonorId(donor.getId())
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // ── NGO: view claimed donations ──────────────────────────────────────────
    public List<DonationResponse> getClaimedDonations() {
        User ngo = getCurrentUser();
        return donationRepository.findByClaimedByNgoId(ngo.getId())
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // ── Donor: update donation ───────────────────────────────────────────────
    @Transactional
    public DonationResponse updateDonation(Long id, DonationRequest request) {
        User donor = getCurrentUser();
        Donation donation = donationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Donation not found"));

        if (!donation.getDonor().getId().equals(donor.getId())) {
            throw new RuntimeException("Not authorized to update this donation");
        }
        if (donation.getStatus() != DonationStatus.AVAILABLE) {
            throw new RuntimeException("Only AVAILABLE donations can be edited");
        }

        donation.setFoodName(request.getFoodName());
        donation.setDescription(request.getDescription());
        donation.setQuantity(request.getQuantity());
        donation.setQuantityUnit(request.getQuantityUnit());
        donation.setFoodType(request.getFoodType());
        donation.setBestBefore(request.getBestBefore());
        donation.setPickupAddress(request.getPickupAddress());
        donation.setCity(request.getCity());
        donation.setPickupTime(request.getPickupTime());

        return toResponse(donationRepository.save(donation));
    }

    // ── Donor: cancel donation ───────────────────────────────────────────────
    @Transactional
    public DonationResponse cancelDonation(Long id) {
        User donor = getCurrentUser();
        Donation donation = donationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Donation not found"));

        if (!donation.getDonor().getId().equals(donor.getId())) {
            throw new RuntimeException("Not authorized");
        }
        donation.setStatus(DonationStatus.EXPIRED);
        return toResponse(donationRepository.save(donation));
    }

    // ── NGO: browse available donations ─────────────────────────────────────
    public List<DonationResponse> getAvailableDonations(String city) {
        if (city != null && !city.isBlank()) {
            return donationRepository.findAvailableByCity(city)
                .stream().map(this::toResponse).collect(Collectors.toList());
        }
        return donationRepository.findAllAvailable()
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // ── NGO: claim donation ──────────────────────────────────────────────────
    @Transactional
    public DonationResponse claimDonation(Long donationId) {
        User ngo = getCurrentUser();
        Donation donation = donationRepository.findById(donationId)
            .orElseThrow(() -> new RuntimeException("Donation not found"));

        if (donation.getStatus() != DonationStatus.AVAILABLE) {
            throw new RuntimeException("Donation is not available for claiming");
        }

        donation.setStatus(DonationStatus.CLAIMED);
        donation.setClaimedByNgo(ngo);
        donationRepository.save(donation);

        // Auto-create a pickup task for this donation
        PickupTask task = PickupTask.builder()
            .donation(donation)
            .ngo(ngo)
            .status(PickupStatus.PENDING)
            .build();
        pickupRepository.save(task);

        // Award points to donor when their donation is claimed
        User donor = donation.getDonor();
        pointsService.awardPoints(donor, PointsService.DONATION_CLAIMED, "Donation claimed by NGO", donation.getId());

        // Check if it's the donor's first ever donation
        long donationCount = donationRepository.countByDonorId(donor.getId());
        if (donationCount == 1) {
            pointsService.awardPoints(donor, PointsService.FIRST_DONATION, "First donation bonus", donation.getId());
        }

        try {
            webSocketHandler.broadcast("{\"type\":\"DONATION_CLAIMED\",\"id\":" + donation.getId() + ",\"name\":\"" + donation.getFoodName().replace("\"", "\\\"") + "\"}");
        } catch (Exception e) {
            // safe ignore
        }

        try {
            emailService.sendDonationClaimed(donation);
        } catch (Exception e) {
            // safe ignore
        }

        return toResponse(donation);
    }

    // ── Public: get single donation ──────────────────────────────────────────
    public DonationResponse getDonationById(Long id) {
        Donation donation = donationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Donation not found"));
        return toResponse(donation);
    }

    // ── Helper: get logged-in user ───────────────────────────────────────────
    private User getCurrentUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder
            .getContext().getAuthentication().getPrincipal();
        return userRepository.findById(userDetails.getId())
            .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    // ── Helper: entity → DTO ─────────────────────────────────────────────────
    public DonationResponse toResponse(Donation d) {
        return DonationResponse.builder()
            .id(d.getId())
            .foodName(d.getFoodName())
            .description(d.getDescription())
            .quantity(d.getQuantity())
            .quantityUnit(d.getQuantityUnit())
            .foodType(d.getFoodType())
            .bestBefore(d.getBestBefore())
            .pickupAddress(d.getPickupAddress())
            .city(d.getCity())
            .pickupTime(d.getPickupTime())
            .status(d.getStatus())
            .donorId(d.getDonor().getId())
            .donorName(d.getDonor().getName())
            .donorPhone(d.getDonor().getPhone())
            .claimedByNgoId(d.getClaimedByNgo() != null ? d.getClaimedByNgo().getId() : null)
            .claimedByNgoName(d.getClaimedByNgo() != null ? d.getClaimedByNgo().getName() : null)
            .createdAt(d.getCreatedAt())
            .lat(d.getLatitude())
            .lng(d.getLongitude())
            .build();
    }
}
