package com.LMS.LMS.Reppo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.LMS.LMS.Model.Users;



@Repository
public interface UserReppo extends JpaRepository<Users,Integer>{
	Users findByUsername(String username);
	Users findByEmail(String email);
}
