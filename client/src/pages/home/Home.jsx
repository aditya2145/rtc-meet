import React, { useState } from 'react';
import AddIcon from '../../assets/add-icon.svg'
import VideoIcon from '../../assets/video-icon.svg'
import ScheduleIcon from '../../assets/schedule-icon.svg'
import { useAuth } from '../../providers/AuthProvider/AuthProvider';
import JoinMeeting from '../../components/JoinMeetingModal/JoinMeeting';
import Navbar from '../../components/Navbar/Navbar';
import Meetings from '../../components/Meetings/Meetings';
import CreateMeeting from '../../components/CreateMeeting/CreateMeeting';
import ScheduleMeeting from '../../components/ScheduleMeeting/ScheduleMeeting';

function Home() {
  const { authUser } = useAuth();
  const [openJoinModal, setJoinModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openScheduleModal, setOpenScheduleModal] = useState(false);
  const [navControl, setNavControl] = useState('home');

  return (
    <div className='text-white bg-gradient-to-br from-[#080808] via-[#121723] to-[#0f1822] h-screen overflow-y-auto overflow-x-hidden w-screen flex flex-col' >
      <Navbar setNavControl={setNavControl} navControl={navControl} />
      {navControl === 'home' && <div className='w-full h-[92%] flex justify-center items-center'>
        <div className='grid grid-cols-2 gap-10'>
          <div className='flex flex-col items-center gap-2'>
            <button onClick={() => setOpenCreateModal(true)} className='transition-colors duration-300 bg-[#1664FB] hover:bg-[#1662fbcc] flex justify-center items-center w-[4.5rem] h-[4.5rem] overflow-hidden rounded-3xl'>
              <img className='w-[50%] h-[50%] object-cover' src={AddIcon} alt="add_icon" />
            </button>
            <div className='text-sm'>New Meeting</div>
          </div>

          <div className='flex flex-col items-center gap-2'>
            <button onClick={() => setJoinModal(true)} className='transition-colors duration-300 bg-[orange] hover:bg-[#ffa600e6] flex justify-center items-center w-[4.5rem] h-[4.5rem] rounded-3xl overflow-hidden'>
              <img className='w-[50%] h-[50%] object-cover' src={VideoIcon} alt="video_icon" />
            </button>
            <div className='text-sm'>Join</div>
          </div>

          <div className='flex flex-col items-center gap-2'>
            <button onClick={() => setOpenScheduleModal(true)} className='transition-colors duration-300 bg-red-600 hover:bg-red-700 flex justify-center items-center w-[4.5rem] h-[4.5rem] rounded-3xl overflow-hidden'>
              <img className='w-[50%] h-[50%] object-cover' src={ScheduleIcon} alt="schedule_icon" />
            </button>
            <div className='text-sm'>Schedule</div>
          </div>
        </div>
      </div>
      }

      {navControl === 'meetings' && <Meetings />}

      {openCreateModal && <CreateMeeting setOpenCreateModal={setOpenCreateModal} />}
      {openScheduleModal && <ScheduleMeeting setOpenScheduleModal={setOpenScheduleModal} />}
      {openJoinModal && <JoinMeeting emailId={authUser?.email} setJoinModal={setJoinModal} />}
    </div>
  );
}

export default Home;