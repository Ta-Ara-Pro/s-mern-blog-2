import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { FaThumbsUp } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { Button, Textarea } from 'flowbite-react'

const Comment = ({ comment, onLike, onEdit, onDelete }) => {
  const [user, setUser] = useState({})
  const { currentUser } = useSelector(state => state.user)
  // console.log('comment id',comment._id)

  // console.log(user)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 
        const res = await fetch(`${API_BASE_URL}/user/${comment.userId}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data)
        } else {
          console.error(`Failed to fetch user: ${res.status} - ${res.statusText}`);
        }
      } catch (error) {
        console.log(error.message);

      }
    }
    fetchUser();
  }, [comment])


  // =================================================
  // EDIT BUTTON
  // =================================================
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content)

  const handleEdit =() => {
    setIsEditing(true)
    setEditedContent(comment.content)
 
  }
console.log('comment id :', comment._id)
  const handleSave = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 
      const res = await fetch(`${API_BASE_URL}/comment/editComment/${comment._id}`,
        {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          content: editedContent
        })
        }
      )
      if (res.ok){
        setIsEditing(false);
        onEdit(comment,editedContent)
      }
       console.log(res.json())
    } catch (error) {
      console.log(error.message)
    }
  }



  return (
    <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
      <div className='flex-shrink-0 mr-3'>
        <img
          className='w-10 h-10 rounded-full bg-gray-200'
          src={user.profilePicture}
          alt={user.username}
        />
      </div>
      <div className='flex-1'>
        <div className='flex items-center mb-1'>
          <span className='font-bold mr-1 text-xs truncate'>
            {user ? `@${user.username}` : 'anonymous user'}
          </span>
          <span className='text-gray-500 text-xs'>
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {isEditing ?
        <div>
          <Textarea className='mb-2'
          value={editedContent}
          onChange={(e)=> setEditedContent(e.target.value)}>

          </Textarea>
          <div className="flex justify-end text-xs gap-3">
            <Button type='button' size='sm' gradientDuoTone='purpleToBlue' onClick={handleSave}
            >Save
            </Button>
            <Button type='button' size='sm' gradientDuoTone='purpleToBlue' outline onClick={()=> setIsEditing(false)}>Cancle</Button>
          </div>
        </div> 
        :
          <>
            <p className='text-gray-500 mb-2'>{comment.content}</p>
            <div className="flex flex-row items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
              <button type='button' onClick={() => onLike(comment._id)}>
                <FaThumbsUp className={`text-gray-400 hover:text-blue-500
                     ${currentUser && comment.likes.includes(currentUser._id) && '!text-blue-500'}
                   `} />
              </button>
              <p className="text-gray-400">
                {
                  comment.likes.length > 0 && comment.numberOfLikes + " " + (comment.likes.length === 1 ? 'like' : 'likes')
                }
              </p>
              {currentUser && (currentUser.isAdmin || currentUser._id === comment.userId) && (
                <>
                <button
                  type='button'
                  onClick={handleEdit}
                  className='text-gray-400 hover:text-blue-500'>
                  Edit
                </button>
                <button
                  type='button'
                  onClick={()=> onDelete(comment._id)}
                  className='text-gray-400 hover:text-red-500'>
                  
                  Delete
                </button>
                </>
              )}
            </div>
          </>
        }

      </div>
    </div>
  )
}

export default Comment
