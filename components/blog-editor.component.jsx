import {Link, useNavigate, useParams} from 'react-router-dom'
import logo from '../imgs/logo.png'
import lightlogo from '../imgs/logo-light.png'
import AnimationWrapper from '../common/page-animation'
import Blogbanner from '../imgs/blog banner.png'
import darkblogBanner from '../imgs/blog banner dark.png'
import {uploadImage} from '../common/aws'
import { useContext, useRef } from 'react'
import {toast,Toaster} from 'react-hot-toast'
import { EditorContext } from '../pages/editor.pages'
import { useEffect } from 'react'
import EditorJS from '@editorjs/editorjs'
import { tools } from './tools.component'
import { ThemeContext, UserContext } from '../App'
import axios from 'axios'

const Blogeditor= ()=>{

    
    let {blog, blog: {title,banner,content,des,tags},setBlog , textEditor,setTextEditor, setEditorState} = useContext(EditorContext)
    let {userAuth:{access_token}} = useContext(UserContext)

    let {theme}  = useContext(ThemeContext)
     
    
    let {blog_id} = useParams()
     
    let navigate = useNavigate()

    useEffect(()=>{
        if(!textEditor.isReady){
            setTextEditor(new EditorJS({
                holderId : 'textEditor' ,
                data : Array.isArray(content) ? content[0] : content ,
                tools: tools,
                placeholder:"Let's Write An awesome Story "
               }))
        }
        
    }, [])

    const HandleBannerUpload =  (e)=>{
        let img = e.target.files[0];
        console.log( e.target.files[0]);

         if(img){

            let loadingToast = toast.loading('uploading...')

            uploadImage(img).then((url)=>{
                if(url){
                  toast.dismiss(loadingToast)
                  toast.success('uploaded')
                  setBlog({...blog,banner:url})
                }
            })
            .catch(err=>{
                toast.dismiss(loadingToast)
                return toast.error(err)
            })
         }
    }
    const handleTitlekey = (e)=>{
        if(e.keyCode== 13){
            e.preventDefault()
        }
    }

    const handleTitleChange = (e)=>{
        let input = e.target;
        input.style.height = 'auto';
        input.style.height = input.scrollHeight + 'px'

        setBlog({...blog, title:input.value})
    }
    const handlebannerError = (e)=>{
       let img = e.target;
       img.src= theme == 'light' ? Blogbanner : darkblogBanner
    }
    const handlePublishevent = (e)=>{
       
         if(!banner.length){
            return toast.error('Upload a blog banner for blog')
         }  

        if(!title.length){
           return toast.error('Plz add a Title for Your Blog')
         }
        
        if(textEditor.isReady){
            textEditor.save().then(data=>{

               if(data.blocks.length){
                 setBlog({...blog, content:data})
                 setEditorState('publish')
               }else{
                return toast.error('Plz Write the content for your Blog')
               }
            }).catch(err=>{
                console.log(err);
            })
        }
    }
     const handlesaveDraft =  (e)=>{
       
        if(e.target.className.includes('disable')){
            return ;
        }
    
         if(!title.length){
            return toast.error('Plz provide a title before saving it as draft')
         }
      
    
         let loadingToast = toast.loading('Saving...');
    
         e.target.classList.add('disable')
          if(textEditor.isReady){
            textEditor.save().then((content)=>{
                let blogObj ={
                    title,banner,des,content,tags,draft:true
                 }
            
                axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog",{...blogObj,id:blog_id},{
                    headers: {
                        'Authorization' :`Bearer ${access_token} `
                    }
                 }).then((data)=>{
                    e.target.classList.remove('disable')
            
                    toast.dismiss(loadingToast);
                    toast.success('Saved');
            
                    setTimeout(() => {
                        navigate('/dashboard/blogs?tab=draft')
                    }, 500);
            
                 }).catch(( { response } ) =>{
                     e.target.classList.remove('disable');
                     toast.dismiss(loadingToast);
            
                     return toast.error(response.data.error)
                 })
            
            })
          }
       
         
     }
    return(
       <>
         <nav className="navbar">
         <Link to='/' className='flex-none w-10'>
            <img src={theme == 'light' ? logo : lightlogo}  alt="" />
         </Link>
         <p className='max-md:hidden text-black line-clamp-1 w-full '> {title.length ? title : 'New Blog'}</p>
         <div className='flex gap-4  ml-auto'>
           <button className='btn-dark py-2' onClick={handlePublishevent}>Publish</button>
           <button className='btn-light py-2' onClick={handlesaveDraft}>Save Draft</button>
         </div>
         </nav>
         <Toaster/>
         <AnimationWrapper>
         <section>
                <div className='mx-auto max-w-[900px] w-full'>
                  <div className='relative aspect-video bg-white border-4 border-grey hover:opacity-80' >
                     <label id='uploadBanner'>
                        <img  src={banner} alt="" className='z-20' onError={handlebannerError} />
                        <input id='uploadBanner' type='file' accept=".png, .jpg, .jpeg" hidden
                        onChange={HandleBannerUpload}
                        />
                     </label>
                  </div>

                  <textarea placeholder='Blog Title' defaultValue={title} className='text-4xl bg-white font-medium outline-none mt-10 w-full h-20 resize-none leading-tight placeholder:opacity-40'
                  
                   onKeyDown={handleTitlekey}
                   onChange={handleTitleChange}
                  >
                  </textarea>

                  <hr className='w-full opacity-10 my-5' />

                  <div id='textEditor' className='font-gelasio' >

                  </div>

                </div>

            </section>
         </AnimationWrapper>
        
       </>
    )
}

export default Blogeditor