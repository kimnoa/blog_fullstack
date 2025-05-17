package com.timeblock.myblog.service.implement;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.timeblock.myblog.dto.response.ResponseDto;
import com.timeblock.myblog.dto.response.search.GetPopularListResponseDto;
import com.timeblock.myblog.dto.response.search.GetRelationListResponseDto;
import com.timeblock.myblog.repository.SearchLogRepository;
import com.timeblock.myblog.repository.resultSet.GetPopularListResultSet;
import com.timeblock.myblog.repository.resultSet.GetRelationListResultSet;
import com.timeblock.myblog.service.SearchService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class SearchServiceImplement implements SearchService {

    private final SearchLogRepository searchLogRepository;

    @Override
    public ResponseEntity<? super GetPopularListResponseDto> getPopularList() {
        
        List<GetPopularListResultSet> resultSets = new ArrayList<>();
        
        try {

            resultSets = searchLogRepository.getPopularList();

        } catch (Exception e) {
            log.error(e.getMessage());
            return ResponseDto.databaseError();
        }

        return GetPopularListResponseDto.success(resultSets);
    }
    
    @Override
    public ResponseEntity<? super GetRelationListResponseDto> getRelationList(String searchWord) {
        List<GetRelationListResultSet> relativeWordList = new ArrayList<>();
        try {
            relativeWordList = searchLogRepository.getRelationList(searchWord);
        
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResponseDto.databaseError();
        }
        return GetRelationListResponseDto.success(relativeWordList);
    }
}
