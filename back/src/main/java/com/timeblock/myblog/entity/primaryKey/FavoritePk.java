package com.timeblock.myblog.entity.primaryKey;

import java.io.Serializable;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FavoritePk implements Serializable {
    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "board_number")
    private int boardNumber;


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof FavoritePk)) return false;

        FavoritePk that = (FavoritePk) o;

        if (boardNumber != that.boardNumber) return false;
        return userEmail != null ? userEmail.equals(that.userEmail) : that.userEmail == null;
    }
    @Override
    public int hashCode() {
        int result = userEmail != null ? userEmail.hashCode() : 0;
        result = 31 * result + boardNumber;
        return result;
    }

}
