// React
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";

import "./style.css";

// hook
import usePagination from "hooks/pagination.hook";

// store
import { useLoginUserStore } from "stores";

// API and Types
import { 
    fileUploadRequest, 
    getUserBoardListRequest, 
    getUserRequest, 
    patchNicknameRequest, 
    patchProfileImageRequest 
} from "apis";
import { 
    GetUserResponseDto, 
    PatchNicknameResponseDto, 
    PatchProfileImageResponseDto
} from "apis/response/user";
import { ResponseDto } from "apis/response";
import { 
    PatchNicknameRequestDto, 
    PatchProfileImageRequestDto 
} from "apis/request/user";
import { GetUserBoardListResponseDto } from "apis/response/board";

// const and enum
import { BOARD_PATH, BOARD_WRITE_PATH, MAIN_PATH, USER_PATH } from "constant";
import ResponseCode from "types/enum/resopnse-code.enum";

// interface
import { BoardListItem, User } from "types/interface";

// 컴포넌트
import BoardItem from "components/BoardItem";

// 이미지
import defaultProfileImage from 'assets/image/default-profile-image.png';
import ExampleProfileImage from 'assets/image/default-profile-image_kirby.png';

// mock
import { latestBoardListMock } from "mocks";
import Pagination from "components/Pagination/assets";


