import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import "./style.css";
import { BoardListItem, User } from "types/interface";
import defaultProfileImage from 'assets/image/default-profile-image.png';
import ExampleProfileImage from 'assets/image/default-profile-image_kirby.png'
import { useNavigate, useParams } from "react-router-dom";
import { latestBoardListMock } from "mocks";
import BoardItem from "components/BoardItem";
import { BOARD_PATH, BOARD_WRITE_PATH, USER_PATH } from "constant";
import { useLoginUserStore } from "stores";

// component: 유저 화면 컴포넌트
export default function UserPage() {

    // state: user email path variable 상태 //
    const {userEmail} = useParams();
    // state: 마이페이지 여부 상태 //
    const [isMyPage, setIsMyPage] = useState<boolean>(true);
    // state: 로그인 유저 상태 //
    const {loginUser} = useLoginUserStore();
    

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
        const [changeNickname, setChangeNickname] = useState<string>('');
        // state: 프로필 이미지 상태 //
        const [profileImage, setProfileImage] = useState<string|null>(null);

        // event handler: 프로필 박스 클릭 이벤트 처리 //
        const onProfileBoxClickHandler = () => {
            if (!isMyPage) return;
            if (!ImageInputRef.current) return;
            ImageInputRef.current.click();
        }

        // event handler: 닉네임 수정 버튼 클릭 이벤트 처리 //
        const onNicknameEditButtonClickHandler = () =>{
            setChangeNickname(nickname);
            setIsChangeNickname(!isChangeNickname);
        }


        // event handler: 프로필 이미지 변경 이벤트 처리 //
        const onProfileImageChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            if (!event.target.files || event.target.files.length === 0) return;
            const file = event.target.files[0];
            setProfileImage(URL.createObjectURL(file));
        }

        // event handler: 닉네임 변경 이벤트 처리 //
        const onNicknameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            setNickname(event.target.value);
        }
        

        // effect: email path variable 변경 시 실행될 함수 //
        useEffect(()=>{
            if (!userEmail) return;
            setNickname('longer nickname');
            setProfileImage(ExampleProfileImage);
            
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
                        <div className="user-top-info-email">{'email@email.com'}</div>
                    </div>
                </div>
            </div>
        );
    };

    // component: 유저 화면 하단 컴포넌트
    const UserBottom = () => {
       
        // state: 게시물 목록 개수 상태 //
        const [postListCount, setPostListCount] = useState<number>(2);

        // state: 게시물 리스트 상태 (임시)
        const [userBoardList, setUserBoardList] = useState<BoardListItem[]>([]);

        // event handler: 사이드 카드 클릭 이벤트 처리 //
        const onSideCardClickHandler = () => {
            if (isMyPage) navigate(BOARD_PATH() + '/' + BOARD_WRITE_PATH());
            else if (loginUser) navigate(USER_PATH(loginUser.email));
        }


        // effect: user email path variable 변경될 때마다 실행할 함수
        useEffect(() => {
            setUserBoardList(latestBoardListMock);
            setPostListCount(latestBoardListMock.length);
            console.log(postListCount);
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
                            {userBoardList.map(boardListItem=><BoardItem boardListItem={boardListItem} />)}
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
                    <div className="user-bottom-pagination-box"></div>

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