import axios from 'axios'
import cookie from 'js-cookie'

const Axios = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_DEV_BASE_URL}/posts`,
    headers: { Authorization: `Bearer ${cookie.get("token")}` },
  });

export const createPost = async({image,body}) => {
    try {
        const res = await Axios.post('/',{image,body})
    } catch (error) {
        console.log(error)
    }
}

export const likeDislikePost = async (postId,username,setLikes,like=true) => {
    try {
        await Axios.patch(`/${postId}/like`);
        if (like) {
          setLikes((prev) => [...prev, username]);
        } else if (!like) {
          setLikes((prev) => prev.filter((like) => like !== username));
        }
      } catch (error) {
        console.log(error)
      }
}

export const savePost = async (postId,setSavedPosts,save = true) => {
    try {
        await Axios.post(`/${postId}/save`);
        if(save){
            setSavedPosts(prev=>[...prev,postId])
        }
        else if(!save) {
            setSavedPosts(prev=>prev.filter(post=>post !== postId))
        }
    } 
    catch (error) {
        
    }
}
export const getSinglePost = async (postId,setCurrentPost,setIsPostLiked) => {
    try {
        const post_id = postId.toString()
        const res = await Axios.get(`/${post_id}`)
        setCurrentPost(res.data.post)
        setIsPostLiked(res.data.post.likes.includes(user.username))
    } catch (error) {
        console.log(error)
    }
}

export const commentOnPost =async (postId,commentInput,setCommentInput,setPostComments) => {
    try {
        const res = await Axios.post(`/${postId}/comment`,{text:commentInput})
        setPostComments(prev=>[res.data.comment,...prev])
        setCommentInput('')
    } catch (error) {
        console.log(error)
    }
}