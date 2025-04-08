package com.timeblock.myblog.service.implement;

import com.timeblock.myblog.dto.response.ResponseDto;
import com.timeblock.myblog.dto.response.user.GetSignInUserResponseDto;
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
    public ResponseEntity<? super GetSignInUserResponseDto> getSignInUser(String email) {

        UserEntity userEntity = null;

        try {
            userEntity = userRepository.findByEmail(email);

            if (userEntity == null) {
                return GetSignInUserResponseDto.notExistUser();
            }

        } catch (Exception e) {
            log.error("Error in getSignInUser: {}", e.getStackTrace());
            return ResponseDto.databaseError();
        }

        return GetSignInUserResponseDto.success(userEntity);
    }
}
