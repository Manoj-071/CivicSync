package com.civicsync.CivicSync_Backend.controller;

import com.civicsync.CivicSync_Backend.dto.OfficerScorecardDTO;
import com.civicsync.CivicSync_Backend.dto.OfficerTaskResponseDTO;
import com.civicsync.CivicSync_Backend.entity.User;
import com.civicsync.CivicSync_Backend.service.OfficerGrievanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/officer")
@PreAuthorize("hasRole('FIELD_OFFICER')")
public class OfficerGrievanceController {

    private final OfficerGrievanceService officerGrievanceService;

    public OfficerGrievanceController(OfficerGrievanceService officerGrievanceService) {
        this.officerGrievanceService = officerGrievanceService;
    }

    @GetMapping("/grievances/assigned")
    public ResponseEntity<List<OfficerTaskResponseDTO>> getAssignedTasks(@AuthenticationPrincipal User user) {
        List<OfficerTaskResponseDTO> tasks = officerGrievanceService.getAssignedTasks(user.getId());
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/grievances/history")
    public ResponseEntity<List<OfficerTaskResponseDTO>> getHistoryLogs(@AuthenticationPrincipal User user) {
        List<OfficerTaskResponseDTO> history = officerGrievanceService.getHistoryLogs(user.getId());
        return ResponseEntity.ok(history);
    }

    @GetMapping("/scorecard")
    public ResponseEntity<OfficerScorecardDTO> getScorecard(@AuthenticationPrincipal User user) {
        OfficerScorecardDTO scorecard = officerGrievanceService.getScorecard(user.getId());
        return ResponseEntity.ok(scorecard);
    }

    @PutMapping(value = "/grievances/{id}/status", consumes = {"multipart/form-data"})
    public ResponseEntity<Void> updateGrievanceStatus(
            @PathVariable("id") Long grievanceId,
            @AuthenticationPrincipal User user,
            @RequestParam("status") String status,
            @RequestParam(value = "closure_notes", required = false) String closureNotes,
            @RequestPart(value = "completionProof", required = false) MultipartFile completionProof) {
        
        officerGrievanceService.updateGrievanceStatus(grievanceId, user.getId(), status, closureNotes, completionProof);
        return ResponseEntity.ok().build();
    }
}
