import { Link , Navigate} from "react-router-dom"
import {useContext, useRef} from 'react'
import InputBox from "../components/input.component"
import googleIcon from '../imgs/google.png'
import AnimationWrapper from "../common/page-animation"
import {toast,Toaster} from 'react-hot-toast'
import axios from 'axios'
import { storeinSession } from "../common/session"
import {UserContext} from '../App'
import { authGoogle } from "../common/firebase"

const UserAuthForm = ({type})=>{
   
   let {userAuth : {access_token}, setUserAuth} = useContext(UserContext)

   console.log(access_token);

   access_token

   const  userAuthThroughServer = (serverRoute, formData)=>{

      axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute , formData).then(({data})=>{
         storeinSession("user" , JSON.stringify(data))
         setUserAuth(data)
      }).catch(({response})=>{
         toast.error(response.data.error)
      })
   }
   const HandleSubmit = (e)=>{
       e.preventDefault()

       let serverRoute = type == 'sign-in' ? '/signin' : '/signup'

       const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
       const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

       let  form = new FormData(formElement)
       let formData = {}

      for(let [key, value] of form.entries()){
         formData[key] = value  ;   
      }
      let {fullname,email,password} = formData;

      // form vallidation

       if(fullname){
        if(fullname.length < 3){
          return toast.error('Fullname must be atleast 3 character')
         }
   }
     if(!email.length){
      return toast.error('Enter Email')
     }
     if(!emailRegex.test(email)){
      return toast.error(' Email is invalid')
     }
     if(!passwordRegex.test(password)){
      return toast.error('Password should be 6 to 20 Characters long')
     }
     userAuthThroughServer(serverRoute,formData)
   }
   const handleGoogleAuth = (e)=>{
     e.preventDefault();

     authGoogle().then((user)=>{

     let serverRoute = '/google-auth'

     let formData = {
      access_token : user.accessToken
     }

     userAuthThroughServer(serverRoute,formData)

     }).catch(err=>{
      toast.error('trouble login through Google')
      return console.log(err);
     })
   }
    return(
      access_token ? <Navigate to="/" />
             :
      <AnimationWrapper keyValue={type} >
         <section className=" h-cover flex items-center justify-center">
            <Toaster />
           <form id="formElement" className="w-[80%] max-w-[400px]">
            <h1 className="text-4xl font-gelasio capitalize text-center mb-20">{type=='sign-in' ? 'Welcome back' : "Join Us today"}</h1>
             {
                type != 'sign-in' ? 
                <InputBox
                  name='fullname'
                  type='text'
                  placeholder='Full Name'
                  icon='fi-rr-user'
                 />
                :''
             }
                 <InputBox
                  name='email'
                  type='email'
                  placeholder='Email'
                  icon= 'fi-rr-envelope'
                 />

                <InputBox
                  name='password'
                  type='password'
                  placeholder='Password'
                  icon= 'fi-rr-key'
                 />
                 <button type="submit" className="btn-dark center mt-12" onClick={HandleSubmit}>
                     {type.replace('-' , ' ')}
                 </button>
                 <div className="relative w-full flex items-center gap-2 my-8 uppercase font-bold opacity-10 text-black">
                    <hr className="w-1/2 border-black"/>
                     <p>or</p>
                    <hr className="w-1/2 border-black"/>
                 </div>
                 <button className="btn-dark flex items-center justify-center gap-4 center w-[90%] "
                 onClick={handleGoogleAuth}
                 >
                    <img className="w-5" src={googleIcon}/>
                    continue with google
                 </button>
                 {
                    type == "sign-up" ?
                    <p className='text-dark-grey text-xl text-center mt-6'>
                    Already have an account?
                   <Link to='/signin' className=" text-black text-xl ml-1 " >
                       Sign in here
                   </Link> 
                  </p>
                     :
                    <p className='text-dark-grey text-xl text-center mt-6'>
                    Don't have an account ?
                    <Link  to='/signup' className=" text-black text-xl ml-1 " >
                        Signup now
                    </Link>
                    </p> 
                 } 
          </form>
        </section>
      </AnimationWrapper>
    )

}

export default UserAuthForm