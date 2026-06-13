package com.civicsync.CivicSync_Backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "officer_performance_metrics")
public class OfficerPerformanceMetrics {

    @Id
    @Column(name = "officer_id")
    private Long officerId;

    @Column(name = "total_complaints_handled")
    private int totalHandled = 0;

    @Column(name = "resolved_complaints_count")
    private int resolvedComplaintsCount = 0;

    @Column(name = "sla_compliant_count")
    private int slaCompliantCount = 0;

    @Column(name = "reopened_complaints_count")
    private int reopenedComplaintsCount = 0;

    @Column(name = "false_closure_warnings")
    private int warningLevel = 0;

    @Column(name = "citizen_satisfaction_sum")
    private BigDecimal citizenSatisfactionSum = BigDecimal.ZERO;

    @Column(name = "average_resolution_seconds")
    private long averageResolutionSeconds = 0;

    // --- HELPER CALCULATIONS FOR THE DTOs ---

    public double getSlaCompliance() {
        if (totalHandled == 0) return 100.0;
        return ((double) slaCompliantCount / totalHandled) * 100.0;
    }

    public double getReopenedRate() {
        if (totalHandled == 0) return 0.0;
        return ((double) reopenedComplaintsCount / totalHandled) * 100.0;
    }

    // --- STANDARD GETTERS AND SETTERS ---
    public Long getOfficerId() { return officerId; }
    public void setOfficerId(Long officerId) { this.officerId = officerId; }

    public int getTotalHandled() { return totalHandled; }
    public void setTotalHandled(int totalHandled) { this.totalHandled = totalHandled; }

    public int getWarningLevel() { return warningLevel; }
    public void setWarningLevel(int warningLevel) { this.warningLevel = warningLevel; }

    // (Add remaining structural getters/setters for standard fields here...)
}