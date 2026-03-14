package com.foodwaste.controller;

import com.foodwaste.dto.PickupTaskResponse;
import com.foodwaste.service.VolunteerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/volunteer")
public class VolunteerController {

    @Autowired
    private VolunteerService volunteerService;

    // ── View all open (unassigned) tasks ─────────────────────────────────────
    @GetMapping("/tasks/open")
    @PreAuthorize("hasRole('VOLUNTEER')")
    public ResponseEntity<List<PickupTaskResponse>> getOpenTasks() {
        return ResponseEntity.ok(volunteerService.getOpenTasks());
    }

    // ── Accept a task ────────────────────────────────────────────────────────
    @PostMapping("/tasks/{taskId}/accept")
    @PreAuthorize("hasRole('VOLUNTEER')")
    public ResponseEntity<?> acceptTask(@PathVariable Long taskId) {
        try {
            return ResponseEntity.ok(volunteerService.acceptTask(taskId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ── Complete a task ──────────────────────────────────────────────────────
    @PostMapping("/tasks/{taskId}/complete")
    @PreAuthorize("hasRole('VOLUNTEER')")
    public ResponseEntity<?> completeTask(@PathVariable Long taskId) {
        try {
            return ResponseEntity.ok(volunteerService.completeTask(taskId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ── My assigned tasks ────────────────────────────────────────────────────
    @GetMapping("/tasks/my")
    @PreAuthorize("hasRole('VOLUNTEER')")
    public ResponseEntity<List<PickupTaskResponse>> getMyTasks() {
        return ResponseEntity.ok(volunteerService.getMyTasks());
    }
}
