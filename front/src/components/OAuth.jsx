import { Button } from 'flowbite-react'
import React from 'react'
import { AiFillGoogleCircle, AiFillGooglePlusCircle } from 'react-icons/ai'

export default function OAuth() {
    const handkeGoogleClick = async() => {
        
    }

    
  return (
    <Button type='button' gradientDuoTone='pinkToOrange' outline onClick={handkeGoogleClick}>
        <AiFillGoogleCircle className='h-6 w-6 mr-2' /> 
      continue with Google
    </Button>
  )
}
