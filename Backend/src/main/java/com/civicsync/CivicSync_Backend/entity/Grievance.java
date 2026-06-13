package com.civicsync.CivicSync_Backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore; // 👈 PASTE THIS HERE
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import org.locationtech.jts.geom.Point;
import java.time.ZonedDateTime;

@Entity
@Table(name = "grievances")
@Data
public class Grievance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "citizen_id", referencedColumnName = "id", insertable = false, updatable = false)
    private User citizen;

    @Column(name = "citizen_id", nullable = false)
    private Long citizenId;

    @Column(name = "ticket_number", nullable = false, unique = true)
    private String ticketNumber;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(name = "department_id", nullable = false)
    private Integer departmentId;

    private String priority = "MEDIUM";
    private String status = "PENDING";

    @Column(name = "district_id")
    private Integer districtId;

    @Column(name = "ward_id")
    private Integer wardId;

    @Column(name = "assigned_officer_id")
    private Long assignedOfficerId;

    @Column(name = "escalation_level")
    private Integer escalationLevel = 0;

    @Column(name = "is_duplicate")
    private Boolean isDuplicate = false;

    @JsonIgnore
    @Column(name = "location_pin", columnDefinition = "geometry(Point,4326)")
    private org.locationtech.jts.geom.Point locationPin;

    @Column(name = "sla_deadline", nullable = false)
    private ZonedDateTime slaDeadline;

    @Column(name = "citizen_photo_url")
    private String citizenPhotoUrl;

    @Column(name = "formatted_address")
    private String formattedAddress;

    @Column(name = "closure_notes", columnDefinition = "TEXT")
    private String closureNotes;

    @Column(name = "completion_photo_url")
    private String completionPhotoUrl;

    @Column(name = "created_at", insertable = false, updatable = false)
    private ZonedDateTime createdAt;

    @Column(name = "updated_at")
    private ZonedDateTime updatedAt;
}