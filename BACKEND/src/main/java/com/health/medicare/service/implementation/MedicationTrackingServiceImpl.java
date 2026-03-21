package com.health.medicare.service.implementation;

import com.health.medicare.dto.request.MedicationTrackingRequestDto;
import com.health.medicare.dto.response.MedicationTrackingResponseDto;
import com.health.medicare.model.*;
import com.health.medicare.repository.*;
import com.health.medicare.service.MedicationTrackingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeParseException;
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

    // ─────────────────────────────────────────────────────────────────
    // MARK MEDICATION
    // ─────────────────────────────────────────────────────────────────
    @Override
    @Transactional
    public MedicationTrackingResponseDto markMedication(Long patientId, MedicationTrackingRequestDto request) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        PrescriptionMedicine pm = prescriptionMedicineRepository
                .findById(request.getPrescriptionMedicineId())
                .orElseThrow(() -> new RuntimeException("Prescription medicine not found"));

        // Determine ON_TIME vs LATE based on current clock vs slot end time
        String[] times = getSlotTimes(pm, request.getSlot());
        String calculatedStatus = calculateMarkStatus(times[1]);

        MedicationTracking existing = trackingRepository
                .findByPatientIdAndPrescriptionMedicineIdAndSlotAndTrackingDate(
                        patientId, pm.getId(), request.getSlot(), LocalDate.now())
                .orElse(null);

        if (existing != null) {
            // Don't overwrite a confirmed ON_TIME with LATE
            if (!"ON_TIME".equals(existing.getStatus())) {
                existing.setStatus(calculatedStatus);
                existing.setMarkedAt(LocalDateTime.now());
            }
            return toDto(trackingRepository.save(existing));
        }

        MedicationTracking tracking = MedicationTracking.builder()
                .patient(patient)
                .prescriptionMedicine(pm)
                .slot(request.getSlot())
                .trackingDate(LocalDate.now())
                .status(calculatedStatus)
                .markedAt(LocalDateTime.now())
                .build();

        return toDto(trackingRepository.save(tracking));
    }

    // ─────────────────────────────────────────────────────────────────
    // GET TODAY'S SCHEDULE
    // ─────────────────────────────────────────────────────────────────
    @Override
    @Transactional
    public List<MedicationTrackingResponseDto> getTodaySchedule(Long patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        LocalDate today = LocalDate.now();
        List<MedicationTrackingResponseDto> result = new ArrayList<>();

        List<Prescription> prescriptions = prescriptionRepository.findByPatientId(patientId);

        for (Prescription prescription : prescriptions) {
            List<PrescriptionMedicine> medicines =
                    prescriptionMedicineRepository.findByPrescriptionId(prescription.getId());

            for (PrescriptionMedicine pm : medicines) {

                // ✅ FIX: If createdAt is null (old prescriptions saved before our fix),
                // treat them as ALWAYS ACTIVE — do NOT skip them.
                // New prescriptions (saved after our PrescriptionServiceImpl fix) will
                // have a proper createdAt and will respect the duration window.
                if (prescription.getCreatedAt() != null) {
                    LocalDate prescriptionDate = prescription.getCreatedAt().toLocalDate();
                    int duration = (pm.getDurationDays() != null && pm.getDurationDays() > 0)
                            ? pm.getDurationDays() : 7;
                    LocalDate endDate = prescriptionDate.plusDays(duration - 1);

                    // Skip only if today is outside the active date range
                    if (today.isBefore(prescriptionDate) || today.isAfter(endDate)) {
                        continue;
                    }
                }
                // If createdAt IS null → fall through and show the medicine (no date check)

                String frequency = pm.getFrequency();
                if (frequency == null || frequency.isEmpty()) continue;

                for (String rawSlot : frequency.split(",")) {
                    String slot = rawSlot.trim().toUpperCase();
                    if (slot.isEmpty()) continue;

                    MedicationTracking existing = trackingRepository
                            .findByPatientIdAndPrescriptionMedicineIdAndSlotAndTrackingDate(
                                    patientId, pm.getId(), slot, today)
                            .orElse(null);

                    if (existing != null) {
                        // Already tracked — auto-update PENDING/UPCOMING to MISSED if window passed
                        if ("PENDING".equals(existing.getStatus()) || "UPCOMING".equals(existing.getStatus())) {
                            String autoStatus = calculateAutoStatus(pm, slot);
                            if (!autoStatus.equals(existing.getStatus())) {
                                existing.setStatus(autoStatus);
                                existing = trackingRepository.save(existing);
                            }
                        }
                        result.add(toDto(existing));
                    } else {
                        // New record — calculate correct status based on current time
                        String autoStatus = calculateAutoStatus(pm, slot);
                        MedicationTracking newTracking = MedicationTracking.builder()
                                .patient(patient)
                                .prescriptionMedicine(pm)
                                .slot(slot)
                                .trackingDate(today)
                                .status(autoStatus)
                                .build();
                        result.add(toDto(trackingRepository.save(newTracking)));
                    }
                }
            }
        }

        return result;
    }

    // ─────────────────────────────────────────────────────────────────
    // GET HISTORY
    // ─────────────────────────────────────────────────────────────────
    @Override
    @Transactional(readOnly = true)
    public List<MedicationTrackingResponseDto> getPatientHistory(Long patientId) {
        return trackingRepository.findByPatientId(patientId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // ─────────────────────────────────────────────────────────────────
    // HELPERS
    // ─────────────────────────────────────────────────────────────────

    /**
     * Returns [timeStart, timeEnd] for a given slot.
     * Falls back to sensible defaults if not set by doctor.
     */
    private String[] getSlotTimes(PrescriptionMedicine pm, String slot) {
        switch (slot.toUpperCase()) {
            case "MORNING":
                return new String[]{
                        pm.getMorningTimeStart()   != null ? pm.getMorningTimeStart()   : "07:00",
                        pm.getMorningTimeEnd()     != null ? pm.getMorningTimeEnd()     : "09:00"
                };
            case "AFTERNOON":
                return new String[]{
                        pm.getAfternoonTimeStart() != null ? pm.getAfternoonTimeStart() : "12:00",
                        pm.getAfternoonTimeEnd()   != null ? pm.getAfternoonTimeEnd()   : "13:00"
                };
            case "NIGHT":
                return new String[]{
                        pm.getNightTimeStart()     != null ? pm.getNightTimeStart()     : "21:00",
                        pm.getNightTimeEnd()       != null ? pm.getNightTimeEnd()       : "22:00"
                };
            default:
                return new String[]{"00:00", "23:59"};
        }
    }

    /**
     * Auto-status based on current clock time vs slot window:
     * UPCOMING → slot hasn't started yet   (button hidden)
     * PENDING  → slot is open right now    (Mark Taken button shown)
     * MISSED   → slot window has closed    (auto-set, no button)
     */
    private String calculateAutoStatus(PrescriptionMedicine pm, String slot) {
        String[] times = getSlotTimes(pm, slot);
        LocalTime now = LocalTime.now();
        try {
            LocalTime slotStart = LocalTime.parse(times[0]);
            LocalTime slotEnd   = LocalTime.parse(times[1]);
            if (now.isBefore(slotStart)) return "UPCOMING";
            if (now.isAfter(slotEnd))    return "MISSED";
            return "PENDING";
        } catch (DateTimeParseException e) {
            return "PENDING";
        }
    }

    /**
     * When patient clicks Mark Taken:
     * ON_TIME → within the slot window
     * LATE    → after the slot window closed
     */
    private String calculateMarkStatus(String timeEnd) {
        try {
            LocalTime slotEnd = LocalTime.parse(timeEnd);
            return LocalTime.now().isAfter(slotEnd) ? "LATE" : "ON_TIME";
        } catch (DateTimeParseException e) {
            return "ON_TIME";
        }
    }

    // ─────────────────────────────────────────────────────────────────
    // DTO MAPPER
    // ─────────────────────────────────────────────────────────────────
    private MedicationTrackingResponseDto toDto(MedicationTracking t) {
        PrescriptionMedicine pm = t.getPrescriptionMedicine();
        String slot = t.getSlot() != null ? t.getSlot().toUpperCase() : "";

        String meal = "", timeStart = "", timeEnd = "";
        if (pm != null) {
            String[] times = getSlotTimes(pm, slot);
            timeStart = times[0];
            timeEnd   = times[1];
            switch (slot) {
                case "MORNING":   meal = pm.getMorningMeal()   != null ? pm.getMorningMeal()   : ""; break;
                case "AFTERNOON": meal = pm.getAfternoonMeal() != null ? pm.getAfternoonMeal() : ""; break;
                case "NIGHT":     meal = pm.getNightMeal()     != null ? pm.getNightMeal()     : ""; break;
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