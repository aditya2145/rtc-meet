import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { scheduleMeeting } from '../../services/meetingService';

const CreateMeeting = ({ setOpenScheduleModal }) => {
    const navigate = useNavigate();
    const [meetingData, setMeetingData] = useState({});
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        if(e.target.name === 'startTime') {
            const localDate = new Date(e.target.value).toISOString();
            setMeetingData({ ...meetingData, startTime: localDate });
        }
        else {
            setMeetingData({...meetingData, [e.target.name]: e.target.value})
        }
    }

    const handleSchedule = async() => {
        setError(null);
        setIsLoading(true);
        try {
            await scheduleMeeting(meetingData);
            setOpenScheduleModal(false);
            navigate('/');
        } catch (error) {
            setError(error);
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            {/* Background Overlay */}
            <div className='fixed bg-black opacity-30 inset-0 blur-md z-20'></div>

            {/* Modal */}

            {
                <div className='p-6 w-[25%] rounded-lg flex flex-col gap-5 bg-[#202332] fixed z-30 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                    <h3 className='text-2xl text-center font-semibold'>🗓️ Schedule Meeting</h3>
                    <div className='flex flex-col gap-4'>
                        <input required onChange={handleChange} name='title' className='px-4 py-2 rounded-md bg-[#202332] text-white border border-gray-600 focus:outline-none placeholder-gray-400' type="text" placeholder='Meeting Title' />
                        {/* <textarea
                            required
                            onChange={handleChange}
                            name='description'
                            placeholder='Meeting Description'
                            className="w-full h-20 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:none resize-none shadow-sm"
                        /> */}
                        <input required onChange={handleChange} name='durationMinutes' min={5} max={180} className='px-4 py-2 rounded-md bg-[#202332] text-white border border-gray-600 focus:outline-none placeholder-gray-400' type="number" placeholder='Duration in Minutes' />
                        <input required onChange={handleChange} name='startTime' className='px-4 py-2 rounded-md bg-[#202332] text-white border border-gray-600 focus:outline-none placeholder-gray-400' type="datetime-local" placeholder='Meeting Start Time' />
                        {/* <input required onChange={handleChange} name='invitedUsers' className='px-4 py-2 rounded-md bg-[#202332] text-white border border-gray-600 focus:outline-none placeholder-gray-400' multiple type="text" placeholder='Invite Users' /> */}
                    </div>
                    {error && <div className='text-red-600'>{error}</div>}
                    <div className='flex items-center gap-2'>
                        <button onClick={handleSchedule} className='cursor-pointer bg-[#4c4c96] hover:bg-[#363669] text-white font-semibold px-4 py-1 rounded-md transition'>{isLoading? 'Creating...' : 'Create'}</button>
                        <button className='cursor-pointer bg-[#d3cfcf] text-black hover:opacity-[50%]  font-semibold px-4 py-1 rounded-md transition' onClick={() => setOpenScheduleModal(false)}>Cancel</button>
                    </div>
                </div>
            }
        </div>
    )
}

export default CreateMeeting