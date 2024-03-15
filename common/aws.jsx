
import axios from 'axios'

export const  uploadImage = async  (img)=>{
 
let imgUrl = null 

await axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/get-upload-url").then(async({ data:{uploadURL}})=>{
 console.log('success');

 await axios({
      method:'PUT',
      url:uploadURL,
      headers:{ 'Content-Type' : 'multipart/form-data'},
      data:img
 
 }).then(()=>{
     imgUrl = uploadURL.split("?")[0]
 }).catch(err=>{
     console.log('failed');
     console.log(err);
 })
})

return imgUrl
}
