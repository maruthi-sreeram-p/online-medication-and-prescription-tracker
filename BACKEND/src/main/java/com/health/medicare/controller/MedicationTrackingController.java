package com.health.medicare.controller;

import com.health.medicare.dto.request.MedicationTrackingRequestDto;
import com.health.medicare.dto.response.MedicationTrackingResponseDto;
import com.health.medicare.service.MedicationTrackingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tracking")
@RequiredArgsConstructor
public class MedicationTrackingController {

    private final MedicationTrackingService trackingService;

    // POST /api/tracking/{patientId}/mark
    @PostMapping("/{patientId}/mark")
    public ResponseEntity<MedicationTrackingResponseDto> markMedication(
            @PathVariable Long patientId,
            @RequestBody MedicationTrackingRequestDto request) {
        return ResponseEntity.ok(trackingService.markMedication(patientId, request));
    }

    // GET /api/tracking/{patientId}/today
    @GetMapping("/{patientId}/today")
    public ResponseEntity<List<MedicationTrackingResponseDto>> getTodaySchedule(
            @PathVariable Long patientId) {
        return ResponseEntity.ok(trackingService.getTodaySchedule(patientId));
    }

    // GET /api/tracking/{patientId}/history
    @GetMapping("/{patientId}/history")
    public ResponseEntity<List<MedicationTrackingResponseDto>> getHistory(
            @PathVariable Long patientId) {
        return ResponseEntity.ok(trackingService.getPatientHistory(patientId));
    }
}