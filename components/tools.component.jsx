
///importing tools /
import Embed from '@editorjs/embed' ;
import List from '@editorjs/list' ;
import Image from '@editorjs/image' ;
import Header from '@editorjs/header';
import Quote from '@editorjs/quote';
import Marker from '@editorjs/marker';
import InlineCode from '@editorjs/inline-code'
import {uploadImage} from '../common/aws'

const uploadImageByURL =  (e)=> {
 let link = new Promise(( resolve,reject )=>{
     try {
        resolve(e)
     }
     catch(err) {
        reject(err)
     }
 })
     return link.then((url)=> {
        return {
            success: 1,
            file: { url }
        };
     }).catch(err=>{
        console.log('failed');
        console.log(err);
     })
     
   
 }

 const uploadImageByfile = (e) => {
   return uploadImage(e).then(url=>{
    if(url){
        return {
            success : 1,
            file :{ url }
        }
    }
   })
 }

export const tools = {
 embed:Embed,
 list: {
    class:List,
    inlinToolbar:true
 },
 image: {
    class:Image,
      config:{
        uploader: {
           uploadByUrl : uploadImageByURL,
           uploadByFile:uploadImageByfile
      }
  }
},
 header: {
    class:Header,
    config:{
        placeholder:'Type Heading...',
        levels:[2,3],
        defaultLevel:2

    }
 },
 quoate: {
  class:Quote,
  inlinToolbar:true
 },
 marker:Marker,
 inlinecode:InlineCode
}
