package com.LMS.LMS.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.LMS.LMS.DTO.ForgotPasswordRequestDto;
import com.LMS.LMS.DTO.ResetPasswordDto;
import com.LMS.LMS.DTO.UpdatePasswordDto;
import com.LMS.LMS.Model.Users;
import com.LMS.LMS.Reppo.UserReppo;
import com.LMS.LMS.Service.JwtService;
import com.LMS.LMS.Service.UserService;


import jakarta.servlet.http.HttpServletRequest;




@RestController
public class UserController {
	
	@Autowired
	UserService service;
	
	@Autowired
	JwtService jwtService;
	
	@Autowired
	UserReppo userReppo;
	
	@PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Users user) {
        try {
            Users savedUser = service.register(user);
            return ResponseEntity.ok(savedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }


    @PostMapping("/login")
    public String login(@RequestBody Users user) {
        return service.verify(user);
    }
    
    @PostMapping("/forgotPassword")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequestDto requestDto) {
        return service.handleForgotPassword(requestDto);
    }

    @PostMapping("/resetPassword")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordDto resetDto) {
        return service.handleResetPassword(resetDto);
    }
    
    
    @PutMapping("/updatePassword")
    public ResponseEntity<String> updatePassword(
            @RequestBody UpdatePasswordDto passwordDto,
            HttpServletRequest request) {
        try {
            String token = request.getHeader("Authorization").substring(7);
            String username = jwtService.extractUsername(token);
            Users user = userReppo.findByUsername(username);
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

            if (!encoder.matches(passwordDto.oldPassword(), user.getPassword())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("❌ Incorrect old password");
            }

            user.setPassword(encoder.encode(passwordDto.newPassword()));
            userReppo.save(user);

            return ResponseEntity.ok("✅ Password updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong");
        }
    }
}
