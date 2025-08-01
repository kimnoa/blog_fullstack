package com.timeblock.myblog.controller;

import com.timeblock.myblog.dto.request.user.PatchNicknameRequestDto;
import com.timeblock.myblog.dto.request.user.PatchProfileImageRequestDto;
import com.timeblock.myblog.dto.response.user.GetSignInUserResponseDto;
import com.timeblock.myblog.dto.response.user.GetUserResponseDto;
import com.timeblock.myblog.dto.response.user.PatchNicknameResponseDto;
import com.timeblock.myblog.dto.response.user.PatchProfileImageResponseDto;
import com.timeblock.myblog.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{email}")
    public ResponseEntity<? super GetUserResponseDto> getUser(
        @PathVariable("email") String email) 
    {
        ResponseEntity<? super GetUserResponseDto> response = userService.getUser(email);
        return response;
    }

    @GetMapping("")
    public ResponseEntity<? super GetSignInUserResponseDto> getSignInUser(
            @AuthenticationPrincipal // JwtAuthenticationFilter에서 email 꺼내오기
            String email
    )
    {
        ResponseEntity<? super GetSignInUserResponseDto> response = userService.getSignInUser(email);
        return response;
    }

    @PatchMapping("/nickname")
    public ResponseEntity<? super PatchNicknameResponseDto> patchNickname(
            @RequestBody @Valid PatchNicknameRequestDto requestBody,
            @AuthenticationPrincipal String email
    ) {
        ResponseEntity<? super PatchNicknameResponseDto> response = userService.patchNickname(requestBody, email);
        return response;
    }

    @PatchMapping("/profile-image")
    public ResponseEntity<? super PatchProfileImageResponseDto> patchProfileImage(
            @RequestBody @Valid PatchProfileImageRequestDto requestBody,
            @AuthenticationPrincipal String email
    ) {
        ResponseEntity<? super PatchProfileImageResponseDto> response = userService.patchProfileImage(requestBody,email);
        return response;
    }
}
