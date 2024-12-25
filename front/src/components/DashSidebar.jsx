import React, { useEffect, useState } from 'react'
import { Sidebar } from 'flowbite-react'
import { HiAnnotation, HiArrowSmRight, HiChartPie, HiHome, HiOutlineDocumentText, HiOutlineUserGroup, HiUser } from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { signoutSuccess } from '../redux/user/userSlice'

const DashSidebar = () => {
  const { currentUser } = useSelector((state) => state.user)
  const location = useLocation;
  const [tab, setTab] = useState('')
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab')
    if (tabFromUrl) {
      setTab(tabFromUrl)
    }
  }, [location.search])

  // =================================================
  // SIGN OUT USER FUNCTION
  // =================================================
  const dispatch = useDispatch()

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
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup className='flex flex-col gap-1'>
          {currentUser?.isAdmin &&
          <Link to='/dashboard?tab=dash'>
          <Sidebar.Items
          active={tab === 'dash' || !tab}
          icon={HiChartPie}
          as='div'
          >
            Dashboard
          </Sidebar.Items>
          </Link>
          }

          <Link to='/dashboard?tab=profile'>
            <Sidebar.Item active={tab === 'profile'} icon={HiUser}
              label={currentUser.isAdmin ? 'Admin' : 'User'} labelColor='dark' as='div'>
              Profile
            </Sidebar.Item>
          </Link>
          {currentUser.isAdmin &&
          <>
            <Link to='/dashboard?tab=posts'>
              <Sidebar.Item active={tab === 'post'} icon={HiOutlineDocumentText} labelColor='dark' as='div'>
                Posts
              </Sidebar.Item>
            </Link>
            <Link to='/dashboard?tab=users'>
              <Sidebar.Item active={tab === 'users'} icon={HiOutlineUserGroup} labelColor='dark' as='div'>
                Users
              </Sidebar.Item>
            </Link>
            <Link to='/dashboard?tab=comments'>
              <Sidebar.Item active={tab === 'comments'} icon={HiAnnotation} labelColor='dark' as='div'>
                Comments
              </Sidebar.Item>
            </Link>
          </>
          }

          <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer' onClick={handelSignout}>
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>

    </Sidebar>
  )
}

export default DashSidebar
