package com.timeblock.myblog.common;

public class ResponseCode {

    //HTTP Status 200
    public static String SUCCESS = "SU";

    //HTTP Status 400
    public static String VALIDATION_FAILED = "VF";
    public static String DUPLICATE_EMAIL = "DE";
    public static String DUPLICATE_NICKNAME = "DN";
    public static String DUPLICATE_TEL_NUMBER = "DT";
    public static String NOT_EXIST_USER = "NU";
    public static String NOT_EXIST_BOARD = "NB";

    //HTTP Status 401
    public static String SIGN_IN_FAIL = "SF";
    public static String AUTHORIZATION_FAIL = "AF";

    //HTTP Status 403
    public static String NO_PERMISSION = "NP";

    //HTTP Status 500
    public static String DATABASE_ERROR = "DBE";


}
