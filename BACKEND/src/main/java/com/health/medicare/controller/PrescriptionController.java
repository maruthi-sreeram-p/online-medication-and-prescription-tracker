package com.health.medicare.controller;

import com.health.medicare.dto.request.PrescriptionRequestDto;
import com.health.medicare.dto.response.PrescriptionResponseDto;
import com.health.medicare.service.PrescriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
@RequiredArgsConstructor
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    // POST /api/prescriptions/{doctorId}
    @PostMapping("/{doctorId}")
    public ResponseEntity<PrescriptionResponseDto> createPrescription(
            @PathVariable Long doctorId,
            @RequestBody PrescriptionRequestDto request) {
        return ResponseEntity.ok(prescriptionService.createPrescription(doctorId, request));
    }

    // GET /api/prescriptions/doctor/{doctorId}
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<PrescriptionResponseDto>> getDoctorPrescriptions(
            @PathVariable Long doctorId) {
        return ResponseEntity.ok(prescriptionService.getDoctorPrescriptions(doctorId));
    }

    // GET /api/prescriptions/patient/{patientId}
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<PrescriptionResponseDto>> getPatientPrescriptions(
            @PathVariable Long patientId) {
        return ResponseEntity.ok(prescriptionService.getPatientPrescriptions(patientId));
    }
}