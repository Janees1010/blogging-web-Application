import { useContext } from "react"
import AnimationWrapper from "../common/page-animation"
import {Link} from 'react-router-dom'
import { UserContext } from "../App"
import { removeFromsession } from "../common/session"

const UserNavigationpanel = ()=>{
    const {userAuth :{username},setUserAuth} = useContext(UserContext)
    const signOutuser = ()=>{
        removeFromsession('user');
        setUserAuth({access_token : null})

    }
 return(
 <AnimationWrapper
  transition={{duration:0.2}}
  className='absolute right-0 z-50'
  >
   <div className="bg-white absolute right-0 mt-8 border border-grey w-60  duration-200">
      <Link to='/editor' className="flex gap-2 link md:hidden pl-8 py-4">
      <i className="fi fi-rr-file-edit"></i>
               <p>Write</p>
      </Link>
      <Link to={`/user/${username}`} className="link pl-8 py-4">
        profile  
      </Link>
      <Link to="/dashboard/blogs" className="link pl-8 py-4">
         Dashboard
      </Link>
      <Link to="/settings/edit-profile" className="link pl-8 py-4">
          settings
      </Link>
      <span className="absolute border-t border-grey w-[100%"></span>

      <button className="text-left p-4 hover:bg-grey w-full pl-8 py-4" onClick={signOutuser}>
         <h1 className="font-bold text-xl mb-1 ">Sign out</h1>
         <p className="text-dark-grey">@{username}</p>
      </button>
   </div>
 </AnimationWrapper>
 )
}

export default UserNavigationpanel