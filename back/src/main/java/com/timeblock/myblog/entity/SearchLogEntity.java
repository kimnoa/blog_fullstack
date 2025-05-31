package com.timeblock.myblog.entity;

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
@Entity(name = "search_log") //name 지정 없으면 class명 따라감
@Table(name = "search_log")
public class SearchLogEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int sequence;
    private String searchWord;
    private String relationWord;
    private int relation;

    public SearchLogEntity(String searchWord, String relationWord, int relation) {
        this.searchWord = searchWord;
        this.relationWord = relationWord;
        this.relation = relation;
    }

}
