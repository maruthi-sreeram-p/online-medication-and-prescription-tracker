package com.health.medicare.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegistrationRequestDto {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Role is required")
    private String role; // DOCTOR, PATIENT, STAFF

    // Common optional fields
    private String phone;

    // Doctor specific
    private String specialization;
    private String hospitalName;
    private String licenseNumber;

    // Patient specific
    private Integer age;
    private String gender;
    private String bloodGroup;

    // Staff specific
    private String staffRole;
    private String shift;
}