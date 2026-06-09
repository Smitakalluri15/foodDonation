package com.foodwaste.repository;

import com.foodwaste.model.PointsLedger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PointsLedgerRepository extends JpaRepository<PointsLedger, Long> {
    List<PointsLedger> findByUser_IdOrderByCreatedAtDesc(Long userId);
}
