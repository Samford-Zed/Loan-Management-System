package com.LMS.LMS.Service;


import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.LMS.LMS.Controller.UserPrincipal;
import com.LMS.LMS.Model.Users;
import com.LMS.LMS.Reppo.UserReppo;



@Service
public class MyUserDetailService implements UserDetailsService{
	
	@Autowired
	UserReppo userReppo;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Users user=userReppo.findByUsername(username);
		
		if(user==null) {
			throw new UsernameNotFoundException("user not Found!!!");
		}
		
		return new UserPrincipal(user);
		
	}

	

}

