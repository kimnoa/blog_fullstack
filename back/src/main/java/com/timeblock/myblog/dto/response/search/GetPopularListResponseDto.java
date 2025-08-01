package com.timeblock.myblog.dto.response.search;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.ResponseEntity;

import com.timeblock.myblog.common.ResponseCode;
import com.timeblock.myblog.common.ResponseMessage;
import com.timeblock.myblog.dto.response.ResponseDto;
import com.timeblock.myblog.repository.resultSet.GetPopularListResultSet;

import lombok.Getter;

@Getter
public class GetPopularListResponseDto extends ResponseDto {
    
    private List<String> popularWordList;

    private GetPopularListResponseDto(List<GetPopularListResultSet> resultSets) {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
        
        this.popularWordList = new ArrayList<>();
        for (GetPopularListResultSet resultSet : resultSets) {
            String searchWord = resultSet.getSearchWord();
            this.popularWordList.add(searchWord);
        }
        
    }

    public static ResponseEntity<GetPopularListResponseDto> success(List<GetPopularListResultSet> resultSets) {
        return ResponseEntity.ok(new GetPopularListResponseDto(resultSets));
    }
}
