import React, { useEffect, useState } from 'react'
import { getAllMeetings, joinMeeting } from '../../services/meetingService';
import Loader from '../Loader/Loader'
import { useNavigate } from 'react-router-dom';

const Meetings = () => {
    const [meetingStatus, setMeetingStatus] = useState('ongoing');
    const [allMeetings, setAllMeetings] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorFetching, setErrorFetching] = useState(null);
    const [isJoining, setIsJoining] = useState(false);
    const [isErrorJoining, setIsErrorJoining] = useState(null);
    const navigate = useNavigate();

    const dateConfig = {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    };

    const handleJoin = async ({ roomId }) => {
        setIsJoining(true);
        setIsErrorJoining(null);
        try {
            await joinMeeting({ roomId });
            navigate(`/room/${roomId}`);
        } catch (error) {
            setIsErrorJoining(error.message);
        }
        finally {
            setIsJoining(false);
        }
    }

    useEffect(() => {
        const fetchMeetings = async () => {
            setLoading(true);
            setErrorFetching(null);
            try {
                const meetings = await getAllMeetings(meetingStatus);
                setAllMeetings(meetings);
            } catch (error) {
                setErrorFetching(error);
            } finally {
                setLoading(false);
            }
        };
        fetchMeetings();
    }, [meetingStatus])


    return (
        <div className='px-6 py-4'>
            {/* Controls */}
            <div className='flex items-center gap-1'>
                <button className={`${meetingStatus === 'ongoing' ? 'bg-[#373C51]' : 'border border-[#373C51]'} px-4 py-0.5 rounded-2xl`} onClick={() => setMeetingStatus('ongoing')}>
                    Ongoing
                </button>

                <button className={`${meetingStatus === 'upcoming' ? 'bg-[#373C51]' : 'border border-[#373C51]'} px-4 py-0.5 rounded-2xl`} onClick={() => setMeetingStatus('upcoming')}>
                    Upcoming
                </button>

                <button className={`${meetingStatus === 'past' ? 'bg-[#373C51]' : 'border border-[#373C51]'} px-4 py-0.5 rounded-2xl`} onClick={() => setMeetingStatus('past')}>
                    Past
                </button>
            </div>

            {/* Meetings */}
            <div className='fixed bottom-0 h-[85%] py-4 overflow-y-auto'>
                {errorFetching && <div>{errorFetching}</div>}
                {loading && <Loader />}
                {allMeetings?.length === 0 && <div className='text-xl text-[#ebe6e6] text-center font-semibold font-sans'>No Meetings currently 🤔</div>}
                {allMeetings?.length !== 0 &&
                    <div className='flex flex-col gap-3'>
                        {/* <h2 className='text-xl'>You have {allMeetings?.length} meetings</h2> */}
                        <div className='flex flex-wrap gap-8'>
                            {
                                allMeetings?.map(meeting => (
                                    <div
                                        className="bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white w-[20rem] p-5 rounded-2xl shadow-lg flex flex-col gap-5 border border-gray-700"
                                        key={meeting._id}
                                    >
                                        {/* Title and Host Info */}
                                        <div className="space-y-1">
                                            <h2 className="text-2xl font-extrabold tracking-tight text-indigo-400">{meeting.title}</h2>
                                            <p className="text-sm text-gray-400">
                                                <span className="font-semibold text-gray-300">Host:</span> {meeting.host.email}
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                Meeting ID: <span className="text-indigo-200 font-semibold tracking-widest">{meeting.slug}</span>
                                            </p>
                                        </div>

                                        {/* Schedule or Start Time */}
                                        <div className="text-sm">
                                            {new Date(meeting.startTime) > new Date() && (
                                                <div className="bg-blue-600/20 px-3 py-2 rounded-lg text-blue-300 font-medium">
                                                    📅 Scheduled for:{" "}
                                                    {new Date(meeting.startTime).toLocaleString("en-GB", dateConfig).replace(",", "")}
                                                </div>
                                            )}
                                            {new Date(meeting.startTime) <= new Date() && new Date(meeting.endTime) > new Date() && (
                                                <div className="bg-green-600/20 px-3 py-2 rounded-lg text-green-300 font-medium">
                                                    ⏱️ Started:{" "}
                                                    {new Date(meeting.startTime).toLocaleString("en-GB", dateConfig).replace(",", "")}
                                                </div>
                                            )}
                                        </div>

                                        {/* Status & Join Button */}
                                        <div className="flex justify-between items-center">
                                            <div className="text-xs font-bold">
                                                {new Date(meeting.startTime) > new Date() && (
                                                    <div className="bg-blue-800 text-white px-3 py-1 rounded-full shadow-sm">Upcoming</div>
                                                )}
                                                {new Date(meeting.endTime) <= new Date() && (
                                                    <div className="bg-gray-600 text-white px-3 py-1 rounded-full shadow-sm">Ended</div>
                                                )}
                                                {new Date(meeting.startTime) <= new Date() && new Date(meeting.endTime) > new Date() && (
                                                    <div className="bg-green-700 text-white px-3 py-1 rounded-full shadow-sm">Ongoing</div>
                                                )}
                                            </div>

                                            {new Date(meeting.startTime) <= new Date() &&
                                                new Date(meeting.endTime) > new Date() && (
                                                    <button
                                                        onClick={() => handleJoin({ roomId: meeting.slug })}
                                                        className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 px-5 py-1.5 rounded-lg text-white font-semibold text-sm shadow-md transition-all duration-200"
                                                    >
                                                        {isJoining ? "Joining..." : "Join"}
                                                    </button>
                                                )}
                                        </div>
                                    </div>

                                ))
                            }
                        </div>
                    </div>}
            </div>
        </div>
    )
}

export default Meetings