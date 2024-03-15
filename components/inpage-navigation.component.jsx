import { useEffect, useRef, useState } from "react";
export let activeTabLineref;
export let activeTab;

const InPageNavigation = ({routes, defaultHidden = [ ], defaultActiveIndex = 0 , children})=>{

     activeTabLineref = useRef();
     activeTab = useRef();

    let [inPageNavIndex,setInPageNavIndex] = useState(defaultActiveIndex)

    let [width, setWidth] = useState(window.innerWidth)
    let [isResizeEventAdded , setIsResizeEventAdded] = useState(false)

    const changePageState = (btn , i)=>{
      
        let { offsetWidth, offsetLeft } = btn ;

        activeTabLineref.current.style.width = offsetWidth + 'px' ;
        activeTabLineref.current.style.left = offsetLeft + 'px' ;

        setInPageNavIndex(i)

    }

    useEffect(()=>{

      if(width > 766 && inPageNavIndex != defaultActiveIndex  ){

        changePageState(activeTab.current , defaultActiveIndex)

      }
      if(!isResizeEventAdded){

         window.addEventListener('resize',()=>{
          
          if(!isResizeEventAdded){
             setIsResizeEventAdded(true)
          }

          setWidth(window.innerWidth) 
        })
      }

    },[width])

     return (
        
        <>
          
          <div className="relative mb-8 bg-white border-b border-grey flex-nowrap overflow-x-auto">

             {
                routes.map((route,i)=>{
                    return (
                      <button ref={ i == defaultActiveIndex ? activeTab : null} key={i} className={"p-4 px-5 capitalize " + 
                      ( inPageNavIndex == i  ? 'text-black' : 'text-dark-grey ') +(defaultHidden.includes(route) ? "md:hidden" : ' ') }
                      onClick={(e)=> {changePageState(e.target,i)}} 
                      >
                            {route}
                      </button>
                    ) ;
                })
             }

             <hr ref={activeTabLineref} className="absolute bottom-0 duration-300" />
              
          </div>
           {
             Array.isArray(children) ? children[inPageNavIndex] : children
           }
        </>
     )
}

export default InPageNavigation