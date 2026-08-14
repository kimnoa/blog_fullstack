package com.timeblock.myblog.entity;

import java.time.LocalDateTime;

import com.timeblock.myblog.dto.request.board.PostCommentRequestDto;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "comment")
@Table(name = "comment")
public class CommentEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int commentNumber;
    private String content;
    private LocalDateTime writeDatetime;
    private String userEmail;
    private int boardNumber;

    public CommentEntity(PostCommentRequestDto dto, int boardNumber, String email) {

        // Date now = Date.from(Instant.now());
        // SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        // String writeDatetime = simpleDateFormat.format(now);

        this.content = dto.getContent();
        this.writeDatetime = LocalDateTime.now();
        this.userEmail = email;
        this.boardNumber = boardNumber;
    }

}
