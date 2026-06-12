package com.civicsync.CivicSync_Backend.service;

import com.civicsync.CivicSync_Backend.dto.GrievanceResponseDTO;
import com.civicsync.CivicSync_Backend.dto.GrievanceRequestDTO;
import com.civicsync.CivicSync_Backend.entity.Grievance;
import com.civicsync.CivicSync_Backend.repository.GrievanceRepository;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class GrievanceServiceImpl implements GrievanceService {

    @Autowired
    private GrievanceRepository grievanceRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Spatial coordinate system builder factory (SRID 4326 stands for WGS 84 GPS Standard)
    private final GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);

    @Override
    @Transactional
    public Grievance processAndCreateGrievance(GrievanceRequestDTO dto, Long citizenId) {
        Grievance grievance = new Grievance();
        grievance.setTitle(dto.getTitle());
        grievance.setDescription(dto.getDescription());
        grievance.setCitizenId(citizenId);

        // 1. Convert incoming double primitives into a PostGIS Spatial Object
        Point pinLocation = geometryFactory.createPoint(new Coordinate(dto.getLongitude(), dto.getLatitude()));
        grievance.setLocationPin(pinLocation);

        // 2. Resolve Department Reference Link from Code / Text
        Integer deptId = fetchDepartmentIdByName(dto.getCategory());
        grievance.setDepartmentId(deptId);

        // 3. 🗺️ GIS AUTO-ROUTING ENGINE INTERCEPTOR (ST_Contains calculation)
        Optional<Integer> resolvedWardId = grievanceRepository.autoDetectWardByCoordinates(dto.getLatitude(), dto.getLongitude());

        if (resolvedWardId.isPresent()) {
            int wardId = resolvedWardId.get();
            grievance.setWardId(wardId);

            // Auto-detect matching parent district structure
            Optional<Integer> resolvedDistrictId = grievanceRepository.autoDetectDistrictByWard(wardId);
            resolvedDistrictId.ifPresent(grievance::setDistrictId);

            // 🎛️ AUTOMATED OFFICER ALLOCATION
            Optional<Long> officerId = grievanceRepository.findAvailableFieldOfficer(wardId, deptId);
            if (officerId.isPresent()) {
                grievance.setAssignedOfficerId(officerId.get());
                grievance.setStatus("ASSIGNED");
            } else {
                grievance.setStatus("PENDING"); // Queue it up if no officer is registered to this ward
            }
        } else {
            // Out of bounds fallback values if coordinates land outside Tamil Nadu polygon test shapes
            grievance.setStatus("PENDING");
        }

        // 4. PREDICT PRIORITY & SLA TIMELINE BASED ON CATEGORY
        determinePriorityAndSla(grievance, dto.getCategory());

        // 5. GENERATE STATE-WIDE TRACEABLE TICKET NUMBER
        String cleanDeptCode = fetchDepartmentCodeById(deptId);
        String generationId = UUID.randomUUID().toString().substring(0, 5).toUpperCase();
        grievance.setTicketNumber("TN-" + cleanDeptCode + "-2026-" + generationId);

        grievance.setUpdatedAt(ZonedDateTime.now());
        return grievanceRepository.save(grievance);
    }

    // 🔌 Make sure to import your new DTO at the top if it hasn't auto-imported:
// import com.civicsync.CivicSync_Backend.dto.GrievanceResponseDTO;

    @Override
    public List<GrievanceResponseDTO> getAllGrievances() {
        // 1. Fetch raw entity records out from Postgres
        List<Grievance> rawGrievances = grievanceRepository.findAll();

        // 2. Stream and map each record into our safe mobile-friendly DTO format
        return rawGrievances.stream().map(grievance -> {
            GrievanceResponseDTO dto = new GrievanceResponseDTO();
            dto.setId(grievance.getId());
            dto.setTitle(grievance.getTitle());
            dto.setDescription(grievance.getDescription());
            dto.setTicketNumber(grievance.getTicketNumber());
            dto.setStatus(grievance.getStatus());
            dto.setPriority(grievance.getPriority());
            dto.setSlaDeadline(grievance.getSlaDeadline());
            dto.setUpvotes(0); // Temporary fallback until upvote system phase is built

            // 🗺️ EXTRACT COORDINATES FROM POSTGIS POINT OBJECT SAFELY
            if (grievance.getLocationPin() != null) {
                dto.setLongitude(grievance.getLocationPin().getX());
                dto.setLatitude(grievance.getLocationPin().getY());
            }

            // 🏢 FETCH DEPARTMENT NAME STRING FROM ID
            if (grievance.getDepartmentId() != null) {
                try {
                    String deptName = jdbcTemplate.queryForObject(
                            "SELECT name FROM departments WHERE id = ? LIMIT 1",
                            String.class,
                            grievance.getDepartmentId()
                    );
                    dto.setDepartment(deptName);
                } catch (Exception e) {
                    dto.setDepartment("General");
                }
            } else {
                dto.setDepartment("General");
            }

            return dto;
        }).toList();
    }

    // --- Helper Reference Lookup Layer Functions ---
    private Integer fetchDepartmentIdByName(String name) {
        try {
            return jdbcTemplate.queryForObject("SELECT id FROM departments WHERE name = ? LIMIT 1", Integer.class, name);
        } catch (Exception e) {
            return 1; // Fallback to Sanitation if misaligned
        }
    }

    private String fetchDepartmentCodeById(Integer id) {
        try {
            return jdbcTemplate.queryForObject("SELECT code FROM departments WHERE id = ? LIMIT 1", String.class, id);
        } catch (Exception e) {
            return "CIV";
        }
    }

    private void determinePriorityAndSla(Grievance g, String category) {
        ZonedDateTime targetTime = ZonedDateTime.now();
        if ("Water Supply".equalsIgnoreCase(category)) {
            g.setPriority("HIGH");
            g.setSlaDeadline(targetTime.plusHours(24));
        } else if ("Electricity".equalsIgnoreCase(category)) {
            g.setPriority("CRITICAL");
            g.setSlaDeadline(targetTime.plusHours(2));
        } else {
            g.setPriority("MEDIUM");
            g.setSlaDeadline(targetTime.plusHours(48)); // 48 Hour timeline default rule
        }
    }
}