import React from 'react'

const MeetingDetails = ({currentMeeting}) => {
  return (
    <div className='flex flex-col gap-4'>
        <div className='border-b border-[#242323] flex flex-col gap-1'>
            <span className='font-semibold text-[#FACC15] text-lg p-2 pb-0'>Host</span>
            <div className='flex items-center gap-3 p-2 pb-4 transition-colors duration-300 hover:bg-[#252525]'>
                <div className='w-[2rem] h-[2rem] overflow-hidden rounded-full'>
                    <img className='w-full h-full object-cover' src={currentMeeting?.host?.avatar} alt="avatar" />
                </div>
                <div>{currentMeeting?.host?.fullName}</div>
            </div>
        </div>

        <div>
            <span className='font-semibold text-[#6a95d4] text-lg px-2'>Participants: <span className=''>{currentMeeting.participants.length}</span></span>
            <div className='flex flex-col'>
                {currentMeeting?.participants?.map(participant => (
                    <div key={participant._id} className='w-full p-2 flex gap-3 transition-colors duration-300 hover:bg-[#252525]'>
                        <div className='w-[1.2rem] h-[1.2rem] overflow-hidden rounded-full'>
                            <img className='w-full h-full object-cover' src={participant.avatar} alt="avatar" />
                        </div>

                        <div>{participant.fullName}</div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}

export default MeetingDetails