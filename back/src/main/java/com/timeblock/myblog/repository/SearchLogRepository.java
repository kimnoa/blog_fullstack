package com.timeblock.myblog.repository;

import com.timeblock.myblog.entity.SearchLogEntity;
import com.timeblock.myblog.repository.resultSet.GetPopularListResultSet;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface SearchLogRepository extends JpaRepository<SearchLogEntity, Integer> {

    @Query(
        value = 
        "SELECT search_word, COUNT(search_word) AS search_count " +
        "FROM search_log " +
        "WHERE relation IS FALSE " +
        "GROUP BY search_word " +
        "ORDER BY search_count DESC " +
        "LIMIT 15",
        nativeQuery = true
    )
    List<GetPopularListResultSet> getPopularList();
}
