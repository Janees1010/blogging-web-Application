import { Toaster,toast } from "react-hot-toast"
import AnimationWrapper from "../common/page-animation"
import { useContext } from "react"
import { EditorContext } from "../pages/editor.pages"
import Tag from "./tags.component"
import axios from "axios"
import { UserContext } from "../App"
import { useNavigate, useParams } from "react-router-dom"


const Publishform= ()=>{
    let characterLimit = 200 ;
    let tagLimit = 10;

    let {blog_id} = useParams()

    let {setEditorState,blog,blog:{banner,title,tags,des,content}, setBlog} = useContext(EditorContext)
    let {userAuth:{access_token}} = useContext(UserContext)
    
    let navigate = useNavigate()

    const handleCloseevent = (e)=>{
     setEditorState('editor')
    } 
    const handleBlogtitleChange = (e)=>{
        let input = e.target.value;
        setBlog({...blog,title:input})
    }
    const handleBlogDesChange = (e)=>{
        let input = e.target;
        setBlog({...blog,des:input.value})
    }

    const handleDescriptionkey = (e)=>{
        if(e.keyCode== 13){
            e.preventDefault()
        }
    }

    const handleKeydown = (e)=>{
        if(e.keyCode == 13 || e.keyCode == 188){
          e.preventDefault()
          let tag =  e.target.value

           if(tags.length < tagLimit){

             if(!tags.includes(tag) && tag.length){
                setBlog({...blog,tags:[...tags , tag]})
             }

        }else{
            toast.error(`You can add Maximum ${tagLimit}`)
        }
        e.target.value = ''
    }
}
   const PublishBlog = async (e)=>{
     
    if(e.target.className.includes('disable')){
        return ;
    }

     if(!title.length){
        return toast.error('Plz provide a title for your blog')
     }
     if(!des.length || des.length > characterLimit){
        return toast.error(`Write a descriptionA bout your blog with in ${characterLimit} characters`)
     }
     if(!tags.length){
        return toast.error('Enter atleast one tag about your blog to identify the category')
     }

     let loadingToast = toast.loading('Publishing...');

     e.target.classList.add('disable')

     let blogObj ={
        title,banner,des,content,tags,draft:false
     }

      await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog",{...blogObj,id:blog_id},{
        headers: {
            'Authorization' :`Bearer ${access_token} `
        }
     }).then((data)=>{
        e.target.classList.remove('disable')

        toast.dismiss(loadingToast);
        toast.success('Published');

        setTimeout(() => {
            navigate('/dashboard/blogs')
        }, 500);

     }).catch(( { response } ) =>{
         e.target.classList.remove('disable');
         toast.dismiss(loadingToast);

         return toast.error(response.data.error)
     }

     )
   }
    return(
     <AnimationWrapper>

        <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4 ">

        <Toaster/>
         
         <button className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%] ">
         
           <i className="fi fi-rr-cross" onClick={handleCloseevent}></i>
         </button>
         
         <div className="max-w-[550px] center">
            <p className="text-dark-grey mb-1">Preveiew</p>
            <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
                <img src={banner} alt="" />
            </div>
            <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2">{title}</h1>

            <p className="font-gelasio line-clamp-2 text-xl   leading-7 mt-4  ">{des}</p>
          </div>
          <div className="border-grey lg-border-1 lg:pl-8 ">
                 <p className="text-dark-grey mb-2 mt-9"> Blog Title</p>
                 <input type="text" placeholder="Blog Title" defaultValue={title} className="input-box pl-4" onChange={handleBlogtitleChange}/>

                 <p className="text-dark-grey mb-2 mt-9">short Description about your blog</p>
                 
                 <textarea maxLength={characterLimit} defaultValue={des} className="h-40 resize-none leading-7 input-box pl-4 "
                   onChange={handleBlogDesChange}
                   onKeyDown={handleDescriptionkey}
                 >
                 </textarea>
                 
                 <p className="mt-1 text-dark-grey text-sm text-right">{characterLimit - des.length} characters left</p>
                 
                 <p className="text-dark-grey mb-2 mt-9">Topics - (Helps in searching and ranking your Blog post )</p>
            
                  <div className="input-box relative pl-2 py-2 pb-4">

                    <input type="text" placeholder="Topic" 
                     className="sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white" onKeyDown={handleKeydown}/>
                  
                  {
                     tags.map((tag,i)=>{
                       return <Tag tag={tag} index={i} key={i} />
                     })
                  }
                </div>
               <p className="mt-1 mb-4 text-dark-grey text-right">{tagLimit - tags.length} Tags left</p>
               
                <button className="btn-dark px-8" onClick={PublishBlog}>Publish</button>
            </div>

         
        </section>
     </AnimationWrapper>
    
    )}


export default Publishform