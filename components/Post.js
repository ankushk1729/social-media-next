import {CommentIcon,HeartIcon,BookmarkIcon,FilledHeartIcon,FilledBookmarkIcon,SendIcon} from '../utils/svgs'
import Image from 'next/image'
import Comment from './Comment'
import {useState,useRef} from 'react'
import axios from 'axios'
import cookie from 'js-cookie'
import {commentOnPost, likeDislikePost,savePost}  from '../utils/postActions'
import {useRouter} from 'next/router'


function Post({ post,user,setPosts }) {
    const [showComments,setShowComments] = useState(false)
    const [moreCommentsLoaded,setMoreCommentsLoaded] = useState(false)
    const [postComments,setPostComments] = useState([])
    const [postLikes,setPostLikes] = useState(post.likes)
    const [savedPosts,setSavedPosts] = useState(user.savedPosts)
    const [commentInput,setCommentInput] = useState('')
    const [errorMessage,setErrorMessage] = useState('')
    const router = useRouter()
 
    let commentoption = moreCommentsLoaded ? 'Show less':'Show more'
    let liked = postLikes.includes(user.username)
    let saved = savedPosts.includes(post._id)

    function configSavePost(){
        savePost(post._id,setSavedPosts,saved?false:true)
        if(router.pathname === '/bookmark'){
            setPosts(posts=>posts.filter(p=>p._id !== post._id))
        }
    }

    function commentOnAPost(){
        if(commentInput === ''){
            setErrorMessage(`Comment can't be empty`)
            return
        }
        commentOnPost(post._id,commentInput,setCommentInput,setPostComments)
    }

    async function getComments(){
        setShowComments(!showComments)
 

        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_DEV_BASE_URL}/posts/${post._id}/comment`,{
                headers:{
                    Authorization:`Bearer ${cookie.get('token')}`
                }
            })
            setPostComments(res.data.comments)
        } catch (error) {
            
        }
    }
  return (
    <div className="bg-white rounded-lg py-4 mt-6 relative">
        <header className='flex items-center mb-2 px-2'>
                <div className='relative w-12 h-12 mr-2'>
                    <Image src={post.user[0].profilePhoto} layout='fill' objectFit='cover' className='rounded-full' />
                </div>
                <p>{post.createdBy}</p>
        </header>
        <div className='relative w-full h-80'>
            <Image src={post.image} layout='fill' objectFit='cover' />
        </div>
        <section className='flex justify-between mt-3 px-2'>
            <div className='flex gap-2'>
                <div className='cursor-pointer' onClick={()=>likeDislikePost(post._id,user.username,setPostLikes,liked ? false : true)}>
                    {
                        liked?
                        <FilledHeartIcon/>:
                        <HeartIcon/>
                        }
                </div>
                <div className='cursor-pointer' onClick={getComments}>
                    <CommentIcon/>
                </div>
            </div>
                <div className='cursor-pointer' onClick={configSavePost}>
                    {    saved ?
                        <FilledBookmarkIcon/>:
                        <BookmarkIcon/>
                    }   
                </div>
        </section>

        {postLikes.length > 0 &&
        <section className='px-2 mt-2'>
            <p className='text-sm'>Liked by <span className='font-bold'>{postLikes[0]}</span> and {postLikes.length-1} others</p>
        </section>
        }

        {showComments && <button onClick={()=>setMoreCommentsLoaded(!moreCommentsLoaded)} className='absolute bottom-2 -translate-x-1/2 left-1/2 text-xs' >{commentoption}</button>}
        {showComments &&
        <div>
            <section className='flex gap-1 px-2 items-center mt-2 border-b pb-3'>
                <div className='relative w-8 h-8 mr-2'>
                    <Image src={user.profilePhoto} layout='fill' objectFit='cover' className='rounded-full' />
                </div>
                <input value={commentInput} onChange={(e)=>setCommentInput(e.target.value)} className='mr-1 flex-1 border border-1 rounded-md h-8 text-xs px-2 outline-none' placeholder='Add your comment'>
                </input>
                <div onClick = {commentOnAPost}>
                <SendIcon />
                </div>
            </section>
            <p className='px-4 text-sm font-bold mt-2'>Comments</p>
            <div className='mt-2'>
                {postComments.map((comment)=>(
                    <Comment key={comment._id} comment = {comment} />
                ))
                }
            </div>
        </div>
        }
    </div>
  )
}

export default Post