package com.LMS.LMS.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.LMS.LMS.DTO.ForgotPasswordRequestDto;
import com.LMS.LMS.DTO.ResetPasswordDto;
import com.LMS.LMS.Mapper.UserMapper;
import com.LMS.LMS.Model.Users;
import com.LMS.LMS.Reppo.UserReppo;




@Service
public class UserService {

    @Autowired
    private UserReppo reppo;

    @Autowired
    private AuthenticationManager am;

    @Autowired
    private JwtService jwtService;
    
    @Autowired
   MailService mailService;
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Autowired
    UserMapper userMapper;
    
    @Autowired
    private CreditScoreService creditScoreService;


    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    /** Register */
    public Users register(Users user) {
        if (reppo.findByUsername(user.getUsername()) != null) {
            throw new RuntimeException("Username already exists");
        }
        user.setFullName(user.getFullName());
        user.setPassword(encoder.encode(user.getPassword()));
        if (user.getRole() == null || user.getRole().isBlank()) {
            user.setRole("ROLE_USER");
        }

        if (user.getEmail() != null && !user.getEmail().isBlank()) {
            mailService.sendRegistrationEmail(user.getEmail(), user.getUsername());
        }

        Users savedUser = reppo.save(user);

        // ✅ Create initial credit score for new user
        creditScoreService.getOrCreateCreditScore(savedUser);

        return savedUser;
    }



    /** Login */
    public String verify(Users user) {
        Authentication auth = am.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
        );
        if (auth.isAuthenticated()) {
            return jwtService.generateToken(user.getUsername());
        }
        return "fail";
    }
    
    public ResponseEntity<String> handleForgotPassword(ForgotPasswordRequestDto requestDto) {
        Users user = reppo.findByEmail(requestDto.email());  // use instance
        if (user == null) {
            // Always return success to avoid revealing accounts
            return ResponseEntity.ok("✅ If the account exists, a reset link has been sent");
        }

        String token = jwtService.generateToken(user.getUsername());
        String resetLink = "token =  " + token;

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("LMS <your_email@gmail.com>");  // match spring.mail.username
            message.setTo(user.getEmail());
            message.setSubject("🔐 Reset Your Password");
            message.setText("Use this token to reset your password:\n" + resetLink +
                            "\n\nThis token expires in 1 hr.");

            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();  // log but do not fail
        }

        return ResponseEntity.ok("✅ If the account exists, a reset link has been sent");
    }


    public ResponseEntity<String> handleResetPassword(ResetPasswordDto resetDto) {
        try {
            String token = resetDto.token();
            String username = jwtService.extractUsername(token);

            Users user = reppo.findByUsername(username);  // use instance
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ User not found");
            }

            UserDetails userDetails = userMapper.toUserDetails(user);

            if (!jwtService.validateToken(token, userDetails)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("❌ Token is invalid or expired");
            }

            user.setPassword(encoder.encode(resetDto.newPassword()));
            reppo.save(user);  // use instance

            return ResponseEntity.ok("✅ Password reset successful");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("❌ Invalid or expired token");
        }
    }

}
