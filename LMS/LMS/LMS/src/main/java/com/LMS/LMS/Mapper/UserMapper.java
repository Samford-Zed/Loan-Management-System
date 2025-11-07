package com.LMS.LMS.Mapper;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.LMS.LMS.Model.Users;



@Component
public class UserMapper {


    public UserDetails toUserDetails(Users user) {
        return User
            .withUsername(user.getUsername())
            .password(user.getPassword())
            .authorities(user.getRole())
            .build();
    }
}