// component: 유저 화면 컴포넌트
export default function UserPage() {

    // state: user email path variable 상태 //
    const {userEmail} = useParams();
    // state: 마이페이지 여부 상태 //
    const [isMyPage, setIsMyPage] = useState<boolean>(true);
    // state: 로그인 유저 상태 //
    const {loginUser} = useLoginUserStore();
    // state: cookie 상태 //
    const [cookies, setCookies] = useCookies();
    

    // function: 네비게이트 함수 //
    const navigate = useNavigate();
    

    // component: 유저 화면 상단 컴포넌트
    const UserTop = ()=> {

        // state: 이미지 파일 input ref 상태 //
        const ImageInputRef = useRef<HTMLInputElement|null>(null);
        // state: 닉네임 상태 //
        const [nickname, setNickname] = useState<string>('');
        // state: 닉네임 변경 여부 상태 //
        const [isChangeNickname, setIsChangeNickname] = useState<boolean>(false);
        // state: 변경된 닉네임 상태 //
        // const [changeNickname, setChangeNickname] = useState<string>('');
        // state: 프로필 이미지 상태 //
        const [profileImage, setProfileImage] = useState<string|null>(null);

        // function: get user response 처리 함수 //
        const getUserResponse = (responseBody: GetUserResponseDto | ResponseDto | null ) => {
            if (!responseBody) return;
            const {code} = responseBody;
            if (code == 'NU') alert('존재하지 않는 유저입니다.');
            if (code === 'DBE') alert('데이터베이스 오류입니다.');
            if (code !== 'SU') {
                navigate(MAIN_PATH());
                return;
            }

            const {email, nickname, profileImage} = responseBody as GetUserResponseDto;
            setNickname(nickname);
            setProfileImage(profileImage);
            const isMyPage = email === loginUser?.email;
            setIsMyPage(isMyPage);
        }

        // function: file upload response 처리 함수 //
        const fileUploadResponse = (profileImage: string | null) => {
            if(!profileImage || !cookies.accessToken ) return;

            const requestBody: PatchProfileImageRequestDto = {profileImage};
            patchProfileImageRequest(requestBody, cookies.accessToken).then(patchProfileImageResponse);
        }

        // function: patch profile image response 함수 //
        const patchProfileImageResponse = (responseBody: PatchProfileImageResponseDto| ResponseDto| null) =>{
            if (!responseBody) return;
            const { code } = responseBody;
            if (code === 'AF') alert('인증에 실패하였습니다.'); 
            if (code === 'NU') alert('존재하지 않는 유저입니다.'); 
            if (code === 'DBE') alert('데이터베이스 오류입니다.');
            if (code !== 'SU') return;

            if (!userEmail) return;

            getUserRequest(userEmail).then(getUserResponse);
        }

        // function: patch nickname response 처리 함수 //
        const patchNicknameResponse = (responseBody: PatchNicknameResponseDto | ResponseDto | null) => {
            if (!responseBody) return;
            const { code } = responseBody;
            if (code === 'VF') alert('닉네임을을 입력해주세요.');
            if (code === 'AF') alert('인증에 실패하였습니다.'); 
            if (code === 'DN') alert('이미 사용 중인 닉네임입니다.');
            if (code === 'NU') alert('존재하지 않는 유저입니다.'); 
            if (code === 'DBE') alert('데이터베이스 오류입니다.');
            if (code !== 'SU') return;

            if (!userEmail) return;

            getUserRequest(userEmail).then(getUserResponse);
            setIsChangeNickname(false);
        }

        // event handler: 프로필 박스 클릭 이벤트 처리 //
        const onProfileBoxClickHandler = () => {
            if (!isMyPage) return;
            if (!ImageInputRef.current) return;
            ImageInputRef.current.click();
        }

        // event handler: 닉네임 수정 버튼 클릭 이벤트 처리 //
        const onNicknameEditButtonClickHandler = () =>{
            // console.log(isChangeNickname);
            // console.log(changeNickname);
            console.log(nickname);
            if (!isChangeNickname) {
                // setChangeNickname(nickname);
                setIsChangeNickname(!isChangeNickname);
                return;
            }
                if (!cookies.accessToken) return;
                const requestBody: PatchNicknameRequestDto = {
                    nickname: nickname
                }
                patchNicknameRequest(requestBody, cookies.accessToken).then(patchNicknameResponse);
            
        }


        // event handler: 프로필 이미지 변경 이벤트 처리 //
        const onProfileImageChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            if (!event.target.files || event.target.files.length === 0) return;
            const file = event.target.files[0];
            const data = new FormData();
            data.append('file', file);
            setProfileImage(URL.createObjectURL(file));

            fileUploadRequest(data).then(fileUploadResponse);
        }

        // event handler: 닉네임 변경 이벤트 처리 //
        const onNicknameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            setNickname(event.target.value);
        }
        

        // effect: email path variable 변경 시 실행될 함수 //
        useEffect(()=>{
            if (!userEmail) return;
            getUserRequest(userEmail).then(getUserResponse);
            
        },[userEmail])

        // render: 유저 화면 상단 컴포넌트 랜더링//
        return(
            <div id='user-top-wrapper'>
                <div className="user-top-container">
                    {isMyPage ? 
                    <div className="user-top-my-profile-image-box" onClick={onProfileBoxClickHandler}>
                        {profileImage !== null ?
                        <div className="user-top-profile-image" style={{backgroundImage: `url(${profileImage})`}}></div>
                        : <div className="user-top-my-profile-image-nothing-box">
                            <div className="icon-box-large">
                                <div className="icon image-box-white-icon"></div>
                            </div>
                        </div>
                        }

                        <input ref={ImageInputRef} type='file' accept="image/*" style={{display:'none'}} onChange={onProfileImageChangeHandler}/>


                    </div>
                    : <div className="user-top-profile-image-box" style={{backgroundImage: `url(${profileImage})`}}></div>
                    }
                    <div className="user-top-info-box">
                        <div className="user-top-info-nickname-box">
                            {isMyPage ? 
                                <>
                                {isChangeNickname ?
                                <input className="user-top-info-nickname-input"   type='text' size={nickname.length + 1} value={nickname} onChange={onNicknameChangeHandler}/>
                                :<div className="user-top-info-nickname">{nickname}</div>
                                }

                                <div className="icon-button" onClick={onNicknameEditButtonClickHandler}>
                                    <div className="icon edit-icon"></div>
                                </div>
                                </> 
                                : <div className="user-top-info-nickname">{nickname}</div>
                            }
                            
                        </div>
                        <div className="user-top-info-email">{userEmail}</div>
                    </div>
                </div>
            </div>
        );
    };

    // component: 유저 화면 하단 컴포넌트
    const UserBottom = () => {

        // state: 페이지네이션 상태 //
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
       
        // state: 게시물 목록 개수 상태 //
        const [postListCount, setPostListCount] = useState<number>(2);

        // state: 게시물 리스트 상태 (임시)
        //const [userBoardList, setUserBoardList] = useState<BoardListItem[]>([]);


        // function: get user board list response 처리 함수 //
        const getUserBoardListResponse = (responseBody: GetUserBoardListResponseDto | ResponseDto | null) => {
            if (!responseBody) return;
            const { code } = responseBody;
            if (code === 'NU') {
                alert('존재하지 않는 유저입니다.');
                navigate(MAIN_PATH());
                return;
            }
            if (code === 'DBE') alert('데이터베이스 오류입니다.');
            if (code !== 'SU') return;

            const {userBoardList} = responseBody as GetUserBoardListResponseDto;
            setTotalList(userBoardList);
            setPostListCount(userBoardList.length);
        }

        // event handler: 사이드 카드 클릭 이벤트 처리 //
        const onSideCardClickHandler = () => {
            if (isMyPage) navigate(BOARD_PATH() + '/' + BOARD_WRITE_PATH());
            else if (loginUser) navigate(USER_PATH(loginUser.email));
        }


        // effect: user email path variable 변경될 때마다 실행할 함수
        useEffect(() => {
            //setUserBoardList(latestBoardListMock);
            //setPostListCount(latestBoardListMock.length);
            if (!userEmail) return;
            getUserBoardListRequest(userEmail).then(getUserBoardListResponse);


        }, [userEmail]);

        // render: 유저 화면 하단 컴포넌트 랜더링
        return (
            <div id="user-bottom-wrapper">
                <div className="user-bottom-container">
                    <div className="user-bottom-title-box">
                        <div className="user-bottom-title-text">{isMyPage ? '내 게시물 ' : '게시물 '}<span className="emphasis">{postListCount === 0 ? '' : postListCount}</span></div>
                    </div>
                    <div className="user-bottom-contents-box">
                        {postListCount === 0 ?
                        <div className="user-bottom-contents-nothing">{'게시물이 없습니다'}</div>
                        : <div className="user-bottom-contents">
                            {viewList.map(boardListItem=><BoardItem boardListItem={boardListItem} key={boardListItem.boardNumber} />)}
                        </div>
                        }
                        <div className="user-bottom-side box">
                            <div className="user-bottom-side-card" onClick={onSideCardClickHandler}>
                                <div className="user-bottom-side-container">
                                    {isMyPage ?
                                    <>
                                    <div className="icon-box">
                                        <div className="icon edit-icon"></div>
                                    </div>
                                    <div className="user-bottom-side-text">{'글쓰기'}</div>
                                    </>
                                    : <>
                                    <div className="user-bottom-side-text">{'내 게시물로 이동'}</div>
                                    <div className="icon-box">
                                    <div className="icon arrow-right-icon"></div>
                                    </div>
                                    </>
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="user-bottom-pagination-box">
                    {postListCount !== 0  &&
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
        );
    };
    
    // render: 유저 화면 컴포넌트 랜더링
    return (
    <div >
        <UserTop/>
        <UserBottom/>

    </div>)
}