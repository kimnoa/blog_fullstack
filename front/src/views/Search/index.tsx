import React, { useEffect, useState } from "react";
import "./style.css";
import { useNavigate, useParams } from "react-router-dom";
import { BoardListItem } from "types/interface";
import { SEARCH_PATH } from "constant";
import BoardItem from "components/BoardItem";
import Pagination from "components/Pagination/assets";
import { GetRelationListRequest, getSearchBoardListRequest } from "apis";
import { GetSearchBoardListResponseDto } from "apis/response/board";
import { usePagination } from "hooks";
import { ResponseDto } from "apis/response";
import { GetRelationListResponseDto } from "apis/response/search";

// component: 게시물 검색 화면 컴포넌트
export default function Search() {

    // state: searchWord path variable 상태

    const { searchWord } = useParams();

    // state: 페이지네이션 관련 상태
    const {
        viewList,
        viewPageList,
        currentPage,
        setCurrentPage,
        currentSection,
        setCurrentSection,
        totalSection,
        setTotalList,
    } = usePagination<BoardListItem>(5);
    // state: 이전 검색어 상태
    const [preSearchWord, setPreSearchWord] = useState<string | null>(null);

    // state: 검색 게시물 개수 상태
    const [count, setCount] = useState<number>(0);

    //  state: 검색 게시물 목록 상태
    const [searchBoardList, setSearchBoardList] = useState<BoardListItem[]>([]);

    // state: 관련 검색어 리스트 상태
    const [relativeWordList, setRelativeWordList] = useState<string[]>([]);

    // function: navigate 함수
    const navigate = useNavigate();

    // function: get search board list response 함수
    // 검색 게시물 리스트 응답 처리 함수
    const getSearchBoardListResponse = (responseBody: GetSearchBoardListResponseDto|ResponseDto|null) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === 'DBE') {
            alert('데이터베이스 오류입니다.');
            return;
        }
        if (code !== 'SU') return;

        if (!searchWord) return;
        const { searchList } = responseBody as GetSearchBoardListResponseDto;
        setTotalList(searchList);
        setCount(searchList.length);
        setPreSearchWord(searchWord);

    }

    // function: get relation list response 처리 함수
    const getRelationListResponse  = (responseBody: GetRelationListResponseDto|ResponseDto|null) => {
        
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === 'DBE') {
            alert('데이터베이스 오류입니다.');
            return;
        }
        if (code !== 'SU') return;

        const {relativeWordList} = responseBody as GetRelationListResponseDto;
        setRelativeWordList(relativeWordList);
    }
    
    // event handler: 관련 검색어 클릭 이벤트 처리
    const onRelationWordClickHandler = (word: string) => {
        navigate(SEARCH_PATH(word));
    }

    // effect: search word 상태 변경 시 실행될 함수
    useEffect(() => {
        if (!searchWord) return;
        getSearchBoardListRequest(searchWord, preSearchWord).then(getSearchBoardListResponse);
        GetRelationListRequest(searchWord).then(getRelationListResponse)
    }, [searchWord])
    
    
    // render: 게시물 검색 화면 컴포넌트 랜더링
    return (
        <div id="search-wrapper">
            <div className="search-container">
                <div className="search-header">

                    <div className="search-title-box">
                        <div className="search-title"><span className="emphasis">{searchWord}</span>{'에 대한 검색 결과'}</div>
                        <div className="search-count">{count}개</div>
                    </div>
                    <div className="search-contents-box">
                        {count === 0 ? <div className="search-contents-nothing">{'검색 결과가 없습니다.'}</div>
                         : <div className="search-contents">
                                {viewList && viewList.map(boardListItem =>
                                    <BoardItem boardListItem={boardListItem} />
                                )}
                            </div>
                        }
                        <div className="search-relation-box">
                            <div className="search-relation-card">
                                <div className="search-relation-card-container">
                                    <div className="search-relation-card-title">{'관련 검색어'}</div>
                                    <div className="search-relation-card-contents">
                                        {relativeWordList.length === 0 ? 
                                        <div className="search-relation-card-contents-nothing">{'관련 검색어가 없습니다.'}</div> : 
                                        <div className="search-relation-card-contents">
                                        {relativeWordList.map(word =>
                                            <div className="word-badge" onClick={() => onRelationWordClickHandler(word)}>{word}</div>
                                        )}
                                        </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    <div className="search-pagination-box">
                        {count !== 0  &&
                        <Pagination
                            currentSection={currentSection}
                            setCurrentSection={setCurrentSection}
                            totalSection={totalSection}
                            setCurrentPage={setCurrentPage}
                            currentPage={currentPage}
                            viewPageList={viewPageList}
                        />}
                    </div>
                    </div>
                </div>
            </div>
        </div>
    )
}