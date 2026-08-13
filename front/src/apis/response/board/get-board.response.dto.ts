import Board from "@/types/interface/board.interface";
import ResponseDto from "../response.dto";

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