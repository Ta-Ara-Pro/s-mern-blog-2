import { Button, Modal, Table, TableBody, TableCell, TableHead, TableRow } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi'


const DashPosts = () => {
  const { currentUser } = useSelector(state => state.user)
  const [userPosts, setUserPosts] = useState([])
  const [showMore, setShowMore] = useState(true)
  console.log('user posts:', userPosts)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const res = await fetch(`${API_BASE_URL}/post/getposts?userId=${currentUser._id}`)
        const data = await res.json()
        console.log(data)
        if (res.ok) {
          setUserPosts(data.posts)
          if (data.posts.length < 9) {
            setShowMore(false)
          }
        }
      } catch (error) {

      }
    };
    if (currentUser.isAdmin) { fetchPosts() }
  }, [currentUser._id])

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${API_BASE_URL}/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`)
      const data = await res.json()
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts])
        if (data.posts.length < 9) {
          setShowMore(false)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
  // =================================================
  // POST DELETION FUNCTIONS
  // =================================================
  const [showModal, setShowModal] = useState(false)
  const [postIdToDelete, setPostIdToDelete] = useState('')

  const handleDeletePost = async () => {
    setShowModal(false)
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${API_BASE_URL}/post/deletepost/${postIdToDelete}/${currentUser._id}`,
        {
          method: 'DELETE'
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserPosts((prev) => prev.filter((post) => post._id !== postIdToDelete))
      }
    } catch (error) {
      console.log(error)
    }
  }

console.log('post id:', userPosts.map((post) => post._id))
  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3
    
    scrollbar scrollbar-track-slate-100 scrollbar-thumb-300
    dark:scrollbar-track-slate-700 dark:scrollbar-thumb-500'>
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <TableHead>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post title</Table.HeadCell>
              <Table.HeadCell>Category </Table.HeadCell>
              <Table.HeadCell>Delete </Table.HeadCell>
              <Table.HeadCell><span>Edit</span> </Table.HeadCell>
            </TableHead>
            {userPosts.map((post) => (
              <Table.Body className='divide-y'  key={post._id}>
                <TableRow className='dark:border-gray-700 dark:bg-gray-800'>
                  <TableCell>{new Date(post.updatedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Link to={`/post/${post.slug}`}>
                      <img src={post.image} alt={post.title} className='w-20 h-10 object-cover bg-gray-500' /></Link>
                  </TableCell>
                  <TableCell>
                    <Link to={`/post/${post.slug}`} className='font-medium text-gray-900 dark:text-white'>
                      {post.title}
                    </Link>
                  </TableCell>
                  <TableCell>{post.category}</TableCell>
                  <TableCell>
                    <span
                      onClick={() => { setShowModal(true); setPostIdToDelete(post._id); }}
                      className='font-medium text-red-500 hover:underline cursor-pointer'
                    >
                      Delete
                    </span>
                  </TableCell>
                  <TableCell>
                    <span>
                      <Link to={`/update-post/${post._id}`} className='text-teal-500 hover:underline'>
                      Edit</Link>
                    </span>
                  </TableCell>

                </TableRow>
              </Table.Body>
            ))}
          </Table>
          {showMore &&
            <span onClick={handleShowMore} className='w-full text-teal-500 self-center cursor-pointer py-7'>Show more</span>
          }
          <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
            <Modal.Header />
            <Modal.Body>
              <div className="text-center">
                <HiOutlineExclamationCircle size={50} color='gray'
                  className='dark:text-gray-200 mb-4 mx-auto' />
                <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                  Are you sure you what to delete this post?</h3>
                <div className="flex justify-center gap-4">
                  <Button color='failure' onClick={handleDeletePost}>Yes, sure</Button>
                  <Button color='gray' onClick={() => setShowModal(false)}>No, cancle</Button>
                </div>

              </div>
            </Modal.Body>
          </Modal>

        </>
      ) : (
        <p>no posts!</p>
      )}
    </div>
  )
}

export default DashPosts
