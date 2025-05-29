import React, { useState } from 'react'
import HomeLogo from '../../assets/home-icon.svg'
import MeetingLogo from '../../assets/video-icon.svg'
import { useAuth } from '../../providers/AuthProvider/AuthProvider'
import AppLogo from '../../assets/app-logo.svg'
import ProfileDropdown from '../ProfileDropdown/ProfileDropdown'

const Navbar = ({ navControl, setNavControl }) => {
  const { authUser } = useAuth();
  const [openProfileDropdown, setProfileDropdown] = useState(false);


  return (
    <>
    {/* bg-[#282c3e] */}
      <div className='sticky top-0 px-8 w-screen h-[8%] bg-gray-800 flex items-center justify-between'>
        <div>
          <img src={AppLogo} alt="app-logo" />
        </div>

        <div className='nav-controls flex items-center'>
          <button onClick={() => setNavControl('home')} name='home' className={`${navControl === 'home' ? 'bg-[#373C51]' : ''} transition-colors duration-75 h-full w-[5rem] p-2 flex justify-center items-center flex-col`}>
            <div className='w-[1.5rem] h-[1.5rem] overflow-hidden'>
              <img className='w-full h-full object-cover' src={HomeLogo} alt="home-icon" />
            </div>

            <div className='text-sm'>
              Home
            </div>
          </button>

          {/* bg-[#4c4c96] */}
          <button onClick={() => setNavControl('meetings')} name='meetings' className={`${navControl === 'meetings' ? 'bg-[#373C51]' : ''} transition-colors duration-75 h-full w-[5rem] p-2 flex justify-center items-center flex-col`}>
            <div className='w-[1.5rem] h-[1.5rem] overflow-hidden'>
              <img className='w-full h-full object-cover' src={MeetingLogo} alt="meeting-icon" />
            </div>

            <div className='text-sm'>
              Meetings
            </div>
          </button>
        </div>

        <button onClick={() => setProfileDropdown(true)} className='h-[60%] rounded-full overflow-hidden'>
          <img className='object-cover w-full h-full' src={authUser?.avatar} alt="avatar" />
        </button>

      </div>
      {openProfileDropdown && <ProfileDropdown setProfileDropdown={setProfileDropdown} />}
    </>
  )
}

export default Navbar