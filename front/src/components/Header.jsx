import React, { useEffect, useState } from 'react'
import { Avatar, Button, Dropdown, DropdownDivider, DropdownHeader, DropdownItem, Navbar, TextInput } from 'flowbite-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AiOutlineSearch } from 'react-icons/ai'
import { FaMoon, FaSun } from 'react-icons/fa'
import {useSelector, useDispatch} from 'react-redux'
import { toggleTheme } from '../redux/theme/themeSlice'
import { signoutSuccess } from '../redux/user/userSlice'


const Header = () => {
    const path = useLocation().pathname; //get the current URL path
    const {currentUser} = useSelector(state => state.user) //get the current User
    const {theme} = useSelector(state => state.theme)
    const dispatch = useDispatch();

    const location = useLocation()
    const [searchTerm, setSearchTerm ] = useState('')
    // console.log("Initial searchTerm:", searchTerm);
    // console.log("location.search:", location.search);
  
    useEffect(() => {
      const urlParams = new URLSearchParams(location.search);
      const searchTermFromUrl = urlParams.get('searchTerm');
      // console.log("Extracted searchTermFromUrl:", searchTermFromUrl);
  
      if (searchTermFromUrl) {
        setSearchTerm(searchTermFromUrl);
      }
    }, [location.search]);



  // =================================================
  // SIGN OUT USER FUNCTION
  // =================================================
  const handelSignout = async() => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const res = await fetch(`${API_BASE_URL}/user/signout`, {
      method: 'POST'
    });
    const data = await res.json();
    if (!res.ok){
      console.log(data.message)
    } else {
      dispatch(signoutSuccess())
    }
    } catch (error) {
      console.log(error.message)
    }
  }
  // =================================================
  // SEARCH QUERY  FUNCTIONS
  // =================================================
  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm)
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`)
  }

    return (
    <Navbar className='border-b-2'>
      <Link to='/' className='self-center whitespace-nowrap text-sm 
      sm:text-xl font-semibold dark:text-white '>
      <span className='px-2 py-1 bg-gradient-to-r from-indigo-500
      via-purple-500 to-pink-500 rounded-lg text-white'>Tara's</span>Blog
      </Link>

      <form onSubmit={handleSubmit}>
        <TextInput 
        type='text'
        placeholder='Search'
        rightIcon={AiOutlineSearch}
        className='hidden lg:inline' //in large screen and above is visible by setting `lg:inline` and on smaller screens is hidden
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      <Button className='w-12 h-18 lg:hidden' color='gray' pill>
        <AiOutlineSearch />
      </Button>

      <div className='flex gap-2 md:order-2'>
        <Button className='w-12 h-10 hidden sm:inline' color='gray' pill
         onClick={() => dispatch(toggleTheme())}>
          {theme === 'light' ?  <FaMoon /> : <FaSun/>}
           
        </Button>
        
        
            {currentUser ? (
              <Dropdown arrowIcon={false} inline label={

                <Avatar alt='user' img={currentUser.profilePicture} rounded />
              }>
                <DropdownHeader>
                  <span className='block text-sm'>@{currentUser.username}</span>
                  <span className='block text-sm font-medium truncate'>{currentUser.email}</span>
                </DropdownHeader>
                <Link to={'/dashboard?tab=profile'}>
                <DropdownItem>Profile</DropdownItem>
                <DropdownItem onClick={handelSignout}>Sign out</DropdownItem>
                <DropdownDivider />
                </Link>

              </Dropdown>
            ) : 
            <Button  gradientDuoTone='purpleToBlue' outline > <Link to='/sign-in'> Sign In </Link></Button>}
        
       
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === '/'} as={'div'}>
            <Link to='/'>Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/about'}  as={'div'}>
            <Link to='/about'>About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/projects'}  as={'div'}>
            <Link to='/projects'>Projects</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Header
