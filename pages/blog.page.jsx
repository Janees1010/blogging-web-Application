
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import axios from 'axios'
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import { getDay } from "../common/date";
import BlogInteraction from "../components/blog-interaction.component";
import { createContext } from "react";
import BlogPostCard from "../components/blog-post.component";
import BlogContent from "../components/blog-content.component";
import CommentContainer, { fetchComment } from "../components/comments.component";

export const blogStrucure = {
  title:'',
  des:'',
  content:[],
  author:{personal_info:{ } },
  banner:'',
  publishedAt:'',
  comments : []
  
  
  

}

export const BlogContext = createContext({ })

const BlogPage = ()=>{

    let {blog_id} = useParams()

    let [blog,setBlog] = useState(blogStrucure)
    const [loading,setLoading] = useState(true)
    const [similarBlogs , setSimilarBlogs] = useState(null)
    const [islikedByUser , setLikedByUser] = useState(false)
    const [commentWrapper, setCommentWrapper] = useState(false)
    const [totalParentCommentsLoaded,setTotalParentCommwntsLoaded] = useState(0)

    let {title,banner,des,content,activity,author:{personal_info:{fullname,username:author_username,profile_img}}
    ,publishedAt} = blog

    const fetchBlog =  ()=>{
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog",{blog_id})
        .then(async({data:{blog}})=>{

       blog.comments = await fetchComment({blog_id:blog._id, setParentCommentCount:setTotalParentCommwntsLoaded})
            
            setBlog(blog)

           console.log(blog);

            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs" ,
             {tag:blog.tags[0], limit:6,eliminate_blog : blog_id})
            .then(({ data })=>{

              setSimilarBlogs(data.blogs)
            

            })

            setBlog(blog)
            setLoading(false)
        })
        .catch(err=>{
            console.log(err);
            setLoading(false)
        })
    }

    useEffect(()=>{

        resetstates()
        fetchBlog()

    },[blog_id])

    const resetstates = ()=>{
        setBlog(blogStrucure)
        setSimilarBlogs(null)
        setLoading(true)
        setLikedByUser(false);
        setCommentWrapper(false)
        setTotalParentCommwntsLoaded(0)
    } 

    return(
       <AnimationWrapper>
         {
            loading ? <Loader /> : 

         <BlogContext.Provider value={{blog ,setBlog , islikedByUser,setLikedByUser
         ,commentWrapper,setCommentWrapper,totalParentCommentsLoaded,setTotalParentCommwntsLoaded}} >

            <CommentContainer />

            <div className="max-w-[900px] center py-10 max-lg:px-[5vw]"> 
               
               <img src={banner} alt="" className="aspect-video  " />

               <div className="mt-12">
                   <h2>{title}</h2>

                   <div className="flex max-sm:flex-col justify-between my-8 ">

                   <Link className="" to={`/user/${author_username}`} > 
                       
                   <div className="flex gap-4 items-start">

                        <img src={profile_img} alt="" className="w-12 h-12 rounded-full" />

                        <p className="capitalize mt-1 text-2xl">{fullname} </p>

                      </div>

                  </Link>
                      

                      <p className="text-dark-grey opacity-75 max-sm:mt-2 max-sm:ml-12 max-sm:pl-5">Published on {getDay(publishedAt)}</p>
                   </div>

               </div>

              <BlogInteraction />

                <div className="my-12 font-gelasio blog-page-content">
                      
                {
                         content[0].blocks.map((block,i)=>{
                            return <div key={i} className="my-4 md:my-8">
                                 <BlogContent block={block} />
                            </div>
                         })
                      }

                </div>

              <BlogInteraction />

              {
                similarBlogs != null && similarBlogs.length ?
                <>
                    <h1 className="text-2xl mt-14 mb-10 font-medium">Similar Blogs</h1>

                    {
                        similarBlogs.map((blog,i)=>{

                            let {author:{personal_info} } = blog;

                            return <AnimationWrapper key={1} transition={{duration:1,delay:i*0.08}}>
                                   
                                      <BlogPostCard content={blog} author={personal_info} /> 

                                  </AnimationWrapper>
                        })
                    }
                </>
                : ' '
              }

            </div>

         </BlogContext.Provider>
         }
       </AnimationWrapper>
    )
}

export default BlogPage