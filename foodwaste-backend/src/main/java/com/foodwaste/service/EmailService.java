package com.foodwaste.service;

import com.foodwaste.model.Donation;
import com.foodwaste.model.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    public void sendDonationExpiredToDonor(Donation donation) {
        String email = donation.getDonor().getEmail();
        String subject = "Plateful - Donation Expired 🍂";
        String text = "Hi " + donation.getDonor().getName() + ",\n\n" +
                "Your donation listing for \"" + donation.getFoodName() + "\" has expired as of " + donation.getBestBefore() + ".\n\n" +
                "Thank you for listing it! If you have fresh food surplus, feel free to list it again.\n\n" +
                "Best regards,\nTeam Plateful 💚";

        log.info("Sending donation expiry email to donor: {} for food: {}", email, donation.getFoodName());
        sendEmail(email, subject, text);
    }

    public void sendVolunteerApproved(User volunteer) {
        String email = volunteer.getEmail();
        String subject = "Plateful - Volunteer Account Approved! 🚴";
        String text = "Hi " + volunteer.getName() + ",\n\n" +
                "Welcome to the Plateful family! Your volunteer profile has been reviewed and approved by our administrators.\n\n" +
                "You can now log in and browse open pickup tasks to help transport surplus food to local NGOs.\n\n" +
                "Thank you for being a food hero!\n\n" +
                "Best regards,\nTeam Plateful 💚";

        log.info("Sending volunteer approval email to: {}", email);
        sendEmail(email, subject, text);
    }

    public void sendDonationClaimed(Donation donation) {
        String email = donation.getDonor().getEmail();
        String subject = "Plateful - Donation Claimed! 🤝";
        String text = "Hi " + donation.getDonor().getName() + ",\n\n" +
                "Great news! Your donation for \"" + donation.getFoodName() + "\" has been claimed by the NGO \"" + donation.getClaimedByNgo().getName() + "\".\n\n" +
                "A volunteer rider will accept the task and coordinate the pickup from your address shortly.\n\n" +
                "Thank you for your kindness!\n\n" +
                "Best regards,\nTeam Plateful 💚";

        log.info("Sending donation claimed email to: {}", email);
        sendEmail(email, subject, text);
    }

    private void sendEmail(String to, String subject, String text) {
        if (mailSender == null) {
            log.info("[Email Mock] Mail sender not configured. Skipping real mail send to {}", to);
            return;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@plateful.org");
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
            log.info("Email sent successfully to {}", to);
        } catch (Exception e) {
            log.error("Failed to send email to {}", to, e);
        }
    }
}
