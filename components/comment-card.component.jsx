import { useContext, useState } from "react"
import { getDay } from "../common/date"
import { UserContext } from "../App"
import {toast,Toaster} from 'react-hot-toast'
import CommentField from "./comment-field.component"
import { BlogContext } from "../pages/blog.page"
import axios from "axios"

const CommentCard = ({index,leftVal,commentData})=>{

     
    
     let {commented_by:{personal_info:{username:commented_by_username,fullname,profile_img}},commentedAt,comment,_id,children} = commentData
     

     let {userAuth:{access_token,username}} = useContext(UserContext)

     let {blog,blog:{comments,activity,activity:{total_parent_comments},comments:{results:commentsArr},author:{personal_info:{username:blogauthor_username}}},setBlog,setTotalParentCommwntsLoaded} = useContext(BlogContext)

     const [isReplying,setReplying] = useState(false)

     const getParentIndex = ()=>{

        let startingpoint = index-1;

        try{
            while(commentsArr[startingpoint].childrenLevel >= commentData.childrenLevel){
                startingpoint--;
            }
        } catch{
            startingpoint = undefined;
        }

        return startingpoint;

       
     }

     const removeCommentCards = (startingpoint,isDelete = false)=>{
          
        if(commentsArr[startingpoint]){
           
            while(commentsArr[startingpoint].childrenLevel > commentData.childrenLevel){
                commentsArr.splice(startingpoint,1)

                if(!commentsArr[startingpoint]){
                    break ;
                }
            }

        }
       
        if(isDelete){

            let parentIndex = getParentIndex(); 

            if(parentIndex != undefined){
                commentsArr[parentIndex].children = commentsArr[parentIndex].children.filter(child => child != _id)

                if(!commentsArr[parentIndex].children.length){
                    commentsArr[parentIndex].isReplyLoaded = false
                }
            }

            console.log(index);

            commentsArr.splice(index,1)

        }

        if(commentData.childrenLevel == 0 && isDelete ){
            setTotalParentCommwntsLoaded(preval =>  preval -1)
        }

        setBlog({...blog,comments:{results:commentsArr},activity:{...activity,total_parent_comments:total_parent_comments - (commentData.childrenLevel == 0 && isDelete ? 1 : 0)}})
     }
     
     const handleReplyClick = ()=>{
           
        if(!access_token){
          return toast.error('Login first to leave a reply')
        }

        setReplying(preval => !preval);
     }
     
     const hideReplies = ()=>{
        commentData.isReplyLoaded = false
        removeCommentCards(index + 1)
     }

     const deleteComments = (e) =>{
        e.target.setAttribute("disabled",true)

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/delete-comment',{_id},{
          headers:{
              'Authorization' :`bearer ${access_token}`
          }
        }).then(()=>{
          e.target.removeAttribute("disabled");
          removeCommentCards(index + 1,true)
        })
        .catch(err=>{
          console.log(err);
        })
     }

     const Loadreplies = ({skip = 0, currentIndex = index})=>{
         
        if(commentsArr[currentIndex].children.length){
            hideReplies()

            console.log(commentsArr[currentIndex]);

            axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/get-replies',{_id:commentsArr[currentIndex],skip})
            .then(({data:{replies}})=>{

                console.log(replies);
                commentsArr[currentIndex].isReplyLoaded = true ;

                for(let i = 0; i < replies.length; i++ ){
                    replies[i].childrenLevel = commentsArr[currentIndex].childrenLevel + 1

                    commentsArr.splice(currentIndex + 1 + i + skip , 0 ,replies[i])
                }

                setBlog({...blog,comments:{...comments,results:commentsArr}})
            })
            .catch(err=>{
                console.log(err);
            })
        }
    }

    const LoadmoreReplies = ()=>{

        let parentIndex = getParentIndex(); 

    let btn =  <button className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2" onClick={() => Loadreplies({skip:index - parentIndex, currentIndex:parentIndex})}>Load more replies</button>
        if(commentsArr[index + 1]){
            if(commentsArr[index + 1].childrenLevel < commentsArr[index].childrenLevel){
                if((index - parentIndex) < commentsArr[parentIndex].children.length){

                    return btn ;
                }
               
            }

        }else {
            if(parentIndex){

              if((index - parentIndex) < commentsArr[parentIndex].children.length){

                  return btn ;
              }
            }
         }
        
    }
     
    return(
          
   
          
       <div className="w-full" style={{paddingLeft:`${leftVal * 10}px`}}>

        <div className="my-5 p-6 rounded-md border border-grey">
              
              <div className="flex gap-3 items-centre mb-8">
                   <img src={profile_img} alt="" className="w-6 h-6 rounded-full" />

                   <p className="line-clamp-1">{fullname}</p>
                   <p className="min-w-fit ">{getDay(commentedAt)}</p>

              </div>

              <p className="font-gelasio text-xl ml-3">{comment}</p>

              <div className="flex items-center gap-5 mt-5">
                    {
                        commentData.isReplyLoaded ? 

                        <button className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2" onClick={hideReplies}>
                           <i className="fi fi-rr-comment-alt-dots"></i> Hide reply
                        </button> : 
                           
                           <button className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2" onClick={Loadreplies}>
                           <i className="fi fi-rr-comment-alt-dots"></i> {children.length} reply
                        </button>
   

                    }
                    <button onClick={handleReplyClick}>Reply</button>

                    {
                        username == commented_by_username || username == blogauthor_username ? 

                        <button className="p-2 px-3 rounded-md border border-grey ml-auto hover:bg-red/30 hover:text-red flex items-center" onClick={deleteComments}><i className="fi fi-rr-trash pointer-events-none"></i></button>  : ' '
                    }
              </div>



              {
                isReplying ? 

                <div className="mt-8">
                  <CommentField action='Reply' index={index} replyingTo={_id} setReplying={setReplying} />
                </div>

                : ''
              }
        </div>

           <LoadmoreReplies />

       </div>
    )
}

export default CommentCard