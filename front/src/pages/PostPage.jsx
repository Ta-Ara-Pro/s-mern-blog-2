import { Button, Spinner } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import CallToAction from '../components/CallToAction';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';

const PostPage = () => {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null)

  console.log(post)
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const res = await fetch(`${API_BASE_URL}/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true)
          setLoading(false);
          console.log(data.message)
          return;
        }
        if (res.ok) {
          setPost(data.posts[0])
          setError(false)
          setLoading(false)
          console.log(data)
        }

      } catch (error) {
        setLoading(false);
        setError(true)
        console.log(error)
      }
    }
    fetchPost()

  }, [postSlug])
  useEffect(() => {
    try {
      const fetchRecentPosts = async() => {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const res = await fetch(`${API_BASE_URL}/post/getposts?limit=3`);
        const data = await res.json()
        if(res.ok){
          setRecentPosts(data.posts)
        }
      }

      fetchRecentPosts()
    } catch (error) {
      console.log(error)
    }
  },[])
  if (loading) return (
    <div className='flex justify-center items-center min-h-screen'>
      <Spinner size='xl' />
    </div>
  )

  return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      <h1 className='text-3xl mt-10 p-3 text-center font-serif
      max-w-2xl mx-auto lg:text-4xl'>
        {post?.title}
      </h1>

      <Link to={`/search?category=${post && post.category}`}
        className='self-center mt-5'>
        <Button color='gray' pill size='xs'>
          {post && post.category}
        </Button>
      </Link>

      <img src={post?.image} alt={post?.title}
        className='mt-10 p-3 max-h-[600px] w-full object-cover max-w-5xl mx-auto' />
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full text-s max-w-4xl">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span>
          {post && (post.content.length / 1000).toFixed(0)} mins read
        </span>
      </div>

      <div
        className='p-3 max-w-2xl mx-auto w-full post-content'
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      >
      </div>

      <div className="max-w-4xl mx-auto w-full"><CallToAction /></div>
      <CommentSection postId={post._id} />

      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className='text-xl mt-5'>Recent articles</h1>
      <div className="flex flex-wrap gap-5 mt-5 justify-center">
        {
          recentPosts && 
          recentPosts.map((post) => (
            <PostCard key={post._id}  post={post}/> 
          ))
        }
      </div>
      </div>


    </main>
  )
}

export default PostPage
