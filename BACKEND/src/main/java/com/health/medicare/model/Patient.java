package com.health.medicare.model;

import com.health.medicare.security.Role;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "patients")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String phone;
    private Integer age;
    private String gender;
    private String bloodGroup;
    private String address;           // ← THIS WAS MISSING
    private String emergencyContact;  // ← THIS WAS MISSING

    @Enumerated(EnumType.STRING)
    private Role role = Role.PATIENT;

    @Column(nullable = false)
    private String status = "ACTIVE";
}