package com.timeblock.myblog.service.implement;

import com.timeblock.myblog.dto.request.board.PatchBoardRequestDto;
import com.timeblock.myblog.dto.request.board.PostBoardRequestDto;
import com.timeblock.myblog.dto.request.board.PostCommentRequestDto;
import com.timeblock.myblog.dto.response.ResponseDto;
import com.timeblock.myblog.dto.response.board.*;
import com.timeblock.myblog.entity.BoardEntity;
import com.timeblock.myblog.entity.BoardListViewEntity;
import com.timeblock.myblog.entity.CommentEntity;
import com.timeblock.myblog.entity.FavoriteEntity;
import com.timeblock.myblog.entity.ImageEntity;
import com.timeblock.myblog.entity.SearchLogEntity;
import com.timeblock.myblog.repository.*;
import com.timeblock.myblog.repository.resultSet.GetBoardResultSet;
import com.timeblock.myblog.repository.resultSet.GetCommentListResultSet;
import com.timeblock.myblog.repository.resultSet.GetFavoriteListResultSet;
import com.timeblock.myblog.service.BoardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BoardServiceImplement implements BoardService {

    private final UserRepository userRepository;
    private final BoardRepository boardRepository;
    private final ImageRepository imageRepository;
    private final CommentRepository commentRepository;
    private final FavoriteRepository favoriteRepository;
    private final BoardListViewRepository boardListViewRepository;
    private final SearchLogRepository searchLogRepository;

    @Override
    public ResponseEntity<? super GetBoardResponseDto> getBoard(int boardNumber) {

        GetBoardResultSet resultSet = null;
        List<ImageEntity> ImageEntities = new ArrayList<>();

        try {
            resultSet = boardRepository.getBoard(boardNumber);
            if(resultSet == null) return GetBoardResponseDto.noExistBoard();

            ImageEntities = imageRepository.findByBoardNumber(boardNumber);


        } catch (Exception exception){
                log.error(exception.getMessage());
                return ResponseDto.databaseError();
            }

        return GetBoardResponseDto.success(resultSet, ImageEntities);
    }

    @Override
    public ResponseEntity<? super GetFavoriteListResponseDto> getFavoriteList(int boardNumber) {
        List<GetFavoriteListResultSet> resultSets;

        try {
            boolean existedBoard = boardRepository.existsByBoardNumber(boardNumber);
            if(!existedBoard) return GetFavoriteListResponseDto.noExistBoard();
            resultSets = favoriteRepository.getFavoriteList(boardNumber);

        } catch (Exception exception){
            log.error(exception.getMessage());
            return ResponseDto.databaseError();
        }
        return GetFavoriteListResponseDto.success(resultSets);
    }

    @Override
    public ResponseEntity<? super GetCommentListResponseDto> getCommentList(int boardNumber) {
        List<GetCommentListResultSet> resultSets;

        try {
            boolean existedBoard = boardRepository.existsByBoardNumber(boardNumber);
            if(!existedBoard) return GetCommentListResponseDto.noExistBoard();
            resultSets = commentRepository.getCommentList(boardNumber);

        } catch (Exception exception){
            log.error(exception.getMessage());
            return ResponseDto.databaseError();
        }
        return GetCommentListResponseDto.success(resultSets);
    }
    
    @Override
    public ResponseEntity<? super GetLatestBoardListResponseDto> getLatestBoardList() {
        List<BoardListViewEntity> boardListViewEntities = new ArrayList<>();

        try {
            boardListViewEntities = boardListViewRepository.findByOrderByWriteDatetimeDesc();

        } catch (Exception exception){
            log.error(exception.getMessage());
            return ResponseDto.databaseError();
        }
        return GetLatestBoardListResponseDto.success(boardListViewEntities);
    }
    @Override
    public ResponseEntity<? super GetTop3BoardListResponseDto> getTop3BoardList() {
        List<BoardListViewEntity> boardListViewEntities = new ArrayList<>();

        try {
            // 7일 전 날짜 구하기
            Date beforeWeek = Date.from(Instant.now().minus(7, ChronoUnit.DAYS));
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String formattedDate = dateFormat.format(beforeWeek);
            
            boardListViewEntities = boardListViewRepository.findTop3ByWriteDatetimeGreaterThanOrderByFavoriteCountDescViewCountDescCommentCountDescWriteDatetimeDesc(formattedDate);

        } catch (Exception exception){
            log.error(exception.getMessage());
            return ResponseDto.databaseError();
        }
        return GetTop3BoardListResponseDto.success(boardListViewEntities);
    }
 
    @Override
    public ResponseEntity<? super GetSearchBoardListResponseDto> getSearchBoardList(String searchWord, String preSearchWord) {
        List<BoardListViewEntity> boardListViewEntities = new ArrayList<>();

        try {
            if(searchWord.equals(preSearchWord)) return GetSearchBoardListResponseDto.success(boardListViewEntities);
            boardListViewEntities = boardListViewRepository.findByTitleContainsOrContentContainsOrderByWriteDatetimeDesc(searchWord, searchWord);

            SearchLogEntity searchLogEntity = new SearchLogEntity(searchWord, preSearchWord, 0 );
            searchLogRepository.save(searchLogEntity);
            
            boolean relation = preSearchWord !=null;
            if(relation) {
                SearchLogEntity relationSearchLogEntity = new SearchLogEntity(preSearchWord, searchWord, 1);
                searchLogRepository.save(relationSearchLogEntity);
            }

        } catch (Exception exception){
            log.error(exception.getMessage());
            return ResponseDto.databaseError();
        }
        return GetSearchBoardListResponseDto.success(boardListViewEntities);
    }

    @Override
    public ResponseEntity<? super GetUserBoardListResponseDto> getUserBoardList(String email) {
        List<BoardListViewEntity> boardListViewEntities = new ArrayList<>();

        try {
            // @해당 이메일이 존재하는지 확인
            boolean existedUser = userRepository.existsByEmail(email);
            if (!existedUser) {
                return GetUserBoardListResponseDto.noExistUser();
            }

            boardListViewEntities = boardListViewRepository.findByWriterEmailOrderByWriteDatetimeDesc(email);

        } catch (Exception exception) {
            log.error(exception.getMessage());
            return ResponseDto.databaseError();
        }
        return GetUserBoardListResponseDto.success(boardListViewEntities);
    }

    @Override
    public ResponseEntity<? super PostBoardResponseDto> postBoard(PostBoardRequestDto dto, String email) {

        try {
            // 받아온 email이 존재하는 지 확인
            boolean existedEmail = userRepository.existsByEmail(email);
            if(!existedEmail){
                return PostBoardResponseDto.notExistUser();
            }

            BoardEntity boardEntity = new BoardEntity(dto, email);
            boardRepository.save(boardEntity);

            int boardNumber = boardEntity.getBoardNumber();

            List<String> boardImageList = dto.getBoardImageList();
            List<ImageEntity> imageEntities = new ArrayList<>();

            for (String image: boardImageList) {
                ImageEntity imageEntity = new ImageEntity(boardNumber, image);
                imageEntities.add(imageEntity);
            }

            imageRepository.saveAll(imageEntities);

        } catch (Exception exception){
            log.error(exception.getMessage());
            return ResponseDto.databaseError();
        }
        return PostBoardResponseDto.success();
    }

    @Override
    public ResponseEntity<? super PostCommentResponseDto> postComment(int boardNumber, PostCommentRequestDto dto, String email) {

        try {
            BoardEntity boardEntity = boardRepository.findByBoardNumber(boardNumber);
            if(boardEntity == null) return PostCommentResponseDto.noExistBoard();

            boolean existedUser = userRepository.existsByEmail(email);
            if(!existedUser) return PostCommentResponseDto.noExistUser();

            CommentEntity commentEntity = new CommentEntity(dto, boardNumber, email);
            commentRepository.save(commentEntity);
            boardEntity.increaseCommentCount();
            boardRepository.save(boardEntity);

        } catch (Exception exception){
            log.error(exception.getMessage());
            return ResponseDto.databaseError();
        }
        return PostCommentResponseDto.success();
    }

    @Override
    public ResponseEntity<? super PutFavoriteResponseDto> putFavorite(int boardNumber, String email) {
        try{

            // user & board check
            boolean isExistedUser = userRepository.existsByEmail(email);
            if(!isExistedUser) return PutFavoriteResponseDto.noExistUser();
            BoardEntity boardEntity = boardRepository.findByBoardNumber(boardNumber);
            if(boardEntity == null) return PutFavoriteResponseDto.noExistBoard();

            // board favorite count increase
            FavoriteEntity favoriteEntity = favoriteRepository.findByBoardNumberAndUserEmail(boardNumber, email);
            if (favoriteEntity == null) {
                favoriteEntity = new FavoriteEntity(email, boardNumber);
                favoriteRepository.save(favoriteEntity);
                boardEntity.increaseFavoriteCount();
            }
            else {
                favoriteRepository.delete(favoriteEntity);
                boardEntity.decreaseFavoriteCount();
            }

            boardRepository.save(boardEntity);

        } catch (Exception exception){
            log.error(exception.getMessage());
            return PutFavoriteResponseDto.databaseError();
        }
        return PutFavoriteResponseDto.success();

    }

    @Override
    public ResponseEntity<? super PatchBoardResponseDto> patchBoard(PatchBoardRequestDto dto, int boardNumber, String email) {
        try {
            BoardEntity boardEntity = boardRepository.findByBoardNumber(boardNumber);
            if(boardEntity == null) return PatchBoardResponseDto.noExistBoard();

            boolean isExistedUser = userRepository.existsByEmail(email);
            if(!isExistedUser) return PatchBoardResponseDto.noExistUser();

            if(!email.equals(boardEntity.getWriterEmail()))
                return PatchBoardResponseDto.noPermission();

            boardEntity.patchBoard(dto);
            boardRepository.save(boardEntity);

            imageRepository.deleteByBoardNumber(boardNumber);
            List<String> boardImageList = dto.getBoardImageList();
            List<ImageEntity> imageEntities = new ArrayList<>();

            for (String boardImage : boardImageList) {
                ImageEntity imageEntity = new ImageEntity(boardNumber, boardImage);
                imageEntities.add(imageEntity);
            }

            imageRepository.saveAll(imageEntities);

        } catch (Exception exception){
            log.error(exception.getMessage());
            return ResponseDto.databaseError();
        }
        return PatchBoardResponseDto.success();
    }
    @Override
    public ResponseEntity<? super IncreaseViewCountResponseDto> increaseViewCount(int boardNumber) {
        try {

            BoardEntity boardEntity = boardRepository.findByBoardNumber(boardNumber);
            if (boardEntity == null) return IncreaseViewCountResponseDto.noExistBoard();
            boardEntity.increaseViewCount();
            boardRepository.save(boardEntity);

        }catch (Exception exception){
            log.error(exception.getMessage());
            return ResponseDto.databaseError();
        }
        return IncreaseViewCountResponseDto.success();
    }

    @Override
    public ResponseEntity<? super DeleteBoardResponseDto> deleteBoard(int boardNumber, String email) {
        try {
            BoardEntity boardEntity = boardRepository.findByBoardNumber(boardNumber);
            if(boardEntity == null) return DeleteBoardResponseDto.noExistBoard();

            boolean isExistedUser = userRepository.existsByEmail(email);
            if(!isExistedUser) return DeleteBoardResponseDto.noExistUser();

            if(!email.equals(boardEntity.getWriterEmail())) return DeleteBoardResponseDto.noPermission();

            imageRepository.deleteByBoardNumber(boardNumber);
            commentRepository.deleteByBoardNumber(boardNumber);
            favoriteRepository.deleteByBoardNumber(boardNumber);

            boardRepository.delete(boardEntity);

        } catch (Exception exception){
            log.error(exception.getMessage());
            return ResponseDto.databaseError();
        }
        return DeleteBoardResponseDto.success();
    }


}
