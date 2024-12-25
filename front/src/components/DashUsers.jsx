import { Button, Modal, Table, TableBody, TableCell, TableHead, TableRow } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { FaCheck , FaTimes } from "react-icons/fa";


const DashUsers = () => {
  const { currentUser } = useSelector(state => state.user)
  const [users, setUsers] = useState([])
  const [showMore, setShowMore] = useState(true)
  console.log('user users:', users)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const res = await fetch(`${API_BASE_URL}/user/getusers`)
        const data = await res.json()
        console.log(data)
        if (res.ok) {
          setUsers(data.users)
          if (data.users.length < 2) {
            setShowMore(false)
          }
        }
      } catch (error) {
        console.log(error)
      }
    };
    if (currentUser.isAdmin) { fetchUsers() }
  }, [currentUser._id])

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${API_BASE_URL}/user/getusers?startIndex=${startIndex}`)
      const data = await res.json()
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users])
        if (data.users.length < 9) {
          setShowMore(false)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
  // =================================================
  // USER DELETION FUNCTIONS
  // =================================================
  const [showModal, setShowModal] = useState(false)
  const [userIdToDelete, setUserIdToDelete] = useState('')

  const handleDeleteUser = async () => {
    setShowModal(false)
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${API_BASE_URL}/user/delete/${userIdToDelete}`,
        {
          method: 'DELETE'
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete))
      }
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3
    
    scrollbar scrollbar-track-slate-100 scrollbar-thumb-300
    dark:scrollbar-track-slate-700 dark:scrollbar-thumb-500'>
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <TableHead>
              <Table.HeadCell>Date created</Table.HeadCell>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>email</Table.HeadCell>
              <Table.HeadCell>Admin </Table.HeadCell>
              <Table.HeadCell>Delete </Table.HeadCell>
            </TableHead>
            {users.map((user) => (
              <Table.Body className='divide-y'  key={user._id}>
                <TableRow className='dark:border-gray-700 dark:bg-gray-800'>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                      <img src={user.profilePicture} alt={user.username} className='w-10 h-10 object-cover bg-gray-500 rounded-full' />
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.isAdmin ? (<FaCheck  className='text-green-500'/>): (<FaTimes className='text-red-500'/>)}</TableCell>
                  <TableCell>
                    <span
                      onClick={() => { setShowModal(true); setUserIdToDelete(user._id); }}
                      className='font-medium text-red-500 hover:underline cursor-pointer'
                    >
                      Delete
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
                  Are you sure you what to delete this user?</h3>
                <div className="flex justify-center gap-4">
                  <Button color='failure' onClick={handleDeleteUser}>Yes, sure</Button>
                  <Button color='gray' onClick={() => setShowModal(false)}>No, cancle</Button>
                </div>

              </div>
            </Modal.Body>
          </Modal>

        </>
      ) : (
        <p>no users!</p>
      )}
    </div>
  )
}

export default DashUsers
