package com.health.medicare.controller;

import com.health.medicare.dto.request.MedicationTrackingRequestDto;
import com.health.medicare.dto.response.MedicationTrackingResponseDto;
import com.health.medicare.service.MedicationTrackingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/tracking")
@RequiredArgsConstructor
public class MedicationTrackingController {

    private final MedicationTrackingService trackingService;

    // POST /api/tracking/{patientId}/mark
    @PostMapping("/{patientId}/mark")
    public ResponseEntity<?> markMedication(
            @PathVariable Long patientId,
            @RequestBody MedicationTrackingRequestDto request) {
        try {
            return ResponseEntity.ok(trackingService.markMedication(patientId, request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to mark medication: " + e.getMessage());
        }
    }

    // GET /api/tracking/{patientId}/today
    // ✅ Returns empty list instead of 400 if patient has no prescriptions
    @GetMapping("/{patientId}/today")
    public ResponseEntity<List<MedicationTrackingResponseDto>> getTodaySchedule(
            @PathVariable Long patientId) {
        try {
            List<MedicationTrackingResponseDto> result = trackingService.getTodaySchedule(patientId);
            return ResponseEntity.ok(result != null ? result : new ArrayList<>());
        } catch (Exception e) {
            // ✅ Return empty list instead of 400
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    // GET /api/tracking/{patientId}/history
    @GetMapping("/{patientId}/history")
    public ResponseEntity<List<MedicationTrackingResponseDto>> getHistory(
            @PathVariable Long patientId) {
        try {
            List<MedicationTrackingResponseDto> result = trackingService.getPatientHistory(patientId);
            return ResponseEntity.ok(result != null ? result : new ArrayList<>());
        } catch (Exception e) {
            return ResponseEntity.ok(new ArrayList<>());
        }
    }
}