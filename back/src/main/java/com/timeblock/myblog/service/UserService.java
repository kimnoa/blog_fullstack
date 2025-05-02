package com.timeblock.myblog.service;

// import com.timeblock.myblog.dto.response.ResponseDto;
import com.timeblock.myblog.dto.response.user.GetSignInUserResponseDto;
import org.springframework.http.ResponseEntity;

public interface UserService {

    ResponseEntity<? super GetSignInUserResponseDto> getSignInUser(String email);

}
