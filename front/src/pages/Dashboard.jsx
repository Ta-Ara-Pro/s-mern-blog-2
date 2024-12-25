import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import DashSidebar from '../components/DashSidebar'
import DashProfile from '../components/DashProfile'
import DashPosts from '../components/DashPosts'
import DashUsers from '../components/DashUsers'
import DashComments from '../components/DashComments'
import DashboardComponent from '../components/DashboardComponent'

const Dashboard = () => {
  const location = useLocation()
  const [tab, setTab ] = useState('')
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)  //location.search is the query string part of the URL 
    const tabFromUrl = urlParams.get('tab')
    if (tabFromUrl) {
      setTab(tabFromUrl)
    }
  }, [location.search]);
  return (
    <div className='min-h-screen flex flex-col  md:flex-row'>
      <div className='md:w-56'>
        <DashSidebar />

      </div>

      {tab === 'profile' && <DashProfile />}
      {tab === 'posts' && <DashPosts />}
      {tab === 'users' && <DashUsers />}
      {tab === 'comments' && <DashComments/>}
      {tab === 'dash' && <DashboardComponent/>}
      
    </div>
  )
}

export default Dashboard

 //new URLSearchParams(location.search): This creates a new instance of the URLSearchParams object, 
 // which allows you to easily access query parameters in the URL.

//  const tabFromUrl = urlParams.get('tab'): This extracts the value of the tab query parameter from the URL.
//   If the URL is something like ?tab=home, tabFromUrl will be 'home'.
//   If the query parameter tab doesn't exist, tabFromUrl will be null.