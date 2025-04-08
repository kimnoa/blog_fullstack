package com.timeblock.myblog.controller;

import com.timeblock.myblog.dto.request.auth.SignInRequestDto;
import com.timeblock.myblog.dto.request.auth.SignUpRequestDto;
import com.timeblock.myblog.dto.response.auth.SignInResponseDto;
import com.timeblock.myblog.dto.response.auth.SignUpResponseDto;
import com.timeblock.myblog.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    @PostMapping("/sign-up")
    public ResponseEntity<? super SignUpResponseDto> signUp(
            @RequestBody @Valid SignUpRequestDto requestBody
    ) {
        ResponseEntity<? super SignUpResponseDto> response = authService.signUp(requestBody);
        return response;

        //#controller에는 비즈니스 로직을 적는 것이 아니다.
        //#주로 service에서 작성해야 함.
    }

    @PostMapping("/sign-in")
    public ResponseEntity<? super SignInResponseDto> signIn(
            @RequestBody @Valid SignInRequestDto requestBody
    ) {
        ResponseEntity<? super SignInResponseDto> response = authService.signIn(requestBody);
        return response;
    }
}
