package com.timeblock.myblog.dto.response.board;

import java.util.List;

import org.springframework.http.ResponseEntity;

import com.timeblock.myblog.common.ResponseCode;
import com.timeblock.myblog.common.ResponseMessage;
import com.timeblock.myblog.dto.object.BoardListItem;
import com.timeblock.myblog.dto.response.ResponseDto;
import com.timeblock.myblog.entity.BoardListViewEntity;

import lombok.Getter;

@Getter
public class GetUserBoardListResponseDto extends ResponseDto {
    
    private List <BoardListItem> userBoardList;

    private GetUserBoardListResponseDto(List<BoardListViewEntity> BoardListViewEntities){
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
        this.userBoardList = BoardListItem.getList(BoardListViewEntities);
    }

    public static ResponseEntity<GetUserBoardListResponseDto> success(List<BoardListViewEntity> BoardListViewEntities){
        GetUserBoardListResponseDto result = new GetUserBoardListResponseDto(BoardListViewEntities);
        return ResponseEntity.ok().body(result);
    }

    public static ResponseEntity<ResponseDto> noExistUser() {
        return ResponseEntity.badRequest().body(new ResponseDto(ResponseCode.NOT_EXIST_USER, ResponseMessage.NOT_EXIST_USER));
    }
}
