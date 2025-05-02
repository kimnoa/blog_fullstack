import {SignInRequestDto, SignUpRequestDto} from "./request/auth";
import axios from "axios";
import {SignInResponseDto, SignUpResponseDto} from "./response/auth";
import {ResponseDto} from "./response";
import {GetSignInUserResponseDto} from "./response/user";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;
import {PostBoardRequestDto, PostCommentRequestDto} from "./request/board";
import {
    PostBoardResponseDto,
    GetBoardResponseDto,
    IncreaseViewCountResponseDto,
    GetFavoriteListResponseDto,
    GetCommentListResponseDto,
    PutFavoriteResponseDto,
    PostCommentResponseDto,
    DeleteBoardResponseDto,
    PatchBoardResponseDto,
    GetLatestBoardListResponseDto,
    GetTop3BoardListResponseDto
} from "./response/board";
import PatchBoardRequestDto from "./request/board/patch-board.request.dto";
import { GetPopularListResponseDto } from "./response/search";

const DOMAIN = "http://localhost:4000";

const API_DOMAIN = `${DOMAIN}/api/v1`;

const authorization = (accessToken: String) => {
    return {headers: {Authorization: `Bearer ${accessToken}`}}
};

const SIGN_IN_URL = () => `${API_DOMAIN}/auth/sign-in`;

const SIGN_UP_URL = () => `${API_DOMAIN}/auth/sign-up`;

// export { SIGN_IN_URL, SIGN_UP_URL }

export const signInRequest = async (requestBody: SignInRequestDto) => {
    const result = await axios.post(SIGN_IN_URL(), requestBody)//await을 걸어서 결과를 기다리게 됨. 안 넣으면 결과 기다리지 않고 실행
        .then(response =>{
            const responseBody: SignInResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response.data) return null; //위에서 실수가 나는 것을 방지
            const responseBody : ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}
export const signUpRequest = async (requestBody: SignUpRequestDto) => {
    const result = await axios.post(SIGN_UP_URL(), requestBody)
        .then(response => {
            console.log("post1");

            const responseBody: SignUpResponseDto = response.data;
            console.log("post2");
                return responseBody;
        })
        .catch(error =>{
            console.log(error.response);
            if (!error.response.data) return null;
            console.log("post4");
            const responseBody : ResponseDto = error.response.data;
            console.log("post5");
            return responseBody;
        })

    return result;
}

const GET_BOARD_URL = (boardNumber: number|string) => `${API_DOMAIN}/board/${boardNumber}`;
const GET_LATEST_BOARD_LIST_URL = () => `${API_DOMAIN}/board/latest-list`;
const GET_TOP_3_BOARD_LIST_URL = () => `${API_DOMAIN}/board/top-3-list`;
const INCREASE_VIEW_COUNT_URL = (boardNumber: number|string) => `${API_DOMAIN}/board/${boardNumber}/increase-view-count`;
const GET_FAVORITE_LIST_URL = (boardNumber: number|string) => `${API_DOMAIN}/board/${boardNumber}/favorite-list`;
const GET_COMMENT_LIST_URL = (boardNumber: number|string) => `${API_DOMAIN}/board/${boardNumber}/comment-list`;

const POST_BOARD_URL = () => `${API_DOMAIN}/board`;
const POST_COMMENT_URL = (boardNumber: number|string) => `${API_DOMAIN}/board/${boardNumber}/comment`;
const PATCH_BOARD_URL = (boardNumber: number|string) => `${API_DOMAIN}/board/${boardNumber}`;
const PUT_FAVORITE_URL = (boardNumber: number|string) => `${API_DOMAIN}/board/${boardNumber}/favorite`;
const DELETE_BOARD_URL = (boardNumber: number|string) => `${API_DOMAIN}/board/${boardNumber}`;


export const getBoardRequest = async (boardNumber: number|string) => {
    const result = await axios.get(GET_BOARD_URL(boardNumber))
        .then(response => {
            const responseBody: GetBoardResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody : ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const getLatestBoardListRequest = async () => {
    const result = await axios.get(GET_LATEST_BOARD_LIST_URL())
        .then(response => {
            const responseBody: GetLatestBoardListResponseDto[] = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody : ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const getTop3BoardListRequest = async () => {
    const result = await axios.get(GET_TOP_3_BOARD_LIST_URL())
        .then(response => {
            const responseBody: GetTop3BoardListResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody : ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const increaseViewCountRequest = async (boardNumber: number|string) => {
    const result = await axios.get(INCREASE_VIEW_COUNT_URL(boardNumber))
        .then(response => {
            const responseBody: IncreaseViewCountResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody : ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const getFavoriteListRequest = async (boardNumber: number|string) => {
    const result = await axios.get(GET_FAVORITE_LIST_URL(boardNumber))
        .then(response => {
            const responseBody: GetFavoriteListResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody : ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const getCommentListRequest = async (boardNumber: number|string) => {
    const result = await axios.get(GET_COMMENT_LIST_URL(boardNumber))
        .then(response => {
            const responseBody: GetCommentListResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody : ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const postBoardRequest = async (requestBody: PostBoardRequestDto, accessToken: String) => {
    const result = await axios.post(POST_BOARD_URL(), requestBody, authorization(accessToken))
        .then(response => {
            const responseBody: PostBoardResponseDto = response.data;
            return responseBody;
    }).catch(error => {
        const responseBody : ResponseDto = error.response.data;
        return responseBody;
    })
    return result;
}

export const postCommentRequest = async (boardNumber: number|string, requestBody: PostCommentRequestDto, accessToken: String) => {

    const result = await axios.post(POST_COMMENT_URL(boardNumber), requestBody, authorization(accessToken))
        .then(response => {
            const responseBody: PostCommentResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody : ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const patchBoardRequest = async (boardNumber: number|string, requestBody: PatchBoardRequestDto, accessToken: String) => {
    const result = await axios.patch(PATCH_BOARD_URL(boardNumber), requestBody, authorization(accessToken))
        .then(response => {
            const responseBody: PatchBoardResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody : ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const putFavoriteRequest = async (boardNumber: number|string, accessToken: String) => {
    const result = await axios.put(PUT_FAVORITE_URL(boardNumber), {}, authorization(accessToken))
        .then(response => {
            const responseBody: PutFavoriteResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody : ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const deleteBoardRequest = async (boardNumber: number|string, accessToken: String) => {
    const result = await axios.delete(DELETE_BOARD_URL(boardNumber), authorization(accessToken))
        .then(response => {
            const responseBody: DeleteBoardResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody : ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

const GET_POPULAR_LIST_URL = () => `${API_DOMAIN}/search/popular-list`;

export const getPopularListRequest = async () => {
    const result = await axios.get(GET_POPULAR_LIST_URL())
        .then(response => {
            const responseBody: GetPopularListResponseDto[] = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody : ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

const GET_SIGN_IN_USER_URL = () => `${API_DOMAIN}/user`;

export const getSignInUserRequest = async (accessToken: String) => {
    const result = await axios.get(GET_SIGN_IN_USER_URL(), authorization(accessToken))
        .then(response => {
            const responseBody: GetSignInUserResponseDto = response.data;
            return responseBody;

        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody : ResponseDto = error.response.data;
            return responseBody;
        });

    return result;
}

const FILE_DOMAIN = `${DOMAIN}/file`;

const FILE_UPLOAD_URL = () => `${FILE_DOMAIN}/upload`;

export const fileUploadRequest = (data: FormData) => {
    return axios.post(FILE_UPLOAD_URL(), data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then(response => {
        const responseBody: string = response.data;
        return responseBody;
    }).catch(error => {
        return null;
    })
}