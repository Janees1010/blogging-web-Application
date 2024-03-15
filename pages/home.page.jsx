import { useEffect, useState,useRef } from "react"
import AnimationWrapper from "../common/page-animation"
import InPageNavigation from "../components/inpage-navigation.component"
import axios from 'axios'
import Loader from "../components/loader.component"
import BlogPostCard from "../components/blog-post.component"
import MinimalBlogPost from "../components/nobanner-blog-post.component"
import { activeTabLineref , activeTab } from "../components/inpage-navigation.component"
import NoDataMessage from "../components/nodata.component"
import {filterPaginationData } from "../common/filter-pagination-data"
import LoadMorebtn from "../components/load-more.component"

const HomePage = ()=>{

     let [blogs ,setBlogs]= useState(null);
   
     let [Trendingblogs ,setTrendingBlogs]= useState(null);
     let [pageState,setPageState] = useState("home")

     let categories  = ["programing","technology","hollywood","social media","finance","self improvement","travel","cooking"]

     const fetchLatestBlogs = ({ page = 1 })=>{
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/latest-blogs',{ page }) 
        .then(async({data})=>{
          
           let formateData = await filterPaginationData({
             state: blogs,
             data:data.blogs,
             page,
             countRoute: '/all-latest-blogs-count'
           })
           
           console.log(formateData);
           setBlogs(formateData)
        })
        .catch(err =>{
            console.log(err);
        })
     };

     const fetcBlogsByCategory = ({page = 1})=>{

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/search-blogs',{tag: pageState ,page}) 
        .then(async({data})=>{

            let formateData = await filterPaginationData({
                state: blogs,
                data:data.blogs,
                page,
                countRoute: '/search-blogs-count',
                data_to_send:{tag:pageState ,page}

              })
              
              console.log(formateData);
              setBlogs(formateData)

           
           
        })
        .catch(err =>{
            console.log(err);
        })
     }


     const fetchTrendinBlogs = ()=>{
        
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + '/trending-blogs') 
        .then(({data})=>{
            setTrendingBlogs(data.blogs)
            
        })
        .catch(err =>{
            console.log(err);
        })

     }

     const loadBlogByCategory = (e)=>{

        let category = e.target.innerText.toLowerCase();

        setBlogs(null)

        if(category == pageState){
            setPageState("home");
            return;
        }

        setPageState(category)

     }

     useEffect(()=>{
       
         activeTab.current.click();

        if(pageState == "home"){
            fetchLatestBlogs({page:1});
        }else{
            fetcBlogsByCategory({page:1})
        }

        if(!Trendingblogs){
           fetchTrendinBlogs();
        }
        
    
        
     },[pageState])

     return(
        <AnimationWrapper>

            <section className="h-cover flex justify-center gap-10 ">
            
              <div className="w-full">
                 
                 <InPageNavigation routes={[ pageState,'trending blogs']} defaultHidden={['trending blogs']}>
                      
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
                        : <NoDataMessage message={'No blogs Related to this topic'} />
                      }
                       <LoadMorebtn state={blogs} fetchData={(pageState == 'home' ? fetchLatestBlogs : fetcBlogsByCategory)} />
                      </>
                        
                        {
                            Trendingblogs == null ? <Loader/>  : 
                            
                            Trendingblogs.length ? 
                            Trendingblogs.map((blog,i)=>{
                                return (
                                    <AnimationWrapper transition={{duration:1,delay:i*.1}} key={i}>
                                         <MinimalBlogPost blog={blog} index={i} />
                                    </AnimationWrapper>
                                )
                            })
                            : <NoDataMessage message={'No trennding blogs'} />
                        }
    


                      

                 </InPageNavigation>

              </div> 

              <div className="min-w-[40%] lg-min-w[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
                 
                 <div className="flex flex-col gap-10">

                    <h1 className="font-medium text-xl mb-6">Stories  from all intersts </h1>

                    <div className="flex gap-3 flex-wrap ">
                        {
                            categories.map((category,i)=>{
                                return (
                                    <button onClick={loadBlogByCategory} key={i} className={"tag " + (pageState == category ? " bg-black text-white " : " ")} >
                                        {category}
                                    </button>
                                )
                            })
                            
                        }
                    </div>
                     
                 

                 <div>

                    <h1 className="font-medium text-xl mb-8 ">Trending <i className="fi fi-rr-arrow-trend-up"></i></h1>
                      
                       
                    {
                            Trendingblogs == null ? <Loader/> :
                            Trendingblogs.length ? 
                            Trendingblogs.map((blog,i)=>{
                                return (
                                    <AnimationWrapper transition={{duration:1,delay:i*.1}} key={i}>
                                         <MinimalBlogPost blog={blog} index={i} />
                                    </AnimationWrapper>
                                )
                            })
                            : <NoDataMessage message={'No trending blogs'} />
                        }
                 
                 </div>
                </div>
              </div>

            </section>

        </AnimationWrapper>
      
     )
}

export default HomePage