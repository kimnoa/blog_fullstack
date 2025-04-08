package com.timeblock.myblog.repository;

import com.timeblock.myblog.entity.CommentEntity;
import com.timeblock.myblog.repository.resultSet.GetCommentListResultSet;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<CommentEntity, Integer> {

    @Query(value =
            "SELECT \n" +
            "    U.nickname as nickname,\n" +
            "    U.profile_image as profileImage,\n" +
            "    C.write_datetime as writeDatetime,\n" +
            "    C.content as content\n" +
            "FROM comment as C\n" +
            "INNER JOIN user as U\n" +
            "ON C.user_email = U.email\n" +
            "WHERE C.board_number = ?1\n" +
            "ORDER BY writeDatetime DESC",
            nativeQuery = true)
    List<GetCommentListResultSet> getCommentList(int boardNumber);

    @Transactional
    void deleteByBoardNumber(Integer boardNumber);
}
