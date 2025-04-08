import ResponseCode from "types/enum/resopnse-code.enum";

export default interface ResponseDto {
    code: ResponseCode;
    message: string;
}