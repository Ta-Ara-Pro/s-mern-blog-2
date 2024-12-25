import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import React, { useEffect, useState } from 'react'
import {useNavigate , useParams} from 'react-router-dom'
import { useSelector } from 'react-redux'

const UpdatePost = () => {

  const [formData, setFormData] = useState({
    title: '',
    category: 'uncategorized',
    content: '',
    image: ''
});
  const navigate = useNavigate()
  const {postId} = useParams()
  const {currentUser} = useSelector(state => state.user)
  console.log('formData:', formData)
  console.log('postId:', postId)

  // =================================================
  // FETCHING POST FUNCTIOIN
  // =================================================
  useEffect(() => {
    try {
      const fetchPost = async () => {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const res = await fetch(`${API_BASE_URL}/post/getposts?postId=${postId}`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
          setPublishError(data.message);
          return;
        }
        if (res.ok) {
          setPublishError(null);
          setFormData( data.posts.filter((post) => post._id === postId)[0]);
          // console.log('data.posts.map: ', 
          //   data.posts.filter((post) => post._id === postId)
          // )
        }
      };

      fetchPost();
    } catch (error) {
      console.log(error.message);
    }
  }, [postId]);



  // =================================================
  // IMAGE UPLOAD HANDLER
  // =================================================
  const [postImage, setPostImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null)
  const [imageUploadError, setImageUploadError] = useState(null)
  const [imageUploadLoading, setImageUploadLoading] = useState(false)

  const handlefileChange = (e) => {
    const file = e.target.files[0];
    setPostImage(file)
  }

  const uploadImage = async () => {
    if (!postImage) {
      return setImageUploadError('please choose an image')
    }
    setImageUploadError(null)
    const fileName = `${new Date().getTime()}_${postImage.name}`
    const banner = new FormData();
    banner.append('file', postImage);
    banner.append('public_id', fileName)
    try {
      setImageUploadLoading(true)
      const res = await fetch('/api/user/cloudinary', {
        method: 'POST',
        body: banner,
        headers: {}
      })
      console.log('res:', res)
      if (!res.ok) {
        // console.error('Error uploading image:', res);
        setImageUploadLoading(false)
        throw new Error(` ${res.status} - ${res.statusText}`);
      }
      const data = await res.json();
      setFormData({ ...formData, image: data.url })
      setImageUrl(data.url)
      setImageUploadError('image uploaded successfully')
      setImageUploadLoading(false)
      console.log('Image uploaded successfully:', data);
    } catch (error) {
      setImageUploadError(`Error uploading image: ${error}`)
      setImageUploadLoading(false)
      console.log('error image upload:', error)
    }
  }
  // =================================================
  // SUBMIT POST FUNCTIOIN
  // =================================================
  const [publishError, setPublishError] = useState(null)
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }
  const handleSubmit = async (e) => {

    e.preventDefault();
    try {
      const res = await fetch(`/api/post/update/${postId}/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json()
      if (!res.ok) {
        setPublishError(`Error updating the post: ${data.message}`)
        return
      }
      if (res.ok) {
        console.log('data:',data.slug)
        setPublishError(null)
        navigate(`/post/${data.slug}`)
      }
    } catch (error) {
      setPublishError(`something went wrong: ${error}`)
    }
  }
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Update post</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between" onChange={(e) => handleInputChange(e)}>
          <TextInput type='text' placeholder='Title' required id='title' className='flex-1' value={formData.title || ''}/>
          <Select className='cursor-pointer' onChange={(e) => handleInputChange(e)} id='category'  value={formData.category || 'uncategorized'}>
            <option value='uncategorized'>Select a category</option>
            <option value='javascript'>javascript</option>
            <option value='reactjs'>React.js</option>
            <option value='nextjs'>Next.js</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 
        border-teal-500 border-dotted p-3">
          <FileInput type='file' accept='image/*' onChange={(e) => handlefileChange(e)} />
          <Button type='button' gradientDuoTone='purpleToPink' size='sm' outline onClick={uploadImage} disabled={imageUploadLoading && true}>
            {imageUploadLoading ? 'uploading...' : 'Upload image'}
          </Button>
        </div>
        {imageUploadError ?
          imageUploadError === 'image uploaded successfully' ?
            <Alert color='success'>{imageUploadError}</Alert> :
            <Alert color='failure'>{imageUploadError}</Alert> : null
        }
        {imageUrl &&
          <img src={imageUrl} alt='upload' className='w-full object-cover' />
        }

        <ReactQuill theme='snow' placeholder='write something...' className='h-72 mb-12'
          required onChange={(value) => setFormData({ ...formData, content: value })}  value={formData.content || ''}/>
        <Button type='submit' gradientDuoTone='purpleToPink' className='mb-10'>Update post</Button>
        {publishError && <Alert color='failure' >{publishError}</Alert>}
      </form>
    </div>
  )
}

export default UpdatePost
// import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
// import ReactQuill from 'react-quill'
// import 'react-quill/dist/quill.snow.css'
// import React, { useEffect, useState } from 'react'
// import {useNavigate , useParams} from 'react-router-dom'
// import { useSelector } from 'react-redux'

// const UpdatePost = () => {

//   const [formData, setFormData] = useState({})
//   const navigate = useNavigate()
//   const {postId} = useParams()
//   const {currentUser} = useSelector(state => state.user)
//   console.log('formData:', formData)
//   console.log('postId:', postId)

//   // =================================================
//   // FETCHING POST FUNCTIOIN
//   // =================================================
//   useEffect(() => {
//     try {
//       const fetchPosts = async() => {
//         setFormData({})
//           const res = await fetch(`/api/post/getposts?postId=${postId}`);
//           const data = await res.json();
//           if(!res.ok){
//             console.log(data.message)
//             setPublishErro(data.message)
//           }
//           if(res.ok){
//             console.log('fetched data:', data.posts[0])
//             setPublishErro(null)
//             setFormData(data.posts[0])
//             setImageUrl(data.posts[0].image)
//           }
//       };
//       fetchPosts()
    
//     } catch (error) {
//       console.log(error)
//     }
//   }, [])


//   // =================================================
//   // IMAGE UPLOAD HANDLER
//   // =================================================
//   const [postImage, setPostImage] = useState(null);
//   const [imageUrl, setImageUrl] = useState(null)
//   const [imageUploadError, setImageUploadError] = useState(null)
//   const [imageUploadLoading, setImageUploadLoading] = useState(false)

//   const handlefileChange = (e) => {
//     const file = e.target.files[0];
//     setPostImage(file)
//   }

//   const uploadImage = async () => {
//     if (!postImage) {
//       return setImageUploadError('please choose an image')
//     }
//     setImageUploadError(null)
//     const fileName = `${new Date().getTime()}_${postImage.name}`
//     const banner = new FormData();
//     banner.append('file', postImage);
//     banner.append('public_id', fileName)
//     try {
//       setImageUploadLoading(true)
//       const res = await fetch('/api/user/cloudinary', {
//         method: 'POST',
//         body: banner,
//         headers: {}
//       })
//       console.log('res:', res)
//       if (!res.ok) {
//         // console.error('Error uploading image:', res);
//         setImageUploadLoading(false)
//         throw new Error(` ${res.status} - ${res.statusText}`);
//       }
//       const data = await res.json();
//       setFormData({ ...formData, image: data.url })
//       setImageUrl(data.url)
//       setImageUploadError('image uploaded successfully')
//       setImageUploadLoading(false)
//       console.log('Image uploaded successfully:', data);
//     } catch (error) {
//       setImageUploadError(`Error uploading image: ${error}`)
//       setImageUploadLoading(false)
//       console.log('error image upload:', error)
//     }
//   }
//   // =================================================
//   // SUBMIT POST FUNCTIOIN
//   // =================================================
//   const [publishError, setPublishErro] = useState(null)
//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.id]: e.target.value })
//   }
//   const handleSubmit = async (e) => {

//     e.preventDefault();
//     try {
//       const res = await fetch(`/api/post/update/${postId}/${currentUser._id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(formData),
//       });
//       const data = await res.json()
//       if (!res.ok) {
//         setPublishErro(`Error updating the post: ${data.message}`)
//         return
//       }
//       if (res.ok) {
//         console.log('data:',data.slug)
//         setPublishErro(null)
//         navigate(`/post/${data.slug}`)
//       }
//     } catch (error) {
//       setPublishErro(`something went wrong: ${error}`)
//     }
//   }
//   return (
//     <div className='p-3 max-w-3xl mx-auto min-h-screen'>
//       <h1 className='text-center text-3xl my-7 font-semibold'>Update post</h1>
//       <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
//         <div className="flex flex-col gap-4 sm:flex-row justify-between" onChange={(e) => handleInputChange(e)}>
//           <TextInput type='text' placeholder='Title' required id='title' className='flex-1' value={formData.title}/>
//           <Select className='cursor-pointer' onChange={(e) => handleInputChange(e)} id='category' value={formData.category}>
//             <option value='uncategorized'>Select a category</option>
//             <option value='javascript'>javascript</option>
//             <option value='reactjs'>React.js</option>
//             <option value='nextjs'>Next.js</option>
//           </Select>
//         </div>
//         <div className="flex gap-4 items-center justify-between border-4 
//         border-teal-500 border-dotted p-3">
//           <FileInput type='file' accept='image/*' onChange={(e) => handlefileChange(e)} />
//           <Button type='button' gradientDuoTone='purpleToPink' size='sm' outline onClick={uploadImage} disabled={imageUploadLoading && true}>
//             {imageUploadLoading ? 'uploading...' : 'Upload image'}
//           </Button>
//         </div>
//         {imageUploadError ?
//           imageUploadError === 'image uploaded successfully' ?
//             <Alert color='success'>{imageUploadError}</Alert> :
//             <Alert color='failure'>{imageUploadError}</Alert> : null
//         }
//         {imageUrl &&
//           <img src={imageUrl} alt='upload' className='w-full object-cover' />
//         }

//         <ReactQuill theme='snow' placeholder='write something...' className='h-72 mb-12'
//           required onChange={(value) => setFormData({ ...formData, content: value })} value={formData.content}/>
//         <Button type='submit' gradientDuoTone='purpleToPink' className='mb-10'>Update post</Button>
//         {publishError && <Alert color='failure' >{publishError}</Alert>}
//       </form>
//     </div>
//   )
// }

// export default UpdatePost
