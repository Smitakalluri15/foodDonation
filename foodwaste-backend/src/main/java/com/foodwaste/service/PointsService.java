package com.foodwaste.service;

import com.foodwaste.model.PointsLedger;
import com.foodwaste.model.User;
import com.foodwaste.repository.PointsLedgerRepository;
import com.foodwaste.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PointsService {

    public static final int DONATION_CLAIMED = 10;
    public static final int PICKUP_COMPLETED = 5;
    public static final int FIRST_DONATION = 20;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PointsLedgerRepository pointsLedgerRepository;

    @Transactional
    public void awardPoints(User user, int delta, String reason, Long donationId) {
        if (user.getPoints() == null) {
            user.setPoints(0);
        }
        user.setPoints(user.getPoints() + delta);
        userRepository.save(user);

        PointsLedger ledger = PointsLedger.builder()
                .user(user)
                .delta(delta)
                .reason(reason)
                .relatedDonationId(donationId)
                .build();
        pointsLedgerRepository.save(ledger);
    }

    public List<PointsLedger> getHistory(Long userId) {
        return pointsLedgerRepository.findByUser_IdOrderByCreatedAtDesc(userId);
    }
}
