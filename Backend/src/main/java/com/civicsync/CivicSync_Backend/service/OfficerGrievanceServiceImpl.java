package com.civicsync.CivicSync_Backend.service;

import com.civicsync.CivicSync_Backend.dto.OfficerScorecardDTO;
import com.civicsync.CivicSync_Backend.dto.OfficerTaskResponseDTO;
import com.civicsync.CivicSync_Backend.entity.Grievance;
import com.civicsync.CivicSync_Backend.entity.OfficerPerformanceMetrics;
import com.civicsync.CivicSync_Backend.exception.ResourceNotFoundException;
import com.civicsync.CivicSync_Backend.repository.GrievanceRepository;
import com.civicsync.CivicSync_Backend.repository.OfficerMetricsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OfficerGrievanceServiceImpl implements OfficerGrievanceService {

    private final GrievanceRepository grievanceRepository;
    private final OfficerMetricsRepository officerMetricsRepository;
    private final FileStorageService fileStorageService;

    public OfficerGrievanceServiceImpl(GrievanceRepository grievanceRepository, 
                                       OfficerMetricsRepository officerMetricsRepository, 
                                       FileStorageService fileStorageService) {
        this.grievanceRepository = grievanceRepository;
        this.officerMetricsRepository = officerMetricsRepository;
        this.fileStorageService = fileStorageService;
    }

    @Override
    public List<OfficerTaskResponseDTO> getAssignedTasks(Long officerId) {
        List<Grievance> grievances = grievanceRepository.findByAssignedOfficerIdAndStatusIn(
                officerId, Arrays.asList("ASSIGNED", "IN_PROGRESS", "REOPENED_BY_CITIZEN"));
        return grievances.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public List<OfficerTaskResponseDTO> getHistoryLogs(Long officerId) {
        List<Grievance> grievances = grievanceRepository.findByAssignedOfficerIdAndStatusIn(
                officerId, Arrays.asList("RESOLVED", "CLOSED"));
        return grievances.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public OfficerScorecardDTO getScorecard(Long officerId) {
        OfficerPerformanceMetrics metrics = officerMetricsRepository.findByOfficerId(officerId)
            .orElseGet(() -> {
                OfficerPerformanceMetrics m = new OfficerPerformanceMetrics();
                m.setOfficerId(officerId);
                return m;
            });

        OfficerScorecardDTO dto = new OfficerScorecardDTO();
        dto.setTotalHandled(metrics.getTotalHandled());
        dto.setSlaCompliance(metrics.getSlaCompliance());
        dto.setReopenedRate(metrics.getReopenedRate());
        dto.setWarningLevel(metrics.getWarningLevel());
        return dto;
    }

    @Override
    @Transactional
    public void updateGrievanceStatus(Long grievanceId, Long officerId, String status, String closureNotes, MultipartFile completionProof) {
        Grievance grievance = grievanceRepository.findById(grievanceId)
            .orElseThrow(() -> new ResourceNotFoundException("Grievance not found with ID: " + grievanceId));

        if (grievance.getAssignedOfficerId() == null || !grievance.getAssignedOfficerId().equals(officerId)) {
            throw new RuntimeException("Unauthorized: Officer not assigned to this grievance");
        }

        grievance.setStatus(status);
        if (closureNotes != null && !closureNotes.isEmpty()) {
            grievance.setClosureNotes(closureNotes);
        }

        if (completionProof != null && !completionProof.isEmpty()) {
            String photoUrl = fileStorageService.uploadFile(completionProof);
            grievance.setCompletionPhotoUrl(photoUrl);
        }

        grievanceRepository.save(grievance);

        if ("RESOLVED".equalsIgnoreCase(status) || "CLOSED".equalsIgnoreCase(status)) {
            OfficerPerformanceMetrics metrics = officerMetricsRepository.findByOfficerId(officerId)
                .orElseGet(() -> {
                    OfficerPerformanceMetrics newMetrics = new OfficerPerformanceMetrics();
                    newMetrics.setOfficerId(officerId);
                    return newMetrics;
                });
            metrics.setTotalHandled(metrics.getTotalHandled() + 1);
            officerMetricsRepository.save(metrics);
        }
    }

    private OfficerTaskResponseDTO mapToDTO(Grievance g) {
        OfficerTaskResponseDTO dto = new OfficerTaskResponseDTO();
        dto.setId(g.getId());
        dto.setTicketNumber(g.getTicketNumber());
        dto.setTitle(g.getTitle());
        dto.setDescription(g.getDescription());
        dto.setStatus(g.getStatus());
        dto.setPriority(g.getPriority());
        dto.setFormattedAddress(g.getFormattedAddress());
        
        if (g.getLocationPin() != null) {
            dto.setLatitude(g.getLocationPin().getY());
            dto.setLongitude(g.getLocationPin().getX());
        }
        
        if (g.getSlaDeadline() != null) {
            dto.setSlaDeadline(g.getSlaDeadline().toLocalDateTime());
        }
        
        dto.setCitizenPhotoUrl(g.getCitizenPhotoUrl());
        return dto;
    }
}
