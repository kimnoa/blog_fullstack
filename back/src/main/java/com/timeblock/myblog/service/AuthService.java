package com.timeblock.myblog.service;

import com.timeblock.myblog.dto.request.auth.SignInRequestDto;
import com.timeblock.myblog.dto.request.auth.SignUpRequestDto;
import com.timeblock.myblog.dto.response.auth.SignInResponseDto;
import com.timeblock.myblog.dto.response.auth.SignUpResponseDto;
import org.springframework.http.ResponseEntity;

public interface AuthService {

    ResponseEntity<? super SignUpResponseDto> signUp(SignUpRequestDto dto);

    ResponseEntity<? super SignInResponseDto> signIn(SignInRequestDto dto);



}
