const storeinSession = (key, value) =>{
   return  sessionStorage.setItem(key, value)
}

const lookinSession = (key)=>{
  return sessionStorage.getItem(key)
}

const removeFromsession = (key)=>{
 return sessionStorage.removeItem(key)
}

export {storeinSession,lookinSession,removeFromsession}