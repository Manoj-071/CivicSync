package com.civicsync.CivicSync_Backend.controller;

import com.civicsync.CivicSync_Backend.dto.GrievanceRequestDTO;
import com.civicsync.CivicSync_Backend.dto.GrievanceResponseDTO;
import com.civicsync.CivicSync_Backend.entity.Grievance;
import com.civicsync.CivicSync_Backend.service.GrievanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/grievances")
@CrossOrigin(origins = "*") // Allows local phone, emulator, and dashboards to talk to this endpoint
public class GrievanceController {

    // 🔌 Connect directly to our Smart Business Logic layer instead of the raw database repo
    @Autowired
    private GrievanceService grievanceService;

    // 📩 1. LIVE COMPLAINT BROADCAST WITH AI ROUTING & GIS PARSING
    // 🔌 Import at the top: import java.util.Map;

    @PostMapping
    public ResponseEntity<?> createGrievance(@RequestBody GrievanceRequestDTO dto) {
        Long citizenId = 1L;

        // 🚀 ROUTE: Directly pass execution to your high-performance PostGIS routing engine!
        Grievance savedGrievance = grievanceService.processAndCreateGrievance(dto, citizenId);

        // 🎯 FIX: Return a clean, safe Key-Value Data Map instead of the raw spatial entity
        return ResponseEntity.ok(Map.of(
                "message", "Grievance lodged successfully into Tamil Nadu State systems!",
                "ticketNumber", savedGrievance.getTicketNumber(),
                "status", savedGrievance.getStatus(),
                "id", savedGrievance.getId()
        ));
    }

    // 📬 2. GET ALL COMPLAINTS: Fetches real-time spatial records for map dashboards
    // 🔌 Import at top: import org.springframework.web.bind.annotation.GetMapping;
// 🔌 Import at top: import com.civicsync.CivicSync_Backend.dto.GrievanceResponseDTO;

    @GetMapping
    public ResponseEntity<List<GrievanceResponseDTO>> getAllGrievances() {
        // 🚀 Returns clean, safe JSON payload structures containing lat/lng values
        return ResponseEntity.ok(grievanceService.getAllGrievances());
    }
}