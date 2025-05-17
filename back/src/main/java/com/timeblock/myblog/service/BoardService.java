package com.timeblock.myblog.service;

import com.timeblock.myblog.dto.request.board.PatchBoardRequestDto;
import com.timeblock.myblog.dto.request.board.PostBoardRequestDto;
import com.timeblock.myblog.dto.request.board.PostCommentRequestDto;
import com.timeblock.myblog.dto.response.board.*;
import org.springframework.http.ResponseEntity;

public interface BoardService {
    ResponseEntity<? super GetBoardResponseDto> getBoard(int boardNumber);
    ResponseEntity<? super GetFavoriteListResponseDto> getFavoriteList(int boardNumber);
    ResponseEntity<? super GetCommentListResponseDto> getCommentList(int boardNumber);
    ResponseEntity<? super GetLatestBoardListResponseDto> getLatestBoardList();
    ResponseEntity<? super GetTop3BoardListResponseDto> getTop3BoardList();
    ResponseEntity<? super GetSearchBoardListResponseDto> getSearchBoardList(String searchWord, String preSearchWord);
    ResponseEntity<? super PostBoardResponseDto> postBoard(PostBoardRequestDto dto, String email);
    ResponseEntity<? super PostCommentResponseDto> postComment(int boardNumber, PostCommentRequestDto dto, String email);
    ResponseEntity<? super PutFavoriteResponseDto> putFavorite(int boardNumber, String email);
    ResponseEntity<? super PatchBoardResponseDto> patchBoard(PatchBoardRequestDto dto, int boardNumber, String email);
    ResponseEntity<? super IncreaseViewCountResponseDto> increaseViewCount(int boardNumber);
    ResponseEntity<? super DeleteBoardResponseDto> deleteBoard(int boardNumber, String email);

}
