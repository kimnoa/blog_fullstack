package com.timeblock.myblog.dto.response.user;

import org.springframework.http.ResponseEntity;

import com.timeblock.myblog.common.ResponseCode;
import com.timeblock.myblog.common.ResponseMessage;
import com.timeblock.myblog.dto.response.ResponseDto;

import lombok.Getter;

@Getter
public class PatchProfileImageResponseDto extends ResponseDto {

    public PatchProfileImageResponseDto() {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
    }

    public static ResponseEntity<PatchProfileImageResponseDto> success() {
        return ResponseEntity.ok().body(new PatchProfileImageResponseDto());
    }

    public static ResponseEntity<ResponseDto> noExistUser() {
        return ResponseEntity.badRequest().body(new ResponseDto(ResponseCode.NOT_EXIST_USER, ResponseMessage.NOT_EXIST_USER));
    }
    
}
