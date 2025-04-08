import {forwardRef, ChangeEvent, KeyboardEvent} from "react";
import './style.css';

// interface: InputBox Component Properties
interface Props {
    label: string;
    type: 'text' | 'password';
    placeholder: string;
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    error_check: boolean;
    // setValue: Dispatch<SetStateAction<string>>;

    icon?: 'eye-light-on-icon' | 'eye-light-off-icon'|'expand-right-light-icon'; //없을 수도 있음
    onButtonClick?: () => void;

    message?: string;

    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
}

// ! component: InputBox 컴포넌트
const InputBox
    = forwardRef<HTMLInputElement, Props>((props:Props,ref)=>{

    // ! state: properties
    const {label,
        type,
        placeholder,
        error_check,
        value,
        icon,
        message
    } = props;

    const {onChange,
        onButtonClick,
        onKeyDown} = props;


    //  * event handler: Input 키 이벤트 처리 함수
    const onKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        if(!onKeyDown) return ;
            onKeyDown(event);

    }

    // # render: InputBox 컴포넌트 랜더링
    return (
        <div className='inputbox'>
            <div className='inputbox-label'>{label}</div>
            <div className={error_check ?  'inputbox-container-error' :'inputbox-container'}>
               <input ref={ref} type = {type} className='input' placeholder={placeholder} value={value} onChange={onChange} onKeyDown={onKeyDownHandler}/>
                {onButtonClick !== undefined &&(
                <div className='icon-button' onClick={onButtonClick}>
                    {icon !== undefined && <div className= {`icon ${icon}`}></div>}
               </div>
                )}
            </div>
            {message !== undefined &&
            <div className='inputbox-message'>{message} </div>}
        </div>
    )

});

export default InputBox;