package com.timeblock.myblog.service.implement;

import com.timeblock.myblog.dto.response.ResponseDto;
import com.timeblock.myblog.dto.request.user.PatchNicknameRequestDto;
import com.timeblock.myblog.dto.request.user.PatchProfileImageRequestDto;
import com.timeblock.myblog.dto.response.user.PatchNicknameResponseDto;
import com.timeblock.myblog.dto.response.user.PatchProfileImageResponseDto;

import com.timeblock.myblog.dto.response.user.GetSignInUserResponseDto;
import com.timeblock.myblog.dto.response.user.GetUserResponseDto;
import com.timeblock.myblog.entity.UserEntity;
import com.timeblock.myblog.repository.UserRepository;
import com.timeblock.myblog.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImplements implements UserService {

    private final UserRepository userRepository;

    @Override
    public ResponseEntity<? super GetUserResponseDto> getUser(String email) {
        
        UserEntity userEntity = null;

        try {
            
            userEntity = userRepository.findByEmail(email);
            if (userEntity == null) return GetUserResponseDto.noExistUser();

        } catch (Exception e) {
          log.error(e.getMessage());
          return ResponseDto.databaseError();  
        }
        
        return GetUserResponseDto.success(userEntity);
    }

    
    @Override
    public ResponseEntity<? super GetSignInUserResponseDto> getSignInUser(String email) {

        UserEntity userEntity = null;

        try {
            userEntity = userRepository.findByEmail(email);

            if (userEntity == null) {
                return GetSignInUserResponseDto.notExistUser();
            }

        } catch (Exception e) {
            log.error(e.getMessage());
            return ResponseDto.databaseError();
        }

        return GetSignInUserResponseDto.success(userEntity);
    }

    @Override
    public ResponseEntity<? super PatchNicknameResponseDto> patchNickname(PatchNicknameRequestDto dto, String email) {
        try {
            String nickname = dto.getNickname();

            UserEntity userEntity = userRepository.findByEmail(email);
            if (userEntity == null) {
                return PatchNicknameResponseDto.noExistUser();
            }

            // 닉네임 중복 체크
            boolean existedNickname = userRepository.existsByNickname(nickname);
            if (existedNickname) {
                return PatchNicknameResponseDto.duplicateNickname();
            }

            userEntity.setNickname(nickname);
            userRepository.save(userEntity);

        } catch (Exception e) {
            log.error(e.getMessage());
            return ResponseDto.databaseError();
        }
        
        return PatchNicknameResponseDto.success();
    }
    

    @Override
    public ResponseEntity<? super PatchProfileImageResponseDto> patchProfileImage(PatchProfileImageRequestDto dto, String email) {
        try {
            String profileImage = dto.getProfileImage();

            UserEntity userEntity = userRepository.findByEmail(email);
            if (userEntity == null) {
                return PatchProfileImageResponseDto.noExistUser();
            }

            userEntity.setProfileImage(profileImage);
            userRepository.save(userEntity);

        } catch (Exception e) {
            log.error(e.getMessage());
            return ResponseDto.databaseError();
        }

        return PatchProfileImageResponseDto.success();
    }
}
