import React, {ChangeEvent, KeyboardEvent, useRef, useState} from "react";
import "./style.css";
import InputBox from "../../components/InputBox";
import {signInRequest, signUpRequest} from "../../apis";
import {SignInResponseDto, SignUpResponseDto} from "../../apis/response/auth";
import {ResponseDto} from "../../apis/response";
import {useCookies} from "react-cookie";
import {MAIN_PATH} from "../../constant";
import {useNavigate} from "react-router-dom";
import {SignInRequestDto, SignUpRequestDto} from "../../apis/request/auth";
import {Address, useDaumPostcodePopup} from "react-daum-postcode";
import {useLoginUserStore} from "../../stores";

// component: 인증 화면 컴포넌트
export default function Authentication() {

    // state: 화면 상태
    const [view, setView] = useState<'sign-in' | 'sign-up'>('sign-in');

    // state: 쿠키 상태
    const [cookies, setCookie] = useCookies(['accessToken']);

    // state: 로그인 유저 상태
    const {loginUser, setLoginUser} = useLoginUserStore();

    // function: 네비게이트 함수
    const navigate = useNavigate();

    // component: sign in card 컴포넌트
    const SignInCard = () => {

        // state: email 요소 참조 상태
        const emailRef = useRef<HTMLInputElement | null>(null);

        // state: password 요소 참조 상태
        const passwordRef = useRef<HTMLInputElement | null>(null);

        // state: 이메일 상태
        const [email, setEmail] = useState<string>('');

        // state: 비밀번호 상태
        const [password, setPassword] = useState<string>('');

        // state: 비밀번호 타입 상태
        const [passwordType, setPasswordType] = useState<'password' | 'text'>('password');

        // state: 비밀번호 아이콘 상태
        const [passwordButtonIcon, setPasswordButtonIcon] = useState<'eye-light-on-icon' | 'eye-light-off-icon'>('eye-light-off-icon');

        // state: 에러 상태
        const [error, setError] = useState<boolean>(false);

        // function: sign in response 처리 함수
        const signInResponse = (responseBody: SignInResponseDto | ResponseDto | null) => {

            if (!responseBody) {
                alert('네트워크 이상입니다.');
                return;
            }
            const {code} = responseBody as ResponseDto;
            if (code === 'DBE') alert('데이터베이스 오류입니다.');
            if (code === 'SF' || code === 'VF') setError(true);
            if (code !== 'SU') return;

            const {token} = responseBody as SignInResponseDto;
            const now = Date.now();
            const expires = new Date(now + 3600 * 1000);
            console.log(now, expires);

            if (!token) return;

            setCookie('accessToken', token, {expires: expires, path: MAIN_PATH()});
            navigate(MAIN_PATH());
        }

        // event handler: 이메일 변경 이벤트 처리
        const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {

            setError(false);
            const {value} = event.target;
            setEmail(value);
        }

        // event handler: 비밀번호 변경 이벤트 처리
        const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {

            setError(false);
            const {value} = event.target;
            setPassword(value);
        }


        // event handler: 로그인 버튼 클릭 이벤트 처리
        const onSignInButtonClickHandler = () => {
            const requestBody: SignInRequestDto = {email, password};
            signInRequest(requestBody).then(signInResponse);

        }

        // event handler: 회원가입(SignUp) 링크 클릭 이벤트 처리
        const onSignUpLinkClickHandler = () => {

            setView('sign-up');
        }

        // event handler: 비밀번호 버튼 클릭 이벤트 처리
        const onPasswordButtonClickHandler = () => {

            if (passwordType === 'text') {
                setPasswordType('password');
                setPasswordButtonIcon('eye-light-off-icon');
            } else {
                setPasswordType('text');
                setPasswordButtonIcon('eye-light-on-icon');
            }

        }

        // event handler: email input key down 이벤트 처리
        const onEmailKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {

            if (event.key !== 'Enter') return;

            if (!passwordRef.current) return;
            passwordRef.current.focus();
        }

        // event handler: password input key down 이벤트 처리
        const onPasswordKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {

            if (event.key !== 'Enter') return;
            onSignInButtonClickHandler(); //로그인 버튼 클릭과 동일한 효과

        }

        // render: sign in card 컴포넌트 랜더링
        return (
            <div className='auth-card'>
                <div className='auth-card-box'>
                    <div className='auth-card-top'>
                        <div className='auth-card-title-box'>
                            <div className='auth-card-title'>{"로그인"}</div>
                        </div>
                        <InputBox ref={emailRef} label="이메일 주소" type='text' placeholder='이메일 주소를 입력해주세요.'
                                  error_check={error} value={email} onChange={onEmailChangeHandler}
                                  icon='expand-right-light-icon' onButtonClick={onSignInButtonClickHandler}
                                  onKeyDown={onEmailKeyDownHandler}/>
                        <InputBox ref={passwordRef} label="비밀번호" type={passwordType} placeholder="비밀번호를 입력해주세요."
                                  error_check={error} value={password} onChange={onPasswordChangeHandler}
                                  icon={passwordButtonIcon} onButtonClick={onPasswordButtonClickHandler}
                                  onKeyDown={onPasswordKeyDownHandler}/>
                    </div>
                    <div className='auth-card-bottom'>
                        {error &&
                            <div className='auth-sign-in-error-box'>
                                <div className='auth-sign-in-error-message'>
                                    {"이메일 주소 또는 비밀번호를 잘못 입력했습니다. 다시 입력해주세요."}
                                </div>
                            </div>
                        }
                        <div className='black-large-full-button' onClick={onSignInButtonClickHandler}>{"로그인"}</div>
                        <div className='auth-description-box'>
                            {"신규 사용자이신가요?"}
                            <span className='auth-description-link' onClick={onSignUpLinkClickHandler}>{"회원가입"}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };


    // component: sign up card 컴포넌트
    const SignUpCard = () => {


        // state: 이메일 요소 참조 상태
        const emailRef = useRef<HTMLInputElement | null>(null);
        // state: 이메일 요소 참조 상태
        const passwordRef = useRef<HTMLInputElement | null>(null);
        // state: 이메일 요소 참조 상태
        const passwordCheckRef = useRef<HTMLInputElement | null>(null);
        // state: 닉네임 요소 참조 상태
        const nicknameRef = useRef<HTMLInputElement | null>(null);
        // state: 휴대 전화번호 요소 참조 상태
        const telNumberRef = useRef<HTMLInputElement | null>(null);
        // state: 주소 요소 참조 상태
        const addressRef = useRef<HTMLInputElement | null>(null);
        // state: 상세 주소 요소 참조 상태
        const addressDetailRef = useRef<HTMLInputElement | null>(null);

        // state: 페이지 번호 상태
        const [page, setPage] = useState<1 | 2>(1);

        // state: 이메일 상태
        const [email, setEmail] = useState<string>('');
        // state: 비밀번호 상태
        const [password, setPassword] = useState<string>('');
        // state: 비밀번호 확인 상태
        const [passwordCheck, setPasswordCheck] = useState<string>('');

        // state: 닉네임 상태
        const [nickname, setNickname] = useState<string>('');
        // state: 휴대 전화번호 상태
        const [telNumber, setTelNumber] = useState<string>('');
        // state: 주소 상태
        const [address, setAddress] = useState<string>('');
        // state: 상세 주소 상태
        const [addressDetail, setAddressDetail] = useState<string>('');
        // state: 개인 정보 동의 상태
        const [agreedPersonal, setAgreedPersonal] = useState<boolean>(false);


        // state: 비밀번호 타입 상태
        const [passwordType, setPasswordType] = useState<'password' | 'text'>('password');
        // state: 비밀번호 확인 타입 상태
        const [passwordCheckType, setPasswordCheckType] = useState<'password' | 'text'>('password');

        // state: 이메일 에러 상태
        const [isEmailError, setIsEmailError] = useState<boolean>(false);
        // state: 비밀번호 에러 상태
        const [isPasswordError, setIsPasswordError] = useState<boolean>(false);
        // state: 비밀번호 확인 에러 상태
        const [isPasswordCheckError, setIsPasswordCheckError] = useState<boolean>(false);
        // state: 닉네임 에러 상태
        const [isNicknameError, setIsNicknameError] = useState<boolean>(false);
        // state: 휴대 전화번호 에러 상태
        const [isTelNumberError, setIsTelNumberError] = useState<boolean>(false);
        // state: 주소 에러 상태
        const [isAddressError, setIsAddressError] = useState<boolean>(false);
        // state: 개인 정보 동의 에러 상태
        const [isAgreedPersonalError, setIsAgreedPersonalError] = useState<boolean>(false);


        // state: 이메일 에러 메시지 상태
        const [emailErrorMessage, setEmailErrorMessage] = useState<string>('');
        // state: 비밀번호 에러 메시지 상태
        const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>('');
        // state: 비밀번호 확인 에러 메시지 상태
        const [passwordCheckErrorMessage, setPasswordCheckErrorMessage] = useState<string>('');
        // state: 닉네임 에러 메시지 상태
        const [nicknameErrorMessage, setNicknameErrorMessage] = useState<string>('');
        // state: 휴대 전화번호 에러 메시지 상태
        const [telNumberErrorMessage, setTelNumberErrorMessage] = useState<string>('');
        // state: 주소 에러 메시지 상태
        const [addressErrorMessage, setAddressErrorMessage] = useState<string>('');

        // state: 비밀번호 버튼 아이콘 상태
        const [passwordButtonIcon, setPasswordButtonIcon] = useState<'eye-light-off-icon' | 'eye-light-on-icon'>('eye-light-off-icon');
        // state: 비밀번호 확인 버튼 아이콘 상태
        const [passwordCheckButtonIcon, setPasswordCheckButtonIcon] = useState<'eye-light-off-icon' | 'eye-light-on-icon'>('eye-light-off-icon');


        // function: 다음 주소 검색 팝업 오픈 함수
        const open = useDaumPostcodePopup();

        // function: sign up response 처리 함수
        const signUpResponse = (responseBody: SignUpResponseDto|ResponseDto|null) => {
            if (!responseBody) {
                alert('네트워크 이상입니다.');
                return;
            }
            const {code} = responseBody;
            console.log(code);

            if (code === 'DE') {
                setIsEmailError(true);
                setEmailErrorMessage('중복되는 이메일 주소입니다.');
            }
            if (code === 'DN') {
                setIsNicknameError(true);
                setNicknameErrorMessage('중복되는 닉네임 주소입니다.');
            }
            if (code === 'DT') {
                setIsTelNumberError(true);
                setTelNumberErrorMessage('중복되는 전화번호입니다.');
            }
            if (code === 'VF') alert('모든 값을 입력해주세요.');
            if (code === 'DBE') alert('데이터베이스 오류입니다.');

            if (code !== 'SU') return;

            console.log("Sign Up Success");

            setView('sign-in');


        };


        // event handler: 이메일 변경 이벤트 처리
        const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            const {value} = event.target;
            setEmail(value);
            setIsEmailError(false);
            setEmailErrorMessage('');
        }

        // event handler: 비밀번호 변경 이벤트 처리
        const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            const {value} = event.target;
            setPassword(value);
            setIsPasswordError(false);
            setPasswordErrorMessage('');
        }

        // event handler: 비밀번호 확인 변경 이벤트 처리
        const onPasswordCheckChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            const {value} = event.target;
            setPasswordCheck(value);
            setIsPasswordCheckError(false);
            setPasswordCheckErrorMessage('');
        }

        // event handler: 닉네임 변경 이벤트 처리
        const onNicknameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            const {value} = event.target;
            setNickname(value);
            setIsNicknameError(false);
            setNicknameErrorMessage('');
        }

        // event handler: 휴대 전화번호 변경 이벤트 처리
        const onTelNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            const {value} = event.target;
            setTelNumber(value);
            setIsTelNumberError(false);
            setTelNumberErrorMessage('');
        }

        // event handler: 주소 변경 이벤트 처리
        const onAddressChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            const {value} = event.target;
            setAddress(value);
            setIsAddressError(false);
            setAddressErrorMessage('');
        }

        // event handler: 상세 주소 변경 이벤트 처리
        const onAddressDetailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            const {value} = event.target;
            setAddressDetail(value);
        }

        // event handler: 기본 정보 동의 체크 박스 클릭 이벤트 처리
        const onAgreedPersonalClickHandler = () => {
            setAgreedPersonal(!agreedPersonal);
            setIsAgreedPersonalError(false);
        }

        // event handler: 비밀번호 버튼 클릭 이벤트 처리
        const onPasswordButtonClickHandler = () => {
            if (passwordButtonIcon === 'eye-light-off-icon') {
                setPasswordButtonIcon('eye-light-on-icon');
                setPasswordType('text');
            } else {
                setPasswordButtonIcon('eye-light-off-icon');
                setPasswordType('password');
            }
        }

        // event handler: 비밀번호 확인 버튼 클릭 이벤트 처리
        const onPasswordCheckButtonClickHandler = () => {
            if (passwordCheckButtonIcon === 'eye-light-off-icon') {
                setPasswordCheckButtonIcon('eye-light-on-icon');
                setPasswordCheckType('text');
            } else {
                setPasswordCheckButtonIcon('eye-light-off-icon');
                setPasswordCheckType('password');
            }
        }

        // event handler: 주소 버튼 클릭 이벤트 처리
        const onAddressButtonClickHandler = () => {
            open({onComplete});
        }

            // event handler: 다음 단계 버튼 클릭 이벤트 처리
            const onNextButtonClickHandler = () => {
                const emailPattern = /^[a-zA-Z0-9]+@([-.]?[a-zA-Z0-9])+\.[a-zA-Z]+$/;
                const isEmailPattern = emailPattern.test(email);

                if (!isEmailPattern) {
                    setIsEmailError(true);
                    setEmailErrorMessage('이메일 포멧이 맞지 입력해주세요.');
                }

                const passwordPattern = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,}$/;
                const isCheckedPasswordPattern = passwordPattern.test(password);

                if (!isCheckedPasswordPattern) {
                    setIsPasswordError(true);
                    setPasswordErrorMessage('비밀번호는 8자 이상, 특수문자, 숫자를 각각 1개 이상 포함해주세요.');

                }

                const isEqualPassword = password === passwordCheck;
                if (!isEqualPassword) {
                    setIsPasswordCheckError(true);
                    setPasswordCheckErrorMessage('비밀번호가 일치하지 않습니다.');
                }

                if (!isEmailPattern || !isCheckedPasswordPattern || !isEqualPassword) return;
                setPage(2);
            }

            // event handler: 회원가입 버튼 클릭 이벤트 처리
            const onSignUpButtonClickHandler = () => {
                const emailPattern = /^[a-zA-Z0-9]+@([-.]?[a-zA-Z0-9])+\.[a-zA-Z]+$/;
                const isEmailPattern = emailPattern.test(email);

                if (!isEmailPattern) {
                    setIsEmailError(true);
                    setEmailErrorMessage('이메일 포멧이 맞지 입력해주세요.');
                }

                const passwordPattern = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,}$/;
                const isCheckedPasswordPattern = passwordPattern.test(password);

                if (!isCheckedPasswordPattern) {
                    setIsPasswordError(true);
                    setPasswordErrorMessage('비밀번호는 8자 이상, 특수문자, 숫자를 각각 1개 이상 포함해주세요.');

                }

                const isEqualPassword = password === passwordCheck;
                if (!isEqualPassword) {
                    setIsPasswordCheckError(true);
                    setPasswordCheckErrorMessage('비밀번호가 일치하지 않습니다.');
                }

                if (!isEmailPattern || !isCheckedPasswordPattern || !isEqualPassword) {
                    setPage(1);
                    return;
                }

                const hasNickname = nickname.trim().length !== 0;
                if (!hasNickname) {
                    setIsNicknameError(true);
                    setNicknameErrorMessage('닉네임을 입력해주세요.');
                }

                const telNumberPattern = /^[0-9]{11,13}$/;
                const isTelNumberPattern = telNumberPattern.test(telNumber);
                if (!isTelNumberPattern) {
                    setIsTelNumberError(true);
                    setTelNumberErrorMessage('숫자만 입력해주세요.');
                }

                const hasAddress = address.trim().length > 0;
                if (!hasAddress) {
                    setIsAddressError(true);
                    setAddressErrorMessage('주소를 입력해주세요.');
                }
                if (!agreedPersonal) setIsAgreedPersonalError(true);

                if (!hasNickname || !isTelNumberPattern || !hasAddress || !agreedPersonal) return;

                const requestBody: SignUpRequestDto = {
                    email,
                    password,
                    nickname,
                    telNumber,
                    address,
                    addressDetail,
                    agreedPersonal
                };


                console.log(requestBody);

                signUpRequest(requestBody).then(signUpResponse);

            }

            // event handler: 로그인 링크 클릭 이벤트 처리
            const onSignInLinkClickHandler = () => {
                setView('sign-in');
            }

            // event handler: 이메일 키 다운 이벤트 처리
            const onEmailKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {

                if (event.key !== 'Enter') return;
                if (!passwordRef.current) return;
                passwordRef.current.focus();
            }

            // event handler: 비밀번호 키 다운 이벤트 처리
            const onPasswordKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
                if (event.key !== 'Enter') return;
                if (!passwordCheckRef.current) return;
                passwordCheckRef.current.focus();
            }

            // event handler: 비밀번호 확인 키 다운 이벤트 처리
            const onPasswordCheckKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
                if (event.key !== 'Enter') return;
                if (!nicknameRef.current) return;
                nicknameRef.current.focus();
                onNextButtonClickHandler();
            }

            // event handler: 닉네임 키 다운 이벤트 처리
            const onNicknameKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key !== 'Enter') return;
            if (!telNumberRef.current) return;
            telNumberRef.current.focus();
            }
            // event handler: 휴대 전화번호 키 다운 이벤트 처리
            const onTelNumberKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
                if (event.key !== 'Enter') return;
                if (!addressRef.current) return;
                addressRef.current.focus();
                onAddressButtonClickHandler();
            }

            // event handler: 주소 키 다운 이벤트 처리
            const onAddressKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
                if (event.key !== 'Enter') return;
                if (!addressDetailRef.current) return;
                addressDetailRef.current.focus();
            }

            // event handler: 상세 주소 키 다운 이벤트 처리
            const onAddressDetailKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
                if (event.key !== 'Enter') return;
                onSignUpButtonClickHandler(); //개인 정보 동의 여부 체크 해야 함.
            }

            // event handler: 다음 주소 검색 완료 이벤트 처리
            const onComplete = (data: Address) => {
                const {address} = data;
                setAddress(address);
                setIsAddressError(false);
                setAddressErrorMessage('');
                if (!addressDetailRef.current) return;
                addressDetailRef.current.focus();
            }

            // render: sign up card 컴포넌트 랜더링
            return (
                <div className='auth-card'>
                    <div className='auth-card-box'>
                        <div className='auth-card-top'>
                            <div className='auth-card-title-box'>
                                <div className='auth-card-title'>{"회원가입"}</div>
                                <div className='auth-card-page'>{`${page} / 2`}</div>
                            </div>
                            {page === 1 && (
                                <>
                                    <InputBox ref={emailRef} label='이메일 주소' type='text' placeholder='이메일 주소를 입력해주세요'
                                              value={email} onChange={onEmailChangeHandler} error_check={isEmailError}
                                              message={emailErrorMessage} onKeyDown={onEmailKeyDownHandler}/>
                                    <InputBox ref={passwordRef} label='비밀번호' type={passwordType}
                                              placeholder='비밀번호를 입력해주세요' value={password}
                                              onChange={onPasswordChangeHandler} error_check={isPasswordError}
                                              message={passwordErrorMessage} icon={passwordButtonIcon}
                                              onButtonClick={onPasswordButtonClickHandler}
                                              onKeyDown={onPasswordKeyDownHandler}/>
                                    <InputBox ref={passwordCheckRef} label='비밀번호 확인' type={passwordCheckType}
                                              placeholder='비밀번호를 다시 입력해주세요' value={passwordCheck}
                                              onChange={onPasswordCheckChangeHandler}
                                              message={passwordCheckErrorMessage} error_check={isPasswordCheckError}
                                              icon={passwordCheckButtonIcon}
                                              onButtonClick={onPasswordCheckButtonClickHandler}
                                              onKeyDown={onPasswordCheckKeyDownHandler}/>
                                </>
                            )}
                            {page === 2 && (
                                <>
                                    <InputBox ref={nicknameRef} label='닉네임' type='text' placeholder='닉네임를 입력해주세요'
                                              value={nickname} onChange={onNicknameChangeHandler}
                                              error_check={isNicknameError} message={nicknameErrorMessage}
                                              onKeyDown={onNicknameKeyDownHandler}></InputBox>
                                    <InputBox ref={telNumberRef} label='핸드폰 번호' type='text' placeholder='핸드폰 번호를 입력해주세요'
                                              value={telNumber} onChange={onTelNumberChangeHandler}
                                              error_check={isTelNumberError} message={telNumberErrorMessage}
                                              onKeyDown={onTelNumberKeyDownHandler}></InputBox>
                                    <InputBox ref={addressRef} label='주소' type='text' placeholder='주소를 입력해주세요'
                                              value={address} onChange={onAddressChangeHandler}
                                              error_check={isAddressError} message={addressErrorMessage}
                                              icon='expand-right-light-icon' onButtonClick={onAddressButtonClickHandler}
                                              onKeyDown={onAddressKeyDownHandler}></InputBox>
                                    <InputBox ref={addressDetailRef} label='상세 주소' type='text'
                                              placeholder='상세 주소를 입력해주세요' value={addressDetail}
                                              onChange={onAddressDetailChangeHandler} error_check={false}
                                              onKeyDown={onAddressDetailKeyDownHandler}></InputBox>
                                </>

                            )}
                        </div>
                        <div className='auth-card-bottom'>
                            {page === 1 && (
                                <div className='black-large-full-button' onClick={onNextButtonClickHandler}>{"다음 단계"}</div>
                            )}
                            {page === 2 && (
                                <>
                                    <div className='auth-consent-box'>
                                        <div className='auth-check-box' onClick={onAgreedPersonalClickHandler}>
                                            <div className={`icon ${agreedPersonal ? 'check-round-fill-icon' : 'check-ring-light-icon'}`}></div>
                                        </div>
                                        <div
                                            className={isAgreedPersonalError ? 'auth-consent-title-error' : 'auth-consent-title'}>{'개인정보 동의'}</div>
                                        <div className='auth-consent-link'>{'더보기 >'}</div>
                                    </div>
                                    <div className='black-large-full-button'
                                         onClick={onSignUpButtonClickHandler}>{"회원가입"}</div>
                                </>

                            )}
                            <div className='auth-description-box'>
                                <div className='auth-description'>{"이미 계정이 있으신가요?"}
                                    <span className='auth-description-link'
                                          onClick={onSignInLinkClickHandler}>{"로그인"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        };

        // render: 인증 화면 컴포넌트 랜더링
        return (
            <div id='auth-wrapper'>
                <div id='auth-container'>
                    <div className='auth-jumbotron-box'>
                        <div className='auth-jumbotron-contents'>
                            <div className='auth-logo-icon'></div>
                            <div className='auth-jumbotron-text-box'>
                                <div className='auth-jumbotron-text'>{'환영합니다.'}</div>
                                <div className='auth-jumbotron-text'>{"Kim's Blog"}</div>

                            </div>
                        </div>
                    </div>
                    {view === 'sign-in' && <SignInCard/>}
                    {view === 'sign-up' && <SignUpCard/>}
                </div>
            </div>
        )

}