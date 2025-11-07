package com.LMS.LMS.Service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    @Autowired
    private JavaMailSender mailSender;

   
    public void sendRegistrationEmail(String toEmail, String username) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("LMS <bonnytilahun66@gmail.com>"); 
            message.setTo(toEmail);
            message.setSubject("Welcome to the LMS App!");
            message.setText("Hello " + username + ",\n\nThanks for registering!");

            mailSender.send(message);
            System.out.println("✅ Email sent to " + toEmail);
        } catch (Exception e) {
            System.err.println("❌ Failed to send email: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    public void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("LMS <bonnytilahun66@gmail.com>"); 
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            System.out.println("✅ Email sent to " + to);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    }

