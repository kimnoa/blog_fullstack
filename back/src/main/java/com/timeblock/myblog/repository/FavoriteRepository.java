package com.timeblock.myblog.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

// import com.timeblock.myblog.dto.response.board.GetFavoriteListResponseDto;
import com.timeblock.myblog.entity.FavoriteEntity;
import com.timeblock.myblog.entity.primaryKey.FavoritePk;
import com.timeblock.myblog.repository.resultSet.GetFavoriteListResultSet;

import jakarta.transaction.Transactional;

@Repository
public interface FavoriteRepository extends JpaRepository<FavoriteEntity, FavoritePk> {

    FavoriteEntity findByBoardNumberAndUserEmail(Integer boardNumber, String userEmail);

    @Query(value =
            "SELECT" +
                    "    U.email as email,\n" +
                    "    U.nickname as nickname,\n" +
                    "    U.profile_image\n" +
                    "FROM favorite as F\n" +
                    "INNER JOIN user as U\n" +
                    "ON F.user_email = U.email\n" +
                    "WHERE F.board_number = ?1",
            nativeQuery = true
    )
    List<GetFavoriteListResultSet> getFavoriteList(Integer boardNumber);

    @Transactional
    void deleteByBoardNumber(Integer boardNumber);
}
