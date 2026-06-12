package com.civicsync.CivicSync_Backend.dto;

import lombok.Data;
import java.time.ZonedDateTime;

@Data
public class GrievanceResponseDTO {
    private Long id;
    private String title;
    private String description;
    private String ticketNumber;
    private String status;
    private String priority;
    private String department; // We will map the department name here
    private Double latitude;   // 🎯 Extracted primitive number for React Native
    private Double longitude;  // 🎯 Extracted primitive number for React Native
    private Integer upvotes;
    private ZonedDateTime slaDeadline;
}