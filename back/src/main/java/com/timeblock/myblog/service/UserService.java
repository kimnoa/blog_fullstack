package com.timeblock.myblog.service;

import com.timeblock.myblog.dto.request.user.PatchNicknameRequestDto;
import com.timeblock.myblog.dto.request.user.PatchProfileImageRequestDto;

import com.timeblock.myblog.dto.response.user.GetSignInUserResponseDto;
import org.springframework.http.ResponseEntity;
import com.timeblock.myblog.dto.response.user.GetUserResponseDto;
import com.timeblock.myblog.dto.response.user.PatchNicknameResponseDto;
import com.timeblock.myblog.dto.response.user.PatchProfileImageResponseDto;


public interface UserService {
    ResponseEntity<? super GetUserResponseDto> getUser(String email);
    ResponseEntity<? super GetSignInUserResponseDto> getSignInUser(String email);
    ResponseEntity<? super PatchNicknameResponseDto> patchNickname(PatchNicknameRequestDto dto, String email);
    ResponseEntity<? super PatchProfileImageResponseDto> patchProfileImage(PatchProfileImageRequestDto dto, String email);
}
