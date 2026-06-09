package com.foodwaste.service;

import com.foodwaste.model.Donation;
import com.foodwaste.model.DonationStatus;
import com.foodwaste.repository.DonationRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@Slf4j
public class ExpiryScheduler {

    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private EmailService emailService;

    // Runs at 2:00 AM daily
    @Scheduled(cron = "0 0 2 * * *")
    @Transactional
    public int markExpiredDonations() {
        log.info("Starting scheduled job: markExpiredDonations");
        LocalDateTime now = LocalDateTime.now();
        List<Donation> expiredDonations = donationRepository
                .findByStatusAndBestBeforeBefore(DonationStatus.AVAILABLE, now);

        int count = 0;
        for (Donation donation : expiredDonations) {
            donation.setStatus(DonationStatus.EXPIRED);
            donationRepository.save(donation);
            count++;

            try {
                emailService.sendDonationExpiredToDonor(donation);
            } catch (Exception e) {
                log.error("Failed to send expiry email for donation ID: {}", donation.getId(), e);
            }
        }

        log.info("Expired {} donations", count);
        return count;
    }
}
