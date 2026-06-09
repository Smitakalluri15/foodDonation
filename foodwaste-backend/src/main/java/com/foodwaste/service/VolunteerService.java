package com.foodwaste.service;

import com.foodwaste.dto.PickupTaskResponse;
import com.foodwaste.model.*;
import com.foodwaste.repository.PickupRepository;
import com.foodwaste.repository.UserRepository;
import com.foodwaste.repository.DonationRepository;
import com.foodwaste.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VolunteerService {

    @Autowired private PickupRepository pickupRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private DonationRepository donationRepository;
    @Autowired private PointsService pointsService;
    @Autowired private com.foodwaste.config.NotificationWebSocketHandler webSocketHandler;

    // ── Volunteer: view open tasks (no volunteer assigned yet) ───────────────
    public List<PickupTaskResponse> getOpenTasks() {
        getCurrentUser();
        return pickupRepository
            .findByVolunteerIsNullAndStatus(PickupStatus.PENDING)
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // ── Volunteer: accept a task ─────────────────────────────────────────────
    @Transactional
    public PickupTaskResponse acceptTask(Long taskId) {
        User volunteer = getCurrentUser();
        PickupTask task = pickupRepository.findById(taskId)
            .orElseThrow(() -> new RuntimeException("Task not found"));

        if (task.getVolunteer() != null) {
            throw new RuntimeException("Task already assigned to another volunteer");
        }
        if (task.getStatus() != PickupStatus.PENDING) {
            throw new RuntimeException("Task is not open for assignment");
        }

        task.setVolunteer(volunteer);
        task.setStatus(PickupStatus.ASSIGNED);
        task.setAssignedAt(LocalDateTime.now());

        // Also update donation status
        Donation donation = task.getDonation();
        donation.setStatus(DonationStatus.PICKED_UP);
        donationRepository.save(donation);

        PickupTask savedTask = pickupRepository.save(task);
        try {
            webSocketHandler.broadcast("{\"type\":\"TASK_ACCEPTED\",\"id\":" + savedTask.getId() + ",\"foodName\":\"" + savedTask.getDonation().getFoodName().replace("\"", "\\\"") + "\",\"volunteerName\":\"" + savedTask.getVolunteer().getName().replace("\"", "\\\"") + "\"}");
        } catch (Exception e) {
            // safe ignore
        }
        return toResponse(savedTask);
    }

    // ── Volunteer: mark task as completed ───────────────────────────────────
    @Transactional
    public PickupTaskResponse completeTask(Long taskId) {
        User volunteer = getCurrentUser();
        PickupTask task = pickupRepository.findById(taskId)
            .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getVolunteer().getId().equals(volunteer.getId())) {
            throw new RuntimeException("Not authorized to complete this task");
        }

        task.setStatus(PickupStatus.COMPLETED);
        task.setCompletedAt(LocalDateTime.now());

        Donation donation = task.getDonation();
        donation.setStatus(DonationStatus.COMPLETED);
        donationRepository.save(donation);

        // Award points to donor for completed pickup
        pointsService.awardPoints(donation.getDonor(), PointsService.PICKUP_COMPLETED, "Donation pickup completed", donation.getId());

        PickupTask savedTask = pickupRepository.save(task);
        try {
            webSocketHandler.broadcast("{\"type\":\"TASK_COMPLETED\",\"id\":" + savedTask.getId() + ",\"foodName\":\"" + savedTask.getDonation().getFoodName().replace("\"", "\\\"") + "\",\"volunteerName\":\"" + savedTask.getVolunteer().getName().replace("\"", "\\\"") + "\"}");
        } catch (Exception e) {
            // safe ignore
        }
        return toResponse(savedTask);
    }

    // ── Volunteer: view my tasks ─────────────────────────────────────────────
    public List<PickupTaskResponse> getMyTasks() {
        User volunteer = getCurrentUser();
        return pickupRepository.findByVolunteerId(volunteer.getId())
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // ── NGO: view tasks for my claimed donations ─────────────────────────────
    public List<PickupTaskResponse> getTasksForNgo() {
        User ngo = getCurrentUser();
        return pickupRepository.findByNgoId(ngo.getId())
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // ── Helper ───────────────────────────────────────────────────────────────
    private User getCurrentUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder
            .getContext().getAuthentication().getPrincipal();
        User user = userRepository.findById(userDetails.getId())
            .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
        if (user.getRole() == Role.VOLUNTEER && Boolean.FALSE.equals(user.getApproved())) {
            throw new RuntimeException("Your volunteer account is pending approval by the administrator.");
        }
        return user;
    }

    public PickupTaskResponse toResponse(PickupTask t) {
        Donation d = t.getDonation();
        return PickupTaskResponse.builder()
            .id(t.getId())
            .donationId(d.getId())
            .foodName(d.getFoodName())
            .pickupAddress(d.getPickupAddress())
            .city(d.getCity())
            .quantity(d.getQuantity())
            .quantityUnit(d.getQuantityUnit())
            .pickupTime(d.getPickupTime())
            .ngoId(t.getNgo().getId())
            .ngoName(t.getNgo().getName())
            .volunteerId(t.getVolunteer() != null ? t.getVolunteer().getId() : null)
            .volunteerName(t.getVolunteer() != null ? t.getVolunteer().getName() : null)
            .status(t.getStatus())
            .notes(t.getNotes())
            .createdAt(t.getCreatedAt())
            .assignedAt(t.getAssignedAt())
            .completedAt(t.getCompletedAt())
            .build();
    }
}
