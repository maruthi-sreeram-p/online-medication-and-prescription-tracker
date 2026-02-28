package com.health.medicare.model;

import com.health.medicare.security.Role;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "staff")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Staff {

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
    private String staffRole; // Nurse, Assistant, etc.
    private String hospitalName;
    private String shift; // MORNING, EVENING, NIGHT

    @Enumerated(EnumType.STRING)
    private Role role = Role.STAFF;

    @Column(nullable = false)
    private String status = "ACTIVE"; // ACTIVE, INACTIVE
}