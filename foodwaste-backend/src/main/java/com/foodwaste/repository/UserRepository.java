package com.foodwaste.repository;

import com.foodwaste.model.Role;
import com.foodwaste.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Boolean existsByEmail(String email);

    Boolean existsByPhone(String phone);

    List<User> findByRole(Role role);

    List<User> findByRoleAndIsActiveTrue(Role role);

    List<User> findTop10ByRoleAndIsActiveTrueOrderByPointsDesc(Role role);

    @Query("SELECT u.name, COUNT(d), u.points FROM User u LEFT JOIN u.donations d WHERE u.role = 'DONOR' GROUP BY u.id, u.name, u.points ORDER BY u.points DESC")
    List<Object[]> findTopDonors(Pageable pageable);
}
