import ResponseDto from "../response.dto";
import Board from "types/interface/board.interface";

export default interface GetBoardResponseDto extends ResponseDto, Board {
    boardNumber: number;
    title: string;
    content: string;
    boardImageList: string[];
    writeDatetime: string;
    email: string;
    nickname: string;
    profileImage: string | null;
}