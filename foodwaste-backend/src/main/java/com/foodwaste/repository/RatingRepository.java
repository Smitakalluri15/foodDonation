package com.foodwaste.repository;

import com.foodwaste.model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {

    List<Rating> findByDonation_Id(Long donationId);

    @Query("SELECT AVG(r.score) FROM Rating r WHERE r.ratee.id = :userId")
    Double findAverageScoreByRatee_Id(@Param("userId") Long userId);

    boolean existsByDonation_IdAndRater_Id(Long donationId, Long raterId);
}
