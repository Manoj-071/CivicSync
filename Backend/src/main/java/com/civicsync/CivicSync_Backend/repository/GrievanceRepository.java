package com.civicsync.CivicSync_Backend.repository;

import com.civicsync.CivicSync_Backend.entity.Grievance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface GrievanceRepository extends JpaRepository<Grievance, Long> {

    // 🚥 ADD THIS FOR TIMELINE & OPERATION QUEUES (Fixes the compiler error)
    List<Grievance> findByAssignedOfficerIdAndStatusIn(Long assignedOfficerId, Collection<String> statuses);

    // 🎯 PostGIS Boundary Intersect Lookups: Finds which ward polygon fully contains the coordinate point
    @Query(value = "SELECT id FROM tn_wards WHERE ST_Contains(geom, ST_SetSRID(ST_Point(:lng, :lat), 4326)) LIMIT 1", nativeQuery = true)
    Optional<Integer> autoDetectWardByCoordinates(@Param("lat") double lat, @Param("lng") double lng);

    @Query(value = "SELECT district_id FROM tn_local_bodies lb JOIN tn_zones z ON z.local_body_id = lb.id JOIN tn_wards w ON w.zone_id = z.id WHERE w.id = :wardId LIMIT 1", nativeQuery = true)
    Optional<Integer> autoDetectDistrictByWard(@Param("wardId") int wardId);

    // 🎛️ Dynamic Allocation Engine: Matches ticket to the Field Officer assigned to this ward/department with the lowest active workload
    @Query(value = "SELECT id FROM enterprise_users WHERE role = 'FIELD_OFFICER' AND ward_id = :wardId AND department_id = :deptId " +
            "ORDER BY (SELECT COUNT(*) FROM grievances WHERE assigned_officer_id = enterprise_users.id AND status IN ('PENDING', 'ASSIGNED', 'IN_PROGRESS')) ASC LIMIT 1", nativeQuery = true)
    Optional<Long> findAvailableFieldOfficer(@Param("wardId") int wardId, @Param("deptId") int deptId);
}