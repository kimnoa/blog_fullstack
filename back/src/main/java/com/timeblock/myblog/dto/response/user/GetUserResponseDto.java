package com.timeblock.myblog.dto.response.user;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.timeblock.myblog.common.ResponseCode;
import com.timeblock.myblog.common.ResponseMessage;
import com.timeblock.myblog.dto.response.ResponseDto;
import com.timeblock.myblog.entity.UserEntity;

import lombok.Getter;

@Getter
public class GetUserResponseDto extends ResponseDto{
    
    private String email;
    private String nickname;
    private String profileImage;

    private GetUserResponseDto(UserEntity userEntity){
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
        this.email = userEntity.getEmail();
        this.nickname = userEntity.getNickname();
        this.profileImage = userEntity.getProfileImage();
    }

    public static ResponseEntity<GetUserResponseDto> success(UserEntity userEntity){
        return ResponseEntity.ok(new GetUserResponseDto(userEntity));
    }

    public static ResponseEntity<ResponseDto> noExistUser() {
        ResponseDto responseBody = new ResponseDto(ResponseCode.NOT_EXIST_USER, ResponseMessage.NOT_EXIST_USER);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
    }

}
