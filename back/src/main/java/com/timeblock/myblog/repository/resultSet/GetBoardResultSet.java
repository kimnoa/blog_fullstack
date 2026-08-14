package com.timeblock.myblog.repository.resultSet;

import java.time.LocalDateTime;

public interface GetBoardResultSet {

    int getBoardNumber();
    String getTitle();
    String getContent();
    LocalDateTime getWriteDatetime();
    String getEmail();
    String getNickname();
    String getProfileImage();
}
