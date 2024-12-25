import { Alert, Button, Modal, TextInput } from 'flowbite-react'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { updateSuccess, updateFailure, updateStart, signoutSuccess } from '../redux/user/userSlice'
import { useDispatch } from 'react-redux'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { deleteUserStart, deleteUserSuccess, deleteUserFailure } from '../redux/user/userSlice'
import {Link} from 'react-router-dom'
import axios from 'axios';

const DashProfile = () => {
  const { currentUser, error, loading } = useSelector(state => state.user)
  const [imageFile, setImageFile] = useState(null)
  const [imageFileUrl, setImageFileUrl] = useState(null)

  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);

  const [formData, setFormData] = useState({})
  const filePickerRef = useRef()
  const dispatch = useDispatch()



  // console.log('imagefile :', imageFile)
  // =================================================
  // IMAGE UPLOAD HANDLER
  // =================================================
  useEffect(() => {
    if (imageFile) {
      uploadImage()
      console.log('imagefile :', imageFile)
    }
  }, [imageFile])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      // setImageFileUrl(URL.createObjectURL(file))
    }
  }
  const uploadImage = async () => {
    if (!imageFile) return;
    setImageFileUploadError(null)

    const fileName = `${new Date().getTime()}_${imageFile.name}`;

    const image = new FormData();
    image.append('file', imageFile);
    image.append('public_id', fileName);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${API_BASE_URL}/user/cloudinary`, {
        method: 'POST',
        body: image,
        headers: {
          // No need to specify `Content-Type`; fetch will automatically set it for `Image`.
        },
      });

      if (!response.ok) {
        console.error('Error uploading image:', response);
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();
      setImageFileUrl(data.url)
      setFormData({ ...formData, profilePicture: data.url })
      console.log('Image uploaded successfully:', data);
      // Example: Update the image URL state if needed
      // setImageUrl(data.url);
    } catch (error) {
      console.error('Error uploading image:', error);
      setImageFileUploadError('Could not upload image. check the image format and size')
      setImageFile(null)
      setImageFileUrl(null)
    }
  };

  // =================================================
  // =================================================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }
  // =================================================
  // SUBMIT FUNCTION
  // =================================================
  const [updateUserError, setUpdateUserError] = useState(null);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) { // the way to ckeck the length of a content of an objedt
      setUpdateUserError('No changes made');
      return;
    }
    console.log('formData:', formData)
    try {
      dispatch(updateStart())
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${API_BASE_URL}/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      console.log(' request data:', JSON.stringify(formData))
      const data = await response.json()
      console.log('updated data:', data)
      if (!response.ok) {
        dispatch(updateFailure(data.message))
        setUpdateUserError(`Failed to update user profile: ${data.message}`)
        // console.log('error updating user:', data.message)
        // console.log('failed data:', data)
      } else {
        dispatch(updateSuccess(data))
        setUpdateUserSuccess("User's profile updated successfully")
        console.log('updated  successfully')
      }
    } catch (error) {
      dispatch(updateFailure(error.message))
      setUpdateUserError(`Error updating user: ${error.message}`)
    }

  }
  // =================================================
  // DELETE USER FUNCTION
  // =================================================
  const [showModal, setShowModal] = useState(false);

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${API_BASE_URL}/user/delete/${currentUser._id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message))
      } else {
        dispatch(deleteUserSuccess(data))
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }
  // =================================================
  // SIGN OUT USER FUNCTION
  // =================================================
  const handelSignout = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${API_BASE_URL}/user/signout`, {
        method: 'POST'
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message)
      } else {
        dispatch(signoutSuccess())
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input type='file' accept='image/*' onChange={(e) => handleImageChange(e)} hidden ref={filePickerRef} />
        <div className='w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
          onClick={() => filePickerRef.current.click()}>
          <img src={imageFileUrl || currentUser.profilePicture} alt='user'
            className='rounded-full w-full h-full object-cover border-8 border-[lightgray]' />
        </div>

        {imageFileUploadError && <Alert color='failure'> {imageFileUploadError}</Alert>}
        <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username} onChange={handleChange} />
        <TextInput type='email' id='email' placeholder='email' defaultValue={currentUser.email} onChange={handleChange} />
        <TextInput type='password' id='password' placeholder='password' onChange={handleChange} />

        <Button type='submit' gradientDuoTone='purpleToBlue' outline disabled={loading}>
          {loading ? 'Loading...' : 'Update'}
        </Button>

        <Link to='/create-post'>
          {currentUser.isAdmin && (
            <Button type='button' gradientDuoTone='purpleToPink' className='w-full'>
              Create Post</Button>
          )}
        </Link>

      </form>
      <div className='text-red-500 flex justify-between mt-4'>
        <span className='cursor-pointer' onClick={() => setShowModal(true)}>Delete Account</span>
        <span className='cursor-pointer' onClick={handelSignout}>Sign Out</span>
      </div>
      {updateUserSuccess && (
        <Alert color='success' className='mt-5'>{updateUserSuccess}</Alert>
      )}
      {error &&
        <Alert color='failure' className='mt-5'>{error}</Alert>
      }

      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle size={50} color='gray'
              className='dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you what to delete this account?</h3>
            <div className="flex justify-center gap-4">
              <Button color='failure' onClick={handleDeleteUser}>Yes, sure</Button>
              <Button color='gray' onClick={() => setShowModal(false)}>No, cancle</Button>
            </div>

          </div>
        </Modal.Body>
      </Modal>

    </div>
  )
}

export default DashProfile
