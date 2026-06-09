package com.foodwaste.repository;

import com.foodwaste.model.Donation;
import com.foodwaste.model.DonationStatus;
import com.foodwaste.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Long> {

    List<Donation> findByDonor(User donor);

    List<Donation> findByDonorId(Long donorId);

    List<Donation> findByStatus(DonationStatus status);

    List<Donation> findByStatusAndCity(DonationStatus status, String city);

    List<Donation> findByStatusAndBestBeforeBefore(DonationStatus status, LocalDateTime cutoff);

    List<Donation> findByClaimedByNgo(User ngo);

    List<Donation> findByClaimedByNgoId(Long ngoId);

    @Query("SELECT d FROM Donation d WHERE d.status = 'AVAILABLE' ORDER BY d.createdAt DESC")
    List<Donation> findAllAvailable();

    @Query("SELECT d FROM Donation d WHERE d.status = 'AVAILABLE' AND LOWER(d.city) = LOWER(:city)")
    List<Donation> findAvailableByCity(@Param("city") String city);

    Long countByDonorId(Long donorId);

    Long countByDonorIdAndStatus(Long donorId, DonationStatus status);

    Long countByStatus(DonationStatus status);

    @Query("SELECT d.city, COUNT(d) FROM Donation d WHERE d.city IS NOT NULL AND d.city <> '' GROUP BY d.city")
    List<Object[]> countDonationsByCity();

    @Query("SELECT d.status, COUNT(d) FROM Donation d GROUP BY d.status")
    List<Object[]> countDonationsByStatus();
}
