import { useContext, useEffect, useState } from 'react';
import logo from '../imgs/logo.png';
import {Link,Navigate,Outlet, useNavigate} from 'react-router-dom'
import { ThemeContext, UserContext } from '../App';
import UserNavigationpanel from './user-navigation.component';
import axios from 'axios';
import { storeinSession } from '../common/session';
import ligthlogo from '../imgs/logo-light.png'

const Navbar = () =>{
    const [searchboxvisisbility,setsearchboxVisisbility]= useState(false)
    const [userNavpanel , setUsernavPanel] = useState(false);

    let {theme,setTheme}  = useContext(ThemeContext)
   
    let navigate = useNavigate()

    const {userAuth,userAuth:{access_token , profile_img,new_notification_available},setUserAuth} = useContext(UserContext)
    const handleUsernavpanel = ()=>{
     setUsernavPanel(currentval => !currentval)
   }

   const handleSearch = (e)=>{
    let query = e.target.value;

    if(e.keyCode == 13 && query.length){
           navigate(`/search/${query}`)
    }
    setsearchboxVisisbility(value => !value)
  }

    const handleBlur = ()=>{
      setTimeout(() => {
        setUsernavPanel(false)
      }, 100);

      
    
   }

   const changetheme = ()=>{

     let newTheme = theme == "light" ? "dark" : 'light'
     
     setTheme(newTheme)

     document.body.setAttribute("data-theme",newTheme)

     storeinSession('theme',newTheme);
   }

   useEffect(()=>{
      
          if(access_token){
            axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/new-notification",{
              headers:{
                'Authorization' : `Bearer ${access_token}`
              }
            }).then(({data})=>{
                 setUserAuth({...userAuth,...data})
            })
            .catch(err=>{
              console.log(err);
            })
          }

   },[access_token])

    return(
      <>
         <nav className="navbar z-50">

         <Link to='/' className='flex-none w-10' >
           <img src={theme == 'light' ? logo : ligthlogo} alt="" className='flex-none w-10' />
         </Link>

         <div className={'absolute top-full  left-0 bg-white mt-0  w-full border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show ' + ( searchboxvisisbility? 'show' : 'hide')}>

           <input
             type='text'
             placeholder='Search'
             className='w-full md:w-auto  bg-grey p-4 [l-6 pr-[12% ] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12 '
             onKeyDown={handleSearch}
           />

           <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>

         </div>

         <div className='flex items-center gap-3 md:gap-6 ml-auto '>

            <button className='md:hidden text-xl w-12 h-12 bg-grey rounded-full flex items-center justify-center' onClick={()=>{

                 setsearchboxVisisbility(value=>!value)}}>
                <i className="fi fi-rr-search"></i>

            </button>

            <Link to='/editor' className='hidden md:flex gap-2 link'>
              <i className="fi fi-rr-file-edit"></i>
               <p>Write</p>
            </Link>

            <button className='w-12 h-12 bg-grey relative rounded-full hover: bg-black/10' onClick={changetheme}>
                     <i className={"fi " + ( theme == 'light' ? "fi-rr-moon-stars" : "fi-rr-brightness") + "  text-2xl block mt-1"} ></i>
           </button>

            {
              access_token ? 
               <>
                 <Link to='/dashboard/notifications'>
                   <button className='w-12 h-12 bg-grey relative rounded-full hover: bg-black/10'>
                    <i className="fi fi-bs-bell block mt-1"></i>

                    {
                       new_notification_available ?  <span className='bg-red w-3 h-3 rounded-full absolute z-10 top-2 right-3.5'></span> : ''
                    }
                   
                   </button>
                 </Link>
                 <div className="relative " onClick={handleUsernavpanel} onBlur={handleBlur}>
                   <button className='w-12 h-12 mt-1 '>
                     <img src={profile_img} className='w-full h-full object-cover rounded-full' />
                   </button>
                 </div>
                 {
                  userNavpanel ?  <UserNavigationpanel/> : ''
                 }
                 
               </>
               :
               <>
                  <Link className='btn-dark py-2' to={'/signin'}>
                        Sign In
                  </Link>
                  <Link className='btn-light py-2 hidden md:block' to={'/signup'} >
                      Sign Up
                  </Link>
               </>
            }
           
         </div>
      </nav>
      <Outlet />
      </>
      
    )
}
export default Navbar