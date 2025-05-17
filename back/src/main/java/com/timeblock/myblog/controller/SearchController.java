package com.timeblock.myblog.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.timeblock.myblog.dto.response.search.GetPopularListResponseDto;
import com.timeblock.myblog.dto.response.search.GetRelationListResponseDto;
import com.timeblock.myblog.service.SearchService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/search")
@RequiredArgsConstructor
public class SearchController {
    
    private final SearchService searchService;

    @GetMapping("/popular-list")
    public ResponseEntity<? super GetPopularListResponseDto> getPopularList() {
        return searchService.getPopularList();
    }

    @GetMapping("/relation-list/{searchWord}")
    
    public ResponseEntity<? super GetRelationListResponseDto> getRelationList(
            @PathVariable("searchWord") String searchWord
        ) {
        if (searchWord == null) {
            return ResponseEntity.badRequest().body("Search word cannot be null or empty");
        }
        return searchService.getRelationList(searchWord);
    }
}
