import React, {ChangeEvent, useEffect, useRef, useState} from "react";
import "./style.css";
import FavoriteItem from "../../../components/FavoriteItem";
import {CommentListItem, FavoriteListItem} from "../../../types/interface";
import {commentListMock} from "../../../mocks";
import CommentItem from "../../../components/CommentItem";
import Pagination from "../../../components/Pagination/assets";

import defaultProfileImage from 'assets/image/default-profile-image.png';
import {useLoginUserStore} from "../../../stores";
import {useNavigate, useParams} from "react-router-dom";
import {BOARD_PATH, BOARD_UPDATE_PATH, MAIN_PATH, USER_PATH} from "../../../constant";
import Board from "../../../types/interface/board.interface";
import GetBoardResponseDto from "../../../apis/response/board/get-board.response.dto";
import {ResponseDto} from "../../../apis/response";
import {
    deleteBoardRequest,
    getBoardRequest,
    getCommentListRequest,
    getFavoriteListRequest,
    increaseViewCountRequest, postCommentRequest,
    putFavoriteRequest
} from "../../../apis";
import {
    DeleteBoardResponseDto,
    GetCommentListResponseDto,
    GetFavoriteListResponseDto,
    IncreaseViewCountResponseDto, PostCommentResponseDto, PutFavoriteResponseDto
} from "../../../apis/response/board";

import dayjs from "dayjs";
import {useCookies} from "react-cookie";
import {PostCommentRequestDto} from "../../../apis/request/board";
import { usePagination } from "hooks";

