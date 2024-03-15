import { useRef } from "react";
import AnimationWrapper from "../common/page-animation";
import InputBox from "../components/input.component";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../App";

const ChangePassword = () =>{

let {userAuth:{access_token}} = useContext(UserContext)

    let changePasswordForm = useRef()

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

   const handleSubmit = (e)=>{
     e.preventDefault();

     let form = new FormData(changePasswordForm.current);
     let formData = {};

     for(let [key,value] of form.entries()){
        formData[key] = value ;
     }

     let {currentPassword,newPassword} = formData ;

     if(!currentPassword.length || !newPassword.length){
        return toast.error('Password is empty')
     }

     if(!passwordRegex.test(currentPassword) || !passwordRegex.test(newPassword)){
        return toast.error("Password should be 6 to 20 Characters long with a numeric and 1 uppercase")
     }

     e.target.setAttribute("disabled",true)

     let loadingtoast  = toast.loading('Changing password ...')

     axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/change-password', {currentPassword ,newPassword},{

        headers:{
            "Authorization" : `Bearer ${access_token}`
        }
     }).then(res=>{
        toast.dismiss(loadingtoast)
        e.target.removeAttribute("disabled");
        toast.success("Password changed")
     })
     .catch(({response})=>{
        toast.dismiss(loadingtoast)
        e.target.removeAttribute("disabled");
        toast.error(response.data.error)
     })
    

   }

    return (
        <AnimationWrapper>
             <Toaster />
             <form ref={changePasswordForm}>

             <h1 className="max-md:hidden">Change Password</h1>

                <div className="py-6 md:w-[400px] w-full">

                     <InputBox name="currentPassword" placeholder="Current Password" type="password" icon="fi-rr-unlock" className="profile-edit-input mx-2"/>

                    <InputBox name="newPassword" placeholder="New Password" type="password" icon="fi-rr-unlock" className="profile-edit-input mx-2"/>

                    <button className="btn btn-dark px-10" onClick={handleSubmit}>Change Password</button>

                 </div>


             </form>

        </AnimationWrapper>
    )
}        

export default ChangePassword ;