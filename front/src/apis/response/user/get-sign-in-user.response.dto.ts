import ResponseDto from "../response.dto";
import {User} from "../../../types/interface";

export default interface GetSignInUserResponseDto extends ResponseDto, User {
    id: number;
    email: string;
    nickname: string;
    address: string;
    telNumber: string;
    createdAt: string;
    updatedAt: string;
}