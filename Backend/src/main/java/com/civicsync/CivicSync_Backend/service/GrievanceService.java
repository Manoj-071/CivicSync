package com.civicsync.CivicSync_Backend.service;

import com.civicsync.CivicSync_Backend.dto.GrievanceResponseDTO;
import com.civicsync.CivicSync_Backend.entity.Grievance;
import com.civicsync.CivicSync_Backend.dto.GrievanceRequestDTO;
import java.util.List;

public interface GrievanceService {
    Grievance processAndCreateGrievance(GrievanceRequestDTO dto, Long citizenId);
    List<GrievanceResponseDTO> getAllGrievances();
}