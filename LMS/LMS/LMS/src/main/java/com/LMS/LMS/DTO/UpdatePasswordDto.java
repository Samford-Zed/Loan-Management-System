package com.LMS.LMS.DTO;

public record UpdatePasswordDto(
	    String oldPassword,
	    String newPassword
	) {}