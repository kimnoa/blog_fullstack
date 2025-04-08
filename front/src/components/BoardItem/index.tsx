import React from "react";
import './style.css';
import {BoardListItem} from "../../types/interface";
import {useNavigate} from "react-router-dom";
import DefaultProfileImage from "../../assets/image/default-profile-image.png";

interface Props {
    boardListItem: BoardListItem
}


//  component: BoardListItem 컴포넌트//
export default function BoardListItemFunc({boardListItem}: Props) {

    //  properties
    const {boardNumber, title,content, boardTitleImage}= boardListItem;
    const {commentCount, favoriteCount, viewCount}= boardListItem;
    const {writeDatetime, writeNickname, writeProfileImage}= boardListItem;

    //  function : 네비게이트 함수
    // const navigator = useNavigate();

    //  event handler: 게시물 아이템 클릭 이벤트 처리 함수
    const onClickHandler = () => {
        // navigator(boardNumber);
    }


    //  render: BoardListItem 컴포넌트 랜더링//
    return (
        <div className='board-list-item'>
            <div className='board-list-item-main-box'>
                <div className='board-list-item-top'>
                    <div className='board-list-item-profile-box'>
                        <div className='board-list-item-profile-image' style={{backgroundImage: `url(${writeProfileImage ? writeProfileImage : DefaultProfileImage})`}}></div>

                    </div>
                    <div className='board-list-item-write-box'>
                        <div className='board-list-item-write-nickname'>{writeNickname}</div>
                        <div className='board-list-item-write-datetime'>{writeDatetime}</div>
                    </div>
                </div>
                
                <div className='board-list-item-middle'>
                    <div className='board-list-item-title'>{title}</div>
                    <div className='board-list-item-content'>{content}</div>
                </div>
                
                <div className='board-list-item-bottom'>
                    <div className='board-list-item-counts'>
                        {`댓글: ${commentCount} 좋아요: ${favoriteCount} 조회수: ${viewCount}`}
                    </div>
                </div>
            </div>
            {boardTitleImage !== null && (
                <div className='board-list-item-image-box'>
                    <div className='board-list-item-image' style={{backgroundImage: `url(${boardTitleImage})`}}></div>
                </div>
            )
            }
        </div>
    )
}