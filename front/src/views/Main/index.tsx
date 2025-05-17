import React, { useEffect, useState } from "react";
import "./style.css";
import Top3Item from "components/Top3Item";
import Board from "types/interface/board.interface";
import { BoardListItem } from "types/interface";
import { top3BoardListMock } from "mocks";
import BoardItem from "components/BoardItem";
import { SEARCH_PATH } from "constant";
import { Navigate, useNavigate } from "react-router-dom";
import { get } from "http";
import { getLatestBoardListRequest, getPopularListRequest, getTop3BoardListRequest } from "apis";
import { GetLatestBoardListResponseDto, GetTop3BoardListResponseDto } from "apis/response/board";
import { ResponseDto } from "apis/response";
import { usePagination } from "hooks";
import Pagination from "components/Pagination/assets";
import { GetPopularListResponseDto } from "apis/response/search";

// component: 메인 화면 컴포넌트
export default function Main() {

    // function: 네비게이트 함수
    const navigate = useNavigate();

    // component: 메인 화면 상단 컴포넌트
    const MainTop = () => {

        // state: 주간 top3 게시물 리스트 상태
        const [top3BoardList, setTop3BoardList] = useState<BoardListItem[]>([]);

        // function: get top 3 board list response 처리 함수
        const getTop3BoardListResponse = (responseBody: GetTop3BoardListResponseDto|ResponseDto|null) => {
            if (!responseBody) return;
            const { code } = responseBody;
            if (code === 'DBE') alert('데이터베이스 오류입니다.');
            if (code !== 'SU') return;

            const { top3List } = responseBody as GetTop3BoardListResponseDto;
            setTop3BoardList(top3List);
        }
        // effect: 첫 마운트 시 주간 top3 게시물 리스트 상태 초기화 함수
        useEffect(() => {
            getTop3BoardListRequest().then(getTop3BoardListResponse);
        }, []);
        // render: 메인 화면 상단 컴포넌트 랜더링
        return (
            <div id="main-top-wrapper">
                <div className="main-top-container">
                    <div className="main-top-intro">{"Noah's blog에서 \n 다양한 내용을 기록해보세요."}</div>
                    <div className="main-top-contents-box">
                        <div className="main-top-contents-title">{""}</div>
                        <div className="main-top-contents">
                            {top3BoardList.map(top3ListItem => <Top3Item top3ListItem={top3ListItem} />)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    // component: 메인 화면 하단 컴포넌트
    const MainBottom = () => {

        // state: 페이지네이션 관련 상태
        const {
        viewList,
        currentPage,
        setCurrentPage,
        viewPageList,
        currentSection,
        setCurrentSection,
        totalSection,
        setTotalList,
        } = usePagination<BoardListItem>(5);

        // state: 최근 게시물 리스트 상태
        const [currentBoardList, setCurrentBoardList] = useState<BoardListItem[]>([]);
        // state: 인기 검색어 리스트 상태
        const [popularKeywordList, setPopularKeywordList] = useState<string[]>([]);

        // function: get latest board list response 처리 함수
        const getLatestBoardListResponse = (responseBody: GetLatestBoardListResponseDto|ResponseDto|null) => {
            if (!responseBody) return;
            const { code } = responseBody;
            if (code === 'DBE') alert('데이터베이스 오류입니다.');
            if (code !== 'SU') return;

            const { latestList } = responseBody as GetLatestBoardListResponseDto;
            
            setTotalList(latestList);
        }

        // function: get popular list response 처리 함수
        const getPopularListResponse = (responseBody: GetPopularListResponseDto|ResponseDto|null) => {
            if (!responseBody) return;
            const { code } = responseBody;
            if (code === 'DBE') alert('데이터베이스 오류입니다.');
            if (code !== 'SU') return;
            const { popularList } = responseBody as GetPopularListResponseDto;
            setPopularKeywordList(popularList);
        }
        // event handler: 인기 검색어 클릭 이벤트 처리
        const onPopularClickWord = (word: string) => {
            navigate(SEARCH_PATH(word));
        }
        // effect : 첫 마운트 시 실행될 함수
        useEffect(() => {
            getLatestBoardListRequest().then(getLatestBoardListResponse);  
            getPopularListRequest().then(getPopularListResponse);
        }
        , []);
        // render: 메인 화면 하단 컴포넌트 랜더링
        return (
            <div id="main-bottom-wrapper">
                <div className="main-bottom-container">
                    <div className="main-bottom-title"> {"최신 게시물"}</div>
                    <div className="main-bottom-contents-box">
                        <div className="main-bottom-current-contents">
                            {viewList.map(boardListItem => <BoardItem boardListItem={boardListItem}/>)}
                        </div>
                        <div className="main-bottom-popular-box">
                            <div className="main-bottom-popular-card">
                                <div className="main-bottom-popular-card-box">
                                    <div className="main-bottom-popular-card-title" >{"인기 검색어"}</div>
                                    <div className="main-bottom-popular-card-contents">
                                        {popularKeywordList.map(word => <div className="word-badge">{word}</div>)}

                                    </div>
                                </div>
                            </div>     
                        </div>
                    </div>
                    <div className="main-bottom-pagination-box">
                        {/* Pagination에 대한 props */}
                        <Pagination
                            currentSection={currentSection}
                            setCurrentSection={setCurrentSection}
                            totalSection={totalSection}
                            setCurrentPage={setCurrentPage}
                            currentPage={currentPage}
                            viewPageList={viewPageList}
                        />
                    </div>
                </div>   
                <h1>메인 화면 하단</h1>
            </div>
        );
    }
    // render: 메인 화면 컴포넌트 랜더링
    return <div>
        <MainTop />
        <MainBottom />
    </div>;
}