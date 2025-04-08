package com.timeblock.myblog.repository.resultSet;

public interface GetBoardResultSet {

    int getBoardNumber();
    String getTitle();
    String getContent();
    String getWriteDatetime();
    String getEmail();
    String getNickname();
    String getProfileImage();
}