// component: 게시물 상세 화면 컴포넌트
export default function BoardDetail() {

    // state: 게시물 번호 path variable 상태
    const {boardNumber} = useParams();
    // state: 로그인 유저 상태
    const {loginUser} = useLoginUserStore();
    // state: 쿠키 상태
    const [cookies, setCookies] = useCookies();

    // function: 네비게이트 함수
    const navigate = useNavigate();
    // function: increase view count response 처리 함수
    const increaseViewCountResponse = (responseBody: IncreaseViewCountResponseDto | ResponseDto | null) => {
        if(!responseBody) return;
        const {code} = responseBody;
        if(code === 'NB') alert('존재하지 않는 게시물입니다.');
        if(code === 'DBE') alert('데이터베이스 오류입니다.');
    }

    // component: 게시물 상세 상단 컴포넌트
    const BoardDetailTop = () => {

        // state: 작성자 여부 상태
        const [isWriter, setIsWriter] = useState<boolean>(false);
        // state: board 내용 상태
        const [board, setBoard] = useState<Board|null>(null);
        // state: more 버튼 상태
        const [showMore, setShowMore] = useState(false);

        // function: 작성일 포맷 변경 함수
        const getWriteDatetimeFormat = () => {
            if (!board) return;
            const date = dayjs(board.writeDatetime);
            return date.format('YYYY.MM.DD.');
        }
        // function: get board response 처리 함수
        const getBoardResponse = (responseBody: GetBoardResponseDto | ResponseDto | null) => {
            if (!responseBody) return;
            const {code} = responseBody;
            if (code === 'NB') alert('존재하지 않는 게시물입니다.');
            if (code === 'DBE') alert('데이터베이스 오류입니다.');
            if (code !== 'SU') {
                navigate(MAIN_PATH());
                return;
            }
            const board: Board = {...responseBody as GetBoardResponseDto};
            setBoard(board);

            if (!loginUser) {
                setIsWriter(false);
                return;
            }
            if (board.email === loginUser.email) {
                setIsWriter(true);
            }
        }

        // function: delete board response 처리 함수
        const deleteBoardResponse = (responseBody: DeleteBoardResponseDto | ResponseDto | null) => {
            if (!responseBody) return;
            const {code} = responseBody;
            if (code === 'VF') alert('잘못된 접근입니다.');
            if (code === 'NU') alert('존재하지 않는 유저입니다.');
            if (code === 'NB') alert('존재하지 않는게시물입니다.');
            if (code === 'AF') alert('인증에 실패하였습니다.');
            if (code === 'NP') alert('권한이 없습니다.');
            if (code === 'DBE') alert('데이터베이스 오류입니다.');
            if (code !== 'SU') return;
            navigate(MAIN_PATH());
        }

        // event handler: 닉네임 클릭 이벤트 처리
        const onNicknameClickHandler = () => {
            if (!board) return;
            navigate(USER_PATH(board.email));
        }

        // event handler: more 버튼 클릭 이벤트 처리 함수
        const onMoreButtonClickHandler = () => {
            setShowMore(!showMore);
        }

        // event handler: 수정 버튼 클릭 이벤트 처리 함수
        const onUpdateButtonClickHandler = () => {
            if(!board || !loginUser) return;
            if(board.email !== loginUser.email) return;
            navigate(BOARD_PATH() + '/' + BOARD_UPDATE_PATH(board.boardNumber));
        }

        // event handler: 삭제 버튼 클릭 이벤트 처리 함수
        const onDeleteButtonClickHandler = () => {
            if(!board || !loginUser|| !boardNumber || !cookies.accessToken) return;
            if(board.email !== loginUser.email) return;
            deleteBoardRequest(boardNumber, cookies.accessToken).then(deleteBoardResponse);
        }

        // effect: 게시물 번호 path variable이 변경될 때마다 게시물 불러오기
        useEffect(() => {

            if(!boardNumber) {
                navigate(MAIN_PATH());
                return;
            }

            getBoardRequest(boardNumber).then(getBoardResponse);

        }, [boardNumber]);


        // render: 게시물 상세 상단 컴포넌트 랜더링
        if(!board) return null;
        return (
            <div id="board-detail-top">
                <div className="board-detail-top-header">
                    <div className="board-detail-title">{board?.title}</div>
                    <div className="board-detail-top-sub-box">
                        <div className="board-detail-write-info-box">
                            <div className="board-detail-writer-profile-image" style={{backgroundImage: `url(${board?.profileImage || defaultProfileImage})`}}></div>
                            <div className="board-detail-writer-nickname" onClick={onNicknameClickHandler}>{board?.nickname}</div>
                            <div className="board-detail-info-divider">{'|'}</div>
                            <div className="board-detail-write-date">{getWriteDatetimeFormat()}</div>
                        </div>
                        {isWriter &&
                            <div className="icon-button">
                                <div className="icon more-icon" onClick={onMoreButtonClickHandler}></div>
                            </div>
                        }
                        {showMore &&
                        <div className="board-detail-more-box">
                            <div className='board-detail-update-button' onClick={onUpdateButtonClickHandler}>{'수정'}</div>
                            <div className='divider'></div>
                            <div className='board-detail-delete-button' onClick={onDeleteButtonClickHandler}>{'삭제'}</div>
                        </div>
                        }
                    </div>
                </div>
                <div className="divider"></div>
                <div className="board-detail-top-main">
                    <div className="board-detail-top-main-text">{board?.content}</div>
                    {board.boardImageList.map(image => <img className="board-detail-top-main-image" src={image} />)}
                </div>
            </div>
        )
    }

    // component:게시물 상세 하단 컴포넌트
    const BoardDetailBottom = () => {

        // state: 댓글 textarea 참조 상태
        const commentRef = useRef<HTMLTextAreaElement | null>(null);
        // state: pagination 관련 상태
        const {
            viewList,
        currentPage,
        setCurrentPage,
        viewPageList,
        currentSection,
        setCurrentSection,
        totalSection,
        setTotalList,
        } = usePagination<CommentListItem>(3);

        // state: favoriteList 상태
        const [favoriteList, setFavoriteList] = useState<FavoriteListItem[]>([]);
        // state: commentList 상태
        const [commentList, setCommentList] = useState<CommentListItem[]>([]);
        // state: 좋아요 상태
        const [isFavorite, setIsFavorite] = useState<boolean>(false);
        // state: 좋아요 리스트 보기 상태
        const [showFavorite, setShowFavorite] = useState<boolean>(false);
        // state: 댓글 리스트 보기 상태
        const [showComment, setShowComment] = useState<boolean>(false);
        // state: 댓글 상태
        const [comment, setComment] = useState<string>('');
        // state: 전체 댓글 개수 상태
        const [totalCommentCount, setTotalCommentCount] = useState<number>(0); 

        // function: get favorist list response 처리 함수
        const getFavoriteListResponse = (responseBody: GetFavoriteListResponseDto|ResponseDto|null) => {
            if(!responseBody) return;
            const {code} = responseBody;
            if(code === 'NB') alert("존재하지 않는 게시물입니다.");
            if(code === 'DBE') alert("데이터베이스 오류입니다.");
            if(code !== 'SU') return;

            const {favoriteList} = responseBody as GetFavoriteListResponseDto;
            setFavoriteList(favoriteList);

            if (!loginUser) {
                setIsFavorite(false);
                return;
            }

            const isFavorite = favoriteList.findIndex(item => item.email === loginUser.email) !==-1;
            setIsFavorite(isFavorite);
            // console.log({isFavorite, loginUser});
        }

        // function: get comment list response 처리 함수
        const getCommentListResponse = (responseBody: GetCommentListResponseDto|ResponseDto|null) => {
            if(!responseBody) return;
            const {code} = responseBody;
            if(code === 'NB') alert("존재하지 않는 게시물입니다.");
            if(code === 'DBE') alert("데이터베이스 오류입니다.");
            if(code !== 'SU') return;

            const {commentList} = responseBody as GetCommentListResponseDto;
            setCommentList(commentList);
            setTotalList(commentList);
            setTotalCommentCount(commentList.length);
        }

        // function: put favorite response 처리 함수
        const putFavoriteResponse = (responseBody: PutFavoriteResponseDto|ResponseDto|null) => {
            if (!responseBody) return;
            const {code} = responseBody;
            if(code === 'VF') alert("잘못된 접근입니다.");
            if(code === 'NU') alert("존재하지 않는 유저입니다.");
            if(code === 'NB') alert("존재하지 않는 게시물입니다.");
            if(code === 'AF') alert('인증에 실패하였습니다.');
            if(code === 'DBE') alert("데이터베이스 오류입니다.");
            if(code !== 'SU') return;

            if (!boardNumber) return;
            getFavoriteListRequest(boardNumber).then(getFavoriteListResponse);
        }

        // function: post comment response 처리 함수
        const postCommentResponse = (responseBody: PostCommentResponseDto|ResponseDto|null) => {
            if (!responseBody) return;
            const {code} = responseBody;
            if(code === 'VF') alert("잘못된 접근입니다.");
            if(code === 'NU') alert("존재하지 않는 유저입니다.");
            if(code === 'NB') alert("존재하지 않는 게시물입니다.");
            if(code === 'AF') alert('인증에 실패하였습니다.')
            if(code === 'DBE') alert("데이터베이스 오류입니다.");
            if(code !== 'SU') return;

            setComment('');

            if(!boardNumber) return;
            getCommentListRequest(boardNumber).then(getCommentListResponse);
        }

        // event handler: 좋아요 클릭 이벤트 처리
        const onFavoriteClickHandler = () => {
            console.log({boardNumber, loginUser,cookies});
            if(!boardNumber || !loginUser || !cookies.accessToken) {
                console.log("1");
                return;
            }
            putFavoriteRequest(boardNumber, cookies.accessToken).then(putFavoriteResponse);
        }

        // event handler: 좋아요 상자 보기 클릭 이벤트 처리
        const onShowFavoriteClickHandler = () => {
            setShowFavorite(!showFavorite);
        }

        // event handler: 댓글 작성 버튼 클릭 이벤트 처리
        const onCommentSubmitButtonClickHandler = () => {
            if(!comment || !boardNumber || !loginUser || !cookies.accessToken) return;
            const requestBody: PostCommentRequestDto = {content: comment};
            postCommentRequest(boardNumber, requestBody, cookies.accessToken).then(postCommentResponse);

        }

        // event handler: 댓글 상자 보기 클릭 이벤트 처리
        const onShowCommentClickHandler = () => {
            setShowComment(!showComment);
        }

        // event handler: 댓글 변경 이벤트 처리
        const onCommentChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
            setComment(event.target.value);
            if(!commentRef.current) return;
            commentRef.current.style.height = 'auto';
            commentRef.current.style.height = `${commentRef.current.scrollHeight}px`;
        }

        // effect: 게시물 번호 path variable이 변경될 때마다 좋아요 & 댓글 리스트 불러오기
        useEffect(()=>{
            if(!boardNumber) return;
            getFavoriteListRequest(boardNumber).then(getFavoriteListResponse);
            getCommentListRequest(boardNumber).then(getCommentListResponse);
        },[boardNumber]);

        // render: 게시물 상세 하단 컴포넌트 랜더링
        return (
            <div id='board-detail-bottom'>
                <div className='board-detail-bottom-button-box'>
                    <div className='board-detail-bottom-button-group'>
                        <div className='icon-button' onClick={onFavoriteClickHandler}>
                            <div className={isFavorite ? 'icon favorite-fill-icon' : 'icon favorite-light-icon'}></div>
                        </div>
                        <div className='board-detail-bottom-button-text'>{`좋아요 ${favoriteList.length}`}</div>
                        <div className='icon-button' onClick={onShowFavoriteClickHandler}>
                            <div className={showFavorite ? 'icon up-light-icon' : 'icon down-light-icon'}></div>
                        </div>
                    </div>
                    <div className='board-detail-bottom-button-group'>
                        <div className='icon-button'>
                            <div className='icon comment-icon'></div>
                        </div>
                        <div className='board-detail-bottom-button-text'>{`댓글 ${commentList.length}`}</div>
                        <div className='icon-button' onClick={onShowCommentClickHandler}>
                            <div className={showComment ? 'icon up-light-icon' : 'icon down-light-icon'}></div>
                        </div>
                    </div>
                </div>
                {showFavorite && <div className='board-detail-bottom-favorite-box'>
                    <div className='board-detail-bottom-favorite-container'>
                        <div className='board-detail-bottom-favorite-title'>{'좋아요'}<span
                            className='emphasis'>{favoriteList.length}</span></div>
                        <div className='board-detail-bottom-favorite-contents'>
                            {favoriteList.map(item => <FavoriteItem favoriteListItem={item}/>)}
                        </div>
                    </div>
                </div>
                }
                {showComment && <div className='board-detail-bottom-comment-box'>
                    <div className='board-detail-bottom-comment-container'>
                        <div className='board-detail-bottom-comment-title'>{'댓글'}<span
                            className='emphasis'>{viewList.length}</span></div>
                        <div className='board-detail-bottom-comment-list-container'>
                            {viewList.map(item => <CommentItem commentListItem={item}/>)}
                        </div>
                    </div>
                    <div className='divider'></div>
                    <div className='board-detail-bottom-comment-pagination-box'>
                        <Pagination
                            currentPage={currentPage}
                            currentSection={currentSection}
                            setCurrentPage={setCurrentPage}
                            setCurrentSection={setCurrentSection}
                            viewPageList={viewPageList}
                            totalSection={totalSection}
                        />
                    </div>
                    <div className='board-detail-bottom-comment-input-box'>
                        {loginUser !== null &&
                        <div className='board-detail-bottom-comment-input-container'>
                            <textarea ref={commentRef} className='board-detail-bottom-comment-textarea'
                                      placeholder='댓글을 작성해주세요.' value={comment} onChange={onCommentChangeHandler}/>
                            <div className='board-detail-bottom-comment-button-box'>
                                <div className={comment ? 'black-button' : 'disable-button'}
                                     onClick={onCommentSubmitButtonClickHandler}>{'댓글달기'}</div>
                            </div>
                        </div>
                        }
                    </div>
                </div>
                }
            </div>
        );

    }

    // effect: 게시물 번호 path variable이 변경될 때마다 게시물 조회수 증가
    let effectFlag = true;
    useEffect(()=>{
        if (!boardNumber) return;
        if (effectFlag) {
            effectFlag = false;
            return;
        }

        increaseViewCountRequest(boardNumber).then(increaseViewCountResponse);

    },[boardNumber]);

    // render: 게시물 상세 화면 컴포넌트 랜더링
    return (
        <div id="board-detail-wrapper">
            <div className="board-detail-container">
                <BoardDetailTop/>
                <BoardDetailBottom/>
            </div>
        </div>)
}