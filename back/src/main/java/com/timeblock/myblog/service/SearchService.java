package com.timeblock.myblog.service;

import org.springframework.http.ResponseEntity;

import com.timeblock.myblog.dto.response.search.GetPopularListResponseDto;
import com.timeblock.myblog.dto.response.search.GetRelationListResponseDto;

public interface SearchService {
    
    ResponseEntity<? super GetPopularListResponseDto> getPopularList();
    ResponseEntity<? super GetRelationListResponseDto> getRelationList(String searchWord);
}
