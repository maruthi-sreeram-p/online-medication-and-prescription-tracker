package com.health.medicare.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Stored as String because AI service sends user_id as String
    @Column(name = "user_id", nullable = false, length = 50)
    private String userId;

    @Column(name = "user_message", nullable = false, columnDefinition = "TEXT")
    private String userMessage;

    @Column(name = "bot_reply", nullable = false, columnDefinition = "TEXT")
    private String botReply;

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;
}
