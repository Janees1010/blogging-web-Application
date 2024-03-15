import { useContext } from "react"
import { BlogContext } from "../pages/blog.page";
import CommentField from "./comment-field.component";
import axios from "axios";
import NoDataMessage from "./nodata.component";
import AnimationWrapper from "../common/page-animation";
import CommentCard from "./comment-card.component";

export const fetchComment = async({skip = 0, blog_id, setParentCommentCount, comment_array = null})=>{

      let res;
      
      
       await axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/get-blog-comments',{blog_id,skip})
      .then(({data})=>{

            data.map((comment, i) => {
                  comment.childrenLevel = 0;
                });
      
            setParentCommentCount(preval => preval + data.length)

            

            if(comment_array == null){
                  res = { results:data }
            }else{
                  res = { results:[...comment_array,...data] }
            }

            console.log(res);
      })

      return res;

}

const CommentContainer =()=>{

   let {blog,setBlog,blog:{_id,title,comments:{results : commentsArr},activity:{total_parent_comments}},commentWrapper,setCommentWrapper,totalParentCommentsLoaded,setTotalParentCommwntsLoaded} = useContext(BlogContext)
    
   const loadmoreComment = async () =>{
      let newCommentArr = await fetchComment({skip:totalParentCommentsLoaded,blog_id:_id,setParentCommentCount:setTotalParentCommwntsLoaded,comment_array:commentsArr})

      setBlog({...blog,comments:newCommentArr})
   }
   
    return(
        <div className={"max-sm:w-full fixed " + (commentWrapper ? "top-0  sm:right-0" : "top-[100%] sm:right-[-100%] right-[-100%]") + 
        " max-sm:right-0 sm:top-0 w-[30%] min-w-[350px] h-full z-50 bg-white shadow-2xl p-8 px-16 overflow-y-auto overflow-x-hidden right-0 duration-900 "}>
              
              <div className="relative">
                    <h1 className="text-xl font-medium ">Comments</h1>
                    <p className="text-lg mt-2 w-[70%] text-dark-grey line-clamp-1">{title}</p>

                    <button className="absolute top-0 right-0 flex justify-center items-center w-12 h-12 rounded-full" onClick={()=> setCommentWrapper(preVal => !preVal)}>
                      <i className="fi fi-rr-cross-small text-3xl mt-1"></i>
                    </button>
              </div>

              <hr className="border-dark-grey/50 my-8 w-[120%] -ml-10" />

              <CommentField action="comment" /> 

              {
                 commentsArr && commentsArr.length ? 
                 commentsArr.map((comment,i)=>{
                 
                   return<AnimationWrapper key={i}>
                         <CommentCard index={i} leftVal={comment.childrenLevel * 4} commentData={comment} />
                   </AnimationWrapper>

                 }) : <NoDataMessage message={"No comments"} />
              }

              {
                  
                  total_parent_comments > totalParentCommentsLoaded ? 
                  <button className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2" onClick={loadmoreComment}>Load more</button>

                  : ' '
              }
        </div>
    )
}
 
export default CommentContainer