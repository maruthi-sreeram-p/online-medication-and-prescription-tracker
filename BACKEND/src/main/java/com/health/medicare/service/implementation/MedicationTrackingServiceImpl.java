package com.health.medicare.service.implementation;

import com.health.medicare.dto.request.MedicationTrackingRequestDto;
import com.health.medicare.dto.response.MedicationTrackingResponseDto;
import com.health.medicare.model.*;
import com.health.medicare.repository.*;
import com.health.medicare.service.MedicationTrackingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicationTrackingServiceImpl implements MedicationTrackingService {

    private final MedicationTrackingRepository trackingRepository;
    private final PatientRepository patientRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final PrescriptionMedicineRepository prescriptionMedicineRepository;

    /**
     * Mark a medicine as taken (ON_TIME, LATE, MISSED)
     * Creates a new tracking record OR updates existing PENDING one
     */
    @Override
    public MedicationTrackingResponseDto markMedication(Long patientId, MedicationTrackingRequestDto request) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        PrescriptionMedicine pm = prescriptionMedicineRepository
                .findById(request.getPrescriptionMedicineId())
                .orElseThrow(() -> new RuntimeException("Prescription medicine not found"));

        // Check if tracking record already exists for today
        MedicationTracking existing = trackingRepository
                .findByPatientIdAndPrescriptionMedicineIdAndSlotAndTrackingDate(
                        patientId, pm.getId(), request.getSlot(), LocalDate.now())
                .orElse(null);

        if (existing != null) {
            // Update existing record
            existing.setStatus(request.getStatus());
            existing.setMarkedAt(LocalDateTime.now());
            MedicationTracking saved = trackingRepository.save(existing);
            return toDto(saved);
        }

        // Create new tracking record
        MedicationTracking tracking = MedicationTracking.builder()
                .patient(patient)
                .prescriptionMedicine(pm)
                .slot(request.getSlot())
                .trackingDate(LocalDate.now())
                .status(request.getStatus())
                .markedAt(LocalDateTime.now())
                .build();

        return toDto(trackingRepository.save(tracking));
    }

    /**
     * ✅ KEY FIX: Get today's schedule by reading ACTIVE prescriptions
     * Generates PENDING records for medicines not yet tracked today
     * This is how real-world apps work — schedule comes from prescriptions
     */
    @Override
    public List<MedicationTrackingResponseDto> getTodaySchedule(Long patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        LocalDate today = LocalDate.now();
        List<MedicationTrackingResponseDto> result = new ArrayList<>();

        // Get ALL prescriptions for this patient
        List<Prescription> prescriptions = prescriptionRepository.findByPatientId(patientId);

        for (Prescription prescription : prescriptions) {
            for (PrescriptionMedicine pm : prescription.getMedicines()) {

                // Check if prescription is still active (within duration)
                LocalDate prescriptionDate = prescription.getCreatedAt().toLocalDate();
                int duration = pm.getDurationDays() != null ? pm.getDurationDays() : 7;
                LocalDate endDate = prescriptionDate.plusDays(duration);

                // Only show if today is within the prescription duration
                if (today.isBefore(prescriptionDate) || today.isAfter(endDate)) {
                    continue;
                }

                // Get the frequency slots (e.g. "MORNING,AFTERNOON,NIGHT" or "morning,night")
                String frequency = pm.getFrequency();
                if (frequency == null || frequency.isEmpty()) continue;

                String[] slots = frequency.split(",");

                for (String rawSlot : slots) {
                    String slot = rawSlot.trim().toUpperCase();
                    if (slot.isEmpty()) continue;

                    // Check if already tracked today for this slot
                    MedicationTracking existing = trackingRepository
                            .findByPatientIdAndPrescriptionMedicineIdAndSlotAndTrackingDate(
                                    patientId, pm.getId(), slot, today)
                            .orElse(null);

                    if (existing != null) {
                        // Already tracked — return actual status
                        result.add(toDto(existing));
                    } else {
                        // Not tracked yet — auto-create PENDING record
                        MedicationTracking pending = MedicationTracking.builder()
                                .patient(patient)
                                .prescriptionMedicine(pm)
                                .slot(slot)
                                .trackingDate(today)
                                .status("PENDING")
                                .build();
                        MedicationTracking saved = trackingRepository.save(pending);
                        result.add(toDto(saved));
                    }
                }
            }
        }

        return result;
    }

    /**
     * Get full tracking history for a patient
     */
    @Override
    public List<MedicationTrackingResponseDto> getPatientHistory(Long patientId) {
        return trackingRepository.findByPatientId(patientId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Convert tracking entity to DTO with all needed fields
     */
    private MedicationTrackingResponseDto toDto(MedicationTracking t) {
        PrescriptionMedicine pm = t.getPrescriptionMedicine();
        String slot = t.getSlot() != null ? t.getSlot().toUpperCase() : "";

        // Get slot-specific meal and time info
        String meal = "";
        String timeStart = "";
        String timeEnd = "";

        if (pm != null) {
            switch (slot) {
                case "MORNING":
                    meal = pm.getMorningMeal() != null ? pm.getMorningMeal() : "";
                    timeStart = pm.getMorningTimeStart() != null ? pm.getMorningTimeStart() : "07:00";
                    timeEnd = pm.getMorningTimeEnd() != null ? pm.getMorningTimeEnd() : "09:00";
                    break;
                case "AFTERNOON":
                    meal = pm.getAfternoonMeal() != null ? pm.getAfternoonMeal() : "";
                    timeStart = pm.getAfternoonTimeStart() != null ? pm.getAfternoonTimeStart() : "12:00";
                    timeEnd = pm.getAfternoonTimeEnd() != null ? pm.getAfternoonTimeEnd() : "13:00";
                    break;
                case "NIGHT":
                    meal = pm.getNightMeal() != null ? pm.getNightMeal() : "";
                    timeStart = pm.getNightTimeStart() != null ? pm.getNightTimeStart() : "21:00";
                    timeEnd = pm.getNightTimeEnd() != null ? pm.getNightTimeEnd() : "22:00";
                    break;
            }
        }

        return MedicationTrackingResponseDto.builder()
                .id(t.getId())
                .patientId(t.getPatient().getId())
                .prescriptionMedicineId(pm != null ? pm.getId() : null)
                .medicineName(pm != null && pm.getMedicine() != null ? pm.getMedicine().getName() : "Unknown")
                .dosage(pm != null ? pm.getDosage() : "")
                .slot(slot)
                .trackingDate(t.getTrackingDate())
                .status(t.getStatus())
                .markedAt(t.getMarkedAt())
                .meal(meal)
                .timeStart(timeStart)
                .timeEnd(timeEnd)
                .build();
    }
}