import React from 'react'
import { useNavigate } from 'react-router-dom';

const MiniMeetingBox = ({roomId, roomTitle, roomHost, onClose}) => {
    const navigate = useNavigate();

    const handleRestore = () => {
        navigate(`/room/${roomId}`);
        onClose();
    }

  return (
    <div
      onClick={handleRestore}
      className="fixed flex w-[13rem] h-[8rem] flex-col justify-center items-center gap-2 bottom-10 right-10 bg-[#242323] text-white p-4 rounded-lg shadow-lg cursor-pointer hover:opacity-80 transition-all duration-200 z-50"
    >
      <p className="text-md font-semibold underline text-[#6a6ad1]">{roomTitle}</p>
      <p className="text-sm  font-semibold text-gray-300">{roomHost}</p>
      <p className="text-xs font-bold text-gray-300">Click to return</p>
    </div>
  )
}

export default MiniMeetingBox