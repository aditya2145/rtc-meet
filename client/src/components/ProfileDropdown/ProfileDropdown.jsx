import React, { useEffect, useState } from 'react';
import { useAuth } from '../../providers/AuthProvider/AuthProvider';
import Confirmation from '../ConfirmationPage/Confirmation';

const ProfileDropdown = ({ setProfileDropdown }) => {
  const { authUser, logoutMutation } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    // Trigger the transition after mount
    const timeout = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timeout);
  }, []);


  return (
    <div>
      {/* Overlay */}
      <div
        onClick={() => setProfileDropdown(false)}
        className="fixed inset-0 z-20 bg-black/20"
      ></div>

      {/* Dropdown */}
      <div
        className={`
          fixed z-30 top-16 right-5 bg-[#2C3041] rounded-md shadow-lg overflow-hidden
          transform transition-all duration-300 ease-out
          ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
        `}
      >
        {/* User info */}
        <div className="border border-[#202332] px-4 py-3 flex gap-3 items-center">
          <div className="cursor-pointer w-8 h-8 rounded-full overflow-hidden">
            <img className="w-full h-full object-cover" src={authUser?.avatar} alt="avatar" />
          </div>
          <div className="flex flex-col text-sm">
            <div className='text-white text-lg font-semibold'>{authUser?.fullName}</div>
            <div className="text-[#beb7b7] text-md">{authUser?.email}</div>
          </div>
        </div>

        {/* Dropdown options */}
        <div className="text-sm">
          <div className="hover:bg-[#202332] px-4 py-2 cursor-pointer">My Profile</div>
          <div className="hover:bg-[#202332] px-4 py-2 cursor-pointer">Edit Profile</div>
          <div onClick={() => setIsClicked(true)} className="hover:bg-[#202332] px-4 py-2 cursor-pointer">Sign Out</div>
        </div>
      </div>

      {isClicked && <Confirmation confirmationType='logout' handleNo={setIsClicked} handleYes={logoutMutation} />}
    </div>
  );
};

export default ProfileDropdown;
