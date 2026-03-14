package com.foodwaste.repository;

import com.foodwaste.model.PickupStatus;
import com.foodwaste.model.PickupTask;
import com.foodwaste.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PickupRepository extends JpaRepository<PickupTask, Long> {

    List<PickupTask> findByNgo(User ngo);

    List<PickupTask> findByNgoId(Long ngoId);

    List<PickupTask> findByVolunteer(User volunteer);

    List<PickupTask> findByVolunteerId(Long volunteerId);

    List<PickupTask> findByStatus(PickupStatus status);

    List<PickupTask> findByVolunteerIsNullAndStatus(PickupStatus status);

    Optional<PickupTask> findByDonationId(Long donationId);

    Long countByVolunteerIdAndStatus(Long volunteerId, PickupStatus status);
}
