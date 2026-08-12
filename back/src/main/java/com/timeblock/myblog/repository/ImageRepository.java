package com.timeblock.myblog.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.timeblock.myblog.entity.ImageEntity;

import jakarta.transaction.Transactional;

public interface ImageRepository extends JpaRepository<ImageEntity, Integer> {
    List<ImageEntity> findByBoardNumber(Integer boardNumber);

    @Transactional
    void deleteByBoardNumber(Integer boardNumber);
}
