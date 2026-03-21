package com.health.medicare.controller;

import com.health.medicare.dto.response.PatientResponseDto;
import com.health.medicare.dto.response.PrescriptionResponseDto;
import com.health.medicare.model.PatientRequest;
import com.health.medicare.repository.PatientRequestRepository;
import com.health.medicare.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;
    private final PatientRequestRepository patientRequestRepository;

    // POST /api/patients/{patientId}/request/{doctorId}
    @PostMapping("/{patientId}/request/{doctorId}")
    public ResponseEntity<?> sendRequest(
            @PathVariable Long patientId,
            @PathVariable Long doctorId) {
        try {
            String result = patientService.sendRequestToDoctor(patientId, doctorId);
            return ResponseEntity.ok(Map.of("message", result));
        } catch (RuntimeException e) {
            String msg = e.getMessage() != null ? e.getMessage().toLowerCase() : "";
            if (msg.contains("already")) {
                return ResponseEntity.ok(
                        Map.of("message", "Request already sent to this doctor")
                );
            }
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // GET /api/patients/{patientId}/requests
    @GetMapping("/{patientId}/requests")
    public ResponseEntity<List<PatientRequest>> getMyRequests(
            @PathVariable Long patientId) {
        try {
            List<PatientRequest> requests = patientRequestRepository
                    .findByPatientId(patientId);
            return ResponseEntity.ok(requests != null ? requests : new ArrayList<>());
        } catch (Exception e) {
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    // GET /api/patients/{patientId}/prescriptions
    @GetMapping("/{patientId}/prescriptions")
    public ResponseEntity<List<PrescriptionResponseDto>> getPrescriptions(
            @PathVariable Long patientId) {
        try {
            return ResponseEntity.ok(patientService.getMyPrescriptions(patientId));
        } catch (Exception e) {
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    // GET /api/patients/{patientId}/profile
    @GetMapping("/{patientId}/profile")
    public ResponseEntity<?> getProfile(@PathVariable Long patientId) {
        try {
            return ResponseEntity.ok(patientService.getMyProfile(patientId));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ✅ BUG FIX: New endpoint — PUT /api/patients/{patientId}/profile
    @PutMapping("/{patientId}/profile")
    public ResponseEntity<?> updateProfile(
            @PathVariable Long patientId,
            @RequestBody Map<String, Object> updates) {
        try {
            PatientResponseDto updated = patientService.updateProfile(patientId, updates);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
}