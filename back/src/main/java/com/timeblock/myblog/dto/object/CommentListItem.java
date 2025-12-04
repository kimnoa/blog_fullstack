package com.timeblock.myblog.dto.object;

import com.timeblock.myblog.repository.resultSet.GetCommentListResultSet;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CommentListItem {

    private String nickname;
    private String profileImage;
    private String content;
    private String writeDatetime;

    public CommentListItem(GetCommentListResultSet resultSet) {
        this.nickname = resultSet.getNickname();
        this.profileImage = resultSet.getProfileImage();
        this.content = resultSet.getContent();
        this.writeDatetime = resultSet.getWriteDatetime();
    }

    public static List<CommentListItem> copyList(List<GetCommentListResultSet> resultSets){
        List<CommentListItem> list = new ArrayList<>();
        for (GetCommentListResultSet resultSet : resultSets) {
            list.add(new CommentListItem(resultSet));
        }
        return list;
    }
}
