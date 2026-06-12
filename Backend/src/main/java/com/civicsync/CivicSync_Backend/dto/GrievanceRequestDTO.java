package com.civicsync.CivicSync_Backend.dto;

import lombok.Data;

@Data
public class GrievanceRequestDTO {
    private String title;
    private String description;
    private String category; // e.g., "Sanitation", "Electricity"
    private double latitude;
    private double longitude;
}