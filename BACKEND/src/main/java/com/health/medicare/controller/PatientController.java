package com.health.medicare.controller;

import com.health.medicare.dto.response.PatientResponseDto;
import com.health.medicare.dto.response.PrescriptionResponseDto;
import com.health.medicare.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    // POST /api/patients/{patientId}/request/{doctorId}
    @PostMapping("/{patientId}/request/{doctorId}")
    public ResponseEntity<String> sendRequest(
            @PathVariable Long patientId,
            @PathVariable Long doctorId) {
        return ResponseEntity.ok(patientService.sendRequestToDoctor(patientId, doctorId));
    }

    // GET /api/patients/{patientId}/prescriptions
    @GetMapping("/{patientId}/prescriptions")
    public ResponseEntity<List<PrescriptionResponseDto>> getPrescriptions(
            @PathVariable Long patientId) {
        return ResponseEntity.ok(patientService.getMyPrescriptions(patientId));
    }

    // GET /api/patients/{patientId}/profile
    @GetMapping("/{patientId}/profile")
    public ResponseEntity<PatientResponseDto> getProfile(@PathVariable Long patientId) {
        return ResponseEntity.ok(patientService.getMyProfile(patientId));
    }
}