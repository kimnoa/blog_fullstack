package com.timeblock.myblog.common;

public interface ResponseMessage {

    String SUCCESS = "Success";
    String VALIDATION_FAILED = "Validation failed";
    String DUPLICATE_EMAIL = "Duplicate email";
    String DUPLICATE_NICKNAME = "Duplicate nickname";
    String DUPLICATE_TEL_NUMBER = "Duplicate tel number";
    String NOT_EXIST_USER = "This user does not exist";
    String NOT_EXIST_BOARD = "This board does not exist";
    String SIGN_IN_FAIL = "Login information mismatch";
    String AUTHORIZATION_FAIL = "Authorization failed";
    String NO_PERMISSION = "Do not have permission";
    String DATABASE_ERROR = "Database error";
}
