package com.timeblock.myblog.repository;

import com.timeblock.myblog.entity.SearchLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
public interface SearchLogRepository extends JpaRepository<SearchLogEntity, Integer> {

}
