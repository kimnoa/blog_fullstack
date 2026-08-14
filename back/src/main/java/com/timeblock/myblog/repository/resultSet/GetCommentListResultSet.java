package com.timeblock.myblog.repository.resultSet;

import java.time.LocalDateTime;

public interface GetCommentListResultSet {
    String getNickname();
    String getProfileImage();
    String getContent();
    LocalDateTime getWriteDatetime();
}
