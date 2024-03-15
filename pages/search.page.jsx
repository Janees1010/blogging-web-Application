import { useParams } from "react-router-dom"
import InPageNavigation from "../components/inpage-navigation.component"
import { useState } from "react"
import Loader from "../components/loader.component"
import AnimationWrapper from "../common/page-animation"
import BlogPostCard from "../components/blog-post.component"
import NoDataMessage from "../components/nodata.component"
import LoadMorebtn from "../components/load-more.component"
import { filterPaginationData } from "../common/filter-pagination-data"
import { useEffect } from "react"
import UserCard from "../components/usercard.component"
import axios from 'axios'


const SearchPage = ()=>{

    let {query} = useParams()

    let [blogs , setBlog] = useState(null)
    let[users,setUsers] = useState(null)

    const searchBlog = ({ page = 1 , create_new_arr = false})=>{

         axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs" , { query , page })
         .then(async({data})=>{

            let formateData = await filterPaginationData({
                state: blogs,
                data:data.blogs,
                page,
                countRoute: '/search-blogs-count',
                data_to_send:{query,page},
                create_new_arr

              })
              console.log(formateData);
              setBlog(formateData) 
        })
        .catch(err =>{
            console.log(err);
        })
    }

    const fetchUsers = ()=>{
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-users" , {query})
        .then(async({data:{users}})=>{
            console.log(users);
            await setUsers(users)
        })
        .catch(err=>{
            console.log(err.message);
        })
    }

    useEffect(()=>{
         resetState()
        searchBlog({page:1,create_new_arr:true});
        fetchUsers();

    },[query])

    const resetState = ()=>{
        setBlog(null)
        setUsers(null)
    }

    const UserCardWraper = () =>{
       
        return(
           <>
               {
                   users == null ? <Loader /> :
                   users.length ? users.map((user,i)=>{
                       return <AnimationWrapper key={i} transition={{duration:1,delay:i*0.08}}>
                                <UserCard user={user} />
                             </AnimationWrapper> 
                       }) :
                   <NoDataMessage message={'No user found'} />
               }
           </>
        )
       
    }
    return(
        <section className="h-cover flex justify-center gap-10 ">
            
            <div className="w-full">
                <InPageNavigation routes={['Blogs',"Accounts Matched"]} 
                  defaultHidden={["Accounts Matched"]}>
                      <>

                        {
                            blogs == null ? <Loader/> :
                            blogs.results.length ? 
                            blogs.results.map((blog,i)=>{
                                return (
                                    <AnimationWrapper transition={{duration:1,delay:i*.1}} key={i}>
                                         <BlogPostCard content={blog} author={blog.author.personal_info}/>
                                    </AnimationWrapper>
                                )
                            })
                            : <NoDataMessage message={`No blogs Related to ${query}`} />
                        }
                       
                        <LoadMorebtn state={blogs} fetchData={searchBlog} />
  
                      </>

                      <UserCardWraper />
                
                </InPageNavigation>

            </div>

            <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
                  <h1 className="font-medium text-xl mb-8 "> users related to search <i className="fi fi-rr-user mt-1"></i> </h1>
                  
                  <UserCardWraper />
            </div>

        </section>
    )
}

export default SearchPage