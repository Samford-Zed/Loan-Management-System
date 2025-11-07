package com.LMS.LMS.Util;



import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

	private static final String SECRET_KEY = "H5rT7k5G0hF2mPZqV8vM4w9aJ3pD1eLk2xYb0cQ1sR0=";


    private static Key getKey() {
        try {
            byte[] keyBytes = java.util.Base64.getDecoder().decode(SECRET_KEY);
            return Keys.hmacShaKeyFor(keyBytes);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid Base64 SECRET_KEY in LMS: " + e.getMessage());
        }
    }



    public static String generateToken(String accountNumber) {
        long currentTimeMillis = System.currentTimeMillis();
        long expirationTime = currentTimeMillis + 1000 * 60 * 5; // 5 min

        Map<String, Object> claims = new HashMap<>();
        claims.put("role", "LMS");
        claims.put("accountNumber", accountNumber);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(accountNumber)
                .setIssuedAt(new Date(currentTimeMillis))
                .setExpiration(new Date(expirationTime))
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }
}

