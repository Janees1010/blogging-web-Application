import { useState } from "react"

const InputBox = ({name,id,value,placeholder,type,icon,disable = false})=>{
    const [passwordVisible,setPasswordVissible] = useState(false)
    return(
        <div className="relative w-[100% mb-4">
            <input
              name={name}
              type={type=='password' ? passwordVisible ? 'text' : 'password' : type}
              defaultValue={value}
              placeholder={placeholder}
              id={id}
              disabled = {disable}
              className="input-box"
            />
             <i className={"fi " + icon + " input-icon"}></i>
             {
                type == 'password' ? 
                <i className={"fi fi-rr-eye" + (passwordVisible ? '-crossed' : '')  + " input-icon left-[auto] right-4"}
                 onClick={()=>{
                     setPasswordVissible(value=>!value)
                 }}
                ></i>
                :''
             }
        </div>
    )
}

export default InputBox