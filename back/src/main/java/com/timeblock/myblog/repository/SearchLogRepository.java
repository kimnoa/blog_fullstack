package com.timeblock.myblog.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.timeblock.myblog.entity.SearchLogEntity;
import com.timeblock.myblog.repository.resultSet.GetPopularListResultSet;
import com.timeblock.myblog.repository.resultSet.GetRelationListResultSet;

@Repository
public interface SearchLogRepository extends JpaRepository<SearchLogEntity, Integer> {

    @Query(
        value = 
        "SELECT search_word, COUNT(search_word) AS search_count " +
        "FROM search_log " +
        "WHERE relation = 0 " +
        "GROUP BY search_word " +
        "ORDER BY search_count DESC " +
        "LIMIT 15",
        nativeQuery = true
    )
    List<GetPopularListResultSet> getPopularList();

    @Query(
        value = 
        "SELECT relation_word as search_word, count(relation_word) as count " +
        "FROM search_log " +
        "WHERE search_word like '%검색어%' and relation = 1 " +
        "GROUP BY relation_word " +
        "ORDER BY count DESC" +
        "LIMIT 15",
        nativeQuery = true
    )
    List<GetRelationListResultSet> getRelationList(String searchWord);
}
