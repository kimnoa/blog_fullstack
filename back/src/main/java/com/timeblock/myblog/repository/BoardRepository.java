package com.timeblock.myblog.repository;

import com.timeblock.myblog.entity.BoardEntity;
import com.timeblock.myblog.repository.resultSet.GetBoardResultSet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface BoardRepository extends JpaRepository<BoardEntity, Integer> {

    boolean existsByBoardNumber(Integer boardNumber);
    BoardEntity findByBoardNumber(Integer boardNumber);

    @Query(
            value = "SELECT " +
            "B.board_number as boardNumber, "+
            "B.title as title, " +
            "B.content as content, " +
            "B.write_datetime as writeDatetime, " +
            "B.writer_email as email, "+
            "U.nickname as nickname,  "+
            "U.profile_image as profileImage "+
            "FROM board as B "+
            "INNER JOIN user as U "+
            "ON B.writer_email = U.email "+
            "WHERE board_number = ?1" ,
            nativeQuery = true
    )
    GetBoardResultSet getBoard(Integer boardNumber);
}
