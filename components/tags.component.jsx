import { useContext } from "react"
import { EditorContext } from "../pages/editor.pages"

const Tag = ({tag,index})=>{

     let { blog ,  blog : { tags } , setBlog }  = useContext(EditorContext)

     const handleTagedit = (e)=>{
       
        if(e.keyCode == 13 || e.keyCode == 188){

            e.preventDefault()

            let currentag = e.target.innerText;
           
            tags[index] = currentag
            
            setBlog({...blog,tags})
            
            e.target.setAttribute('contentEditable',false)
        }
     }
     const handleTagdelete = () =>{

        tags = tags.filter(t => t != tag) ;
        
        setBlog({...blog, tags})

    
     }
     const addEditable = (e) =>{
      e.target.setAttribute('contentEditable',true)
      e.target.focus()
     }
     return(
        <div className="relative p-2 mt-2 mr-2 mx-5 bg-white rounded-full inline-block hover:bg-opacity-50 pr-8">
             <p className="outline-none"  onKeyDown={handleTagedit} onClick={addEditable}>{tag}</p>

             <button className="mt-[2px] rounded-full absolute right-3 top-1/2  -translate-y-1/2"  onClick={handleTagdelete}>
                 <i className="fi fi-rr-cross text-sm pointer-events-none" ></i>
            </button>
        </div>
        
     )
}

export default Tag