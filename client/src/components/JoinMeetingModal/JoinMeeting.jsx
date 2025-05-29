import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { joinMeeting } from '../../services/meetingService';

const JoinMeeting = ({setJoinModal}) => {
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState('');
    const [errorJoining, setErrorJoining] = useState(null);
  
    const handleJoin = async() => {
        setErrorJoining(null);
        try {
            await joinMeeting({roomId});
            navigate(`/room/${roomId}`);
            setJoinModal(false);
        } catch (error) {
            setErrorJoining(error.message);
        }
    };
    
  return (
    <div>
        {/* Background Overlay */}
        <div onClick={() => setJoinModal(false)} className='fixed bg-black opacity-30 inset-0 blur-md z-20'></div>

        {/* Modal */}

        {<div className='p-6 w-[25%] rounded-lg flex flex-col gap-5 bg-[#202332] fixed z-30 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2'>
            <h3 className='text-2xl font-semibold'>Join Meeting</h3>
            <div className='flex flex-col gap-4'>
                <input onChange={(e) => setRoomId(e.target.value)} className='px-4 py-1 rounded-md bg-[#202332] text-white border border-gray-600 focus:outline-none placeholder-gray-400' type="text" placeholder='Room ID' />
                {errorJoining && <div className='text-red-500'>{errorJoining}</div>}
                <div className='flex justify-end items-center gap-3'>
                    <button onClick={handleJoin} className='px-4 py-1 rounded-2xl transition-colors duration-300 bg-[#1664FB] hover:bg-[#1662fbc8]'>Join</button>
                    <button className='px-4 py-1 rounded-2xl transition-colors duration-300 bg-[#1664FB] hover:bg-[#1662fbc8]' onClick={() => setJoinModal(false)}>Cancel</button>
                </div>
            </div>
        </div>}
    </div>
  )
}

export default JoinMeeting

