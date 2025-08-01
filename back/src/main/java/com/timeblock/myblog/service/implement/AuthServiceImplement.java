package com.timeblock.myblog.service.implement;

import com.timeblock.myblog.dto.request.auth.SignInRequestDto;
import com.timeblock.myblog.dto.request.auth.SignUpRequestDto;
import com.timeblock.myblog.dto.response.ResponseDto;
import com.timeblock.myblog.dto.response.auth.SignInResponseDto;
import com.timeblock.myblog.dto.response.auth.SignUpResponseDto;
import com.timeblock.myblog.entity.UserEntity;
import com.timeblock.myblog.provider.JwtProvider;
import com.timeblock.myblog.repository.UserRepository;
import com.timeblock.myblog.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

// description: 유저 테이블에 데이터를 넣는 기능을 구현해야 함.

@Service
@RequiredArgsConstructor //final로 된 필수 필드에 대해서 생성자를 만듦.
@Slf4j
public class AuthServiceImplement implements AuthService {

    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;

    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public ResponseEntity<? super SignUpResponseDto> signUp(SignUpRequestDto dto) {

        try {

            //# 중복 이메일/닉네임/전화번호 검사

            String email = dto.getEmail();
            boolean existedEmail = userRepository.existsByEmail(email);
            if (existedEmail) return SignUpResponseDto.duplicateEmail();

            String nickname = dto.getNickname();
            boolean existedNickname = userRepository.existsByNickname(nickname);
            if (existedNickname) return SignUpResponseDto.duplicateNickname();

            String telNumber = dto.getTelNumber();
            boolean existedTelNumber = userRepository.existsByTelNumber(telNumber);
            if (existedTelNumber) return SignUpResponseDto.duplicateTelNumber();


            String password = dto.getPassword();
            String encodedPassword = passwordEncoder.encode(password);
            dto.setPassword(encodedPassword);


            UserEntity userEntity = new UserEntity(dto);
            userRepository.save(userEntity); //# 데이터베이스 저장

        }
        catch (Exception exception){
            log.error(exception.getMessage());
//            exception.printStackTrace();
            return ResponseDto.databaseError();
        }

        return SignUpResponseDto.success();
    }

    @Override
    public ResponseEntity<? super SignInResponseDto> signIn(SignInRequestDto dto) {

        String token = null;

        try{
            String email = dto.getEmail();
            UserEntity userEntity = userRepository.findByEmail(email);
            if (userEntity == null) return SignInResponseDto.signInFail();

            String password = dto.getPassword();
            String encodedPassword = userEntity.getPassword();
            boolean isMatched = passwordEncoder.matches(password, encodedPassword);
            if (!isMatched) return SignInResponseDto.signInFail();

            token = jwtProvider.create(email);

    } catch (Exception exception){
        log.error(exception.getMessage());
//        exception.printStackTrace();
        return ResponseDto.databaseError();
    }
        return SignInResponseDto.success(token);
    }
}
