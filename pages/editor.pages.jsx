import {createContext, useContext, useEffect, useState} from 'react'
import { UserContext } from '../App'
import { Navigate, useParams } from 'react-router-dom'
import Blogeditor from '../components/blog-editor.component'
import Publishform from '../components/publish-form.component'
import Loader from '../components/loader.component';
import axios from 'axios'

const blogStructure ={
 title : '', 
 banner: '',
 content: [],
 tags :[],
 des: '',
 author :{personal_info:{ }} 
}

export const EditorContext = createContext({ });


const Editor = ()=>{

    let {blog_id} = useParams()

    const [blog, setBlog] = useState(blogStructure)
    const [EditorState, setEditorState] = useState('editor')
    const [textEditor, setTextEditor] = useState({isReady:false});
    const [loading , setLoading] = useState(true)


    let {userAuth,userAuth:{access_token}} = useContext(UserContext)

    useEffect(()=>{
       
        if(!blog_id){
            setLoading(false)
        }

      blog_id ?   axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/get-blog' , {blog_id , draft:true , mode: 'edit'})
        .then(({data:{blog}})=>{
           setBlog(blog)
           setLoading(false)
        })
        .catch(err=>{
            setBlog(null)
            setLoading(false)
        }) : ''
    },[])

    return(
        <EditorContext.Provider value={{blog,setBlog, EditorState,setEditorState , textEditor,setTextEditor}}>
             {
                access_token === null ? <Navigate to='/signin' /> : loading ? <Loader /> :
   
                EditorState == 'editor' ? <Blogeditor/> : <Publishform/>
             }
        </EditorContext.Provider>
      
       
    )
}

export default Editor