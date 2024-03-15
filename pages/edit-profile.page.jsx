import { useContext, useEffect, useRef, useState } from "react"
import { UserContext } from "../App"
import axios from "axios"
import { profileDataStructure } from "./profile.page"
import AnimationWrapper from "../common/page-animation"
import Loader from "../components/loader.component"
import toast, { Toaster } from "react-hot-toast"
import InputBox from "../components/input.component"
import { uploadImage } from "../common/aws"
import { storeinSession } from "../common/session"

const EditProfile = ()=>{
    
    let  {userAuth,userAuth:{access_token},setUserAuth} = useContext(UserContext)

    let bioLimit = 150;

    let profileImgelement = useRef()
    let editProfileForm = useRef()
       
    const [profile,setProfile] = useState(profileDataStructure)
    const [loading,setLoading] = useState(true)
    const [charactersLeft , setCharactersLeft] = useState(bioLimit)
    const [updatedProfileImg , setUpdatedProfileImg] = useState(null)

    let {personal_info:{fullname,username:profile_username,profile_img,email,bio},social_links} = profile

    
    const handleCharacterChange = (e)=>{
        setCharactersLeft(bioLimit - e.target.value.length )
    }

    const handleImagepreview = (e)=>{
        
        let img = e.target.files[0];

        profileImgelement.current.src = URL.createObjectURL(img) ;
        
        setUpdatedProfileImg(img);
    }

    const handleImageupload = (e)=>{
        e.preventDefault()

        if(updatedProfileImg){

            let loadintoast = toast.loading("Uploading ...")

            e.target.setAttribute("disabled",true)

            uploadImage(updatedProfileImg).then(url => {

                if(url){
                    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/update-profile-img",{url},{
                        headers:{
                            'Authorization' : `Bearer ${access_token}`
                        }
                    }).then(({data})=>{
                        let newuserAuth = {...userAuth,profile_img:data.profile_img}

                        storeinSession("user" , JSON.stringify(newuserAuth))
                        setUserAuth(newuserAuth);

                        setUpdatedProfileImg(null)
                        toast.dismiss(loadintoast)

                        e.target.removeAttribute("disabled")
                        toast.success("Profile image Updated ")
                    })
                    .catch(({response})=>{
                        console.log('failsed');
                        toast.dismiss(loadintoast)

                        e.target.removeAttribute("disabled")
                        toast.error(response.data.error)
                    })
                }

            }).catch(err =>{
                console.log(err);
            })
        }
    }

    const handleSubmit= (e) =>{
         e.preventDefault()

        
         let form = new FormData(editProfileForm.current)
         
         let formData = {};

         for(let [key,value] of form.entries()){

            formData[key] = value
         }

         let {username,bio , facebook ,github ,instagram ,twitter , website , youtube} = formData;

         if(username.length < 3){
            return toast.error('Username shoul be atleast 3 letters long')
         }

         if(bio.length > bioLimit){
            return toast.error(`Bio should not be more than ${bioLimit}`)
         }

         let social_links ={
            facebook,
            github,
            instagram,
            twitter,
            website,
            youtube
         }

         let loadingtoast = toast.loading('Updating ...')
         e.target.setAttribute("disabled",true);

         axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/update-profile",{username,bio,social_links},{
            headers:{
                'Authorization' : `Bearer ${access_token}`
                }
            }
         ).then(({data})=>{
            if(userAuth.username != data.username){

                let newuserAuth = {...userAuth,username:data.username}

                storeinSession("user",JSON.stringify(newuserAuth))
                setUserAuth(newuserAuth)

               
    
               
            }

            toast.dismiss(loadingtoast)
            e.target.removeAttribute("disabled")
            toast.success('Updated')

               
         })
         .catch(({response})=>{
            toast.dismiss(loadingtoast)

            e.target.removeAttribute("disabled")
            toast.error(response.data.error)
         })
    }

    useEffect(()=>{
       
        if(access_token){
            axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/get-profile',{username: userAuth.username})
            .then(({ data })=>{
                setProfile(data)
                setLoading(false)
            })
            .catch(({response})=>{
                console.log(response.data.error);
            })
        }

      



    },[access_token])

    return(
        <AnimationWrapper>

              {
                loading ? <Loader /> :
                <form ref={editProfileForm} >
                    <Toaster />

                    <h1 className="max-md:hidden">Edit Profile</h1>

                    <div className="flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10">

                        <div className="max-lg:center mb-5 ">
                            <label className="relative block w-48 h-48 bg-grey rounded-full overflow-hidden" htmlFor="uploadImg" id="profileImglabel">
                                
                                 <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center text-white bg-black/30 opacity-0 hover:opacity-100 cursor-pointer">
                                    Upload Image
                                 </div>
                                 <img ref={profileImgelement} src={profile_img} alt="" />

                            </label>
                             
                             <input type="file" id="uploadImg" accept=".jpeg ,.png ,.jpg" hidden onChange={handleImagepreview} />

                             <button className="btn-light mt-5 max-lg:center lg:w-full px-10" onClick={handleImageupload}>Upload</button>
                        </div>

                        <div className="w-full">

                            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">

                                <div>
                                    <InputBox name="fullname" type="text" value={fullname} placeholder="FullName" icon="fi-rr-user" disable={true}/>
                                </div>
                                <div>
                                   <InputBox name="email" type="email" value={email} placeholder="Email" icon="fi-rr-envelope" disable={true}/>
                                </div>

                            </div>

                              <InputBox name="username" type="text" value={profile_username} placeholder="Username" icon="fi-rr-at" disable={false}/>

                              <textarea name="bio" maxLength={bioLimit} defaultValue={bio} className="input-box h-64 lg:h-40 leading-7 mt-5 pl-5 resize-none" placeholder="Bio" onChange={handleCharacterChange}></textarea>

                              <p className="mt-1 text-dark-grey" >{charactersLeft} Characters Left</p>
                               
                               <p className="my-6 text-dark-grey">Add your social handles below</p>

                               <div className="md:grid grid-cols-2 gap-x-6">

                                   {
                                     Object.keys(social_links).map((key,i)=>{

                                        let link = social_links[key]

                                        return <InputBox key={i} name={key} type="text" value={link} placeholder="http://" icon={"fi "+ (key != 'website' ? "fi-brands-" + key : 'fi-sr-globe')} />
                                     })
                                   }

                               </div>

                                <button className="btn-dark w-auto px-10" type="submit" onClick={handleSubmit}>Update</button>
                        </div>

                    </div>

                </form>
              }

        </AnimationWrapper>
    )
}

export default EditProfile