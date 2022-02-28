import Head from 'next/head'
import Feed from '../components/Feed'

import LeftSidebar from '../components/LeftSidebar'
import RightSidebar from '../components/RightSidebar'

import axios from "axios"
import { parseCookies } from "nookies"

export default function Home({suggestedUsers,postsData,user,errorLoading}) {
  if(errorLoading){
    return (
        <div>No Ingles</div>
    )
  }
  return (
    <div className=" flex">
      <LeftSidebar user = {user} />
      <div className='w-90% md:w-58% bg-gray-50 ml-10% md:ml-20%'>
        <Feed postsData = {postsData} user = {user} />
      </div>
      <RightSidebar user = {user} suggestedUsers = {suggestedUsers} />
    </div>
  )
}


export async function getServerSideProps(ctx){
  try {
      const { token } = parseCookies(ctx)
      const rightSidebarUsers = await axios.get(`${process.env.NEXT_PUBLIC_API_DEV_BASE_URL}/users/timelineUsers`,{
          headers:{
              Authorization:`Bearer ${token}`
          }
      })
      const suggestedUsers = rightSidebarUsers.data.users
      const postsData = await axios.get(`${process.env.NEXT_PUBLIC_API_DEV_BASE_URL}/posts/timeline`,{
      headers:{
        Authorization:`Bearer ${token}`
    }})

    const feedPosts = postsData.data.posts
    const userData = await axios.get(`${process.env.NEXT_PUBLIC_API_DEV_BASE_URL}/users/currentUser`,{
      headers:{
        Authorization:`Bearer ${token}`
    }})
    const user = userData.data.user
      return {
          props:{
            suggestedUsers,
            postsData:feedPosts,
            user
          }
      }
  } catch (error) {
    return {
      props :{
        errorLoading:true
      }
    }    
  }
  
}
