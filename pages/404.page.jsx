import { Link } from 'react-router-dom'
import pageNotfound from '../imgs/404.png'
import fulllogo from '../imgs/full-logo.png';
import lightPagenotfound from '../imgs/404-light.png'
import { useContext } from 'react';
import { ThemeContext } from '../App';

const PageNotFound = ()=>{

  let {theme} = useContext(ThemeContext)
  return(
    <section className="h-cover relative p-10 flex flex-col items-center gap-20 text-center">
          
       <img src={theme == 'dark' ? lightPagenotfound : pageNotfound} alt="" className='select-none border-2 border-grey w-72 aspect-square object-cover rounded' />
       
       <h2 className='text-4xl font-gelasio leading-7'>Page not found</h2>
       <p className='text-dark-grey text-xl leading-7 -mt-8'>The page you are looking for does not exist . Head back to <Link to='/'
       className='underline text-black'>Home page</Link></p>

       <div className='mt-auto'>
           <img src={fulllogo} alt="" className='h-8 object-contain block mx-auto select-none' />
           <p className='mt-5 text-dark-grey'>Read million of stories around the world</p>
       </div>

    </section>
  )
}

export default PageNotFound