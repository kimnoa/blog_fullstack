package com.timeblock.myblog.repository;

import com.timeblock.myblog.entity.BoardListViewEntity;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BoardListViewRepository extends JpaRepository<BoardListViewEntity, Integer> {

    List<BoardListViewEntity> findByOrderByWriteDatetimeDesc();
    // 특정 기간 동안 작성된 게시글 중에서 좋아요 수, 조회수, 댓글 수, 날짜를 기준으로 내림차순 정렬
    List<BoardListViewEntity> findTop3ByWriteDatetimeGreaterThanOrderByFavoriteCountDescViewCountDescCommentCountDescWriteDatetimeDesc(String writeDatetime);
}
