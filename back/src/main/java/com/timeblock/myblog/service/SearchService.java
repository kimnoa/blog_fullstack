package com.timeblock.myblog.service;

import org.springframework.http.ResponseEntity;

import com.timeblock.myblog.dto.response.search.GetPopularListResponseDto;

public interface SearchService {
    
    ResponseEntity<? super GetPopularListResponseDto> getPopularList();
}
