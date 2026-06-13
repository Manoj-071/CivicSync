package com.civicsync.CivicSync_Backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class OfficerTaskResponseDTO {
    private Long id;
    private String ticketNumber;
    private String title;
    private String description;
    private String status;
    private String priority;
    private String formattedAddress;
    private Double latitude;
    private Double longitude;
    private LocalDateTime slaDeadline;
    private String citizenPhotoUrl;
}
