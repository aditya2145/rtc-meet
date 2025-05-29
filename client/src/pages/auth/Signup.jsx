import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../providers/AuthProvider/AuthProvider';

const Signup = () => {
  const [formData, setFormData] = useState({});
  const { signupMutation, signupError } = useAuth();

  const handleInputChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  }


  const handleClick = (e) => {
    e.preventDefault();
    signupMutation(formData);
  }

  return (
    <div className='w-screen h-screen flex justify-center items-center bg-gradient-to-br from-[#080808] via-[#121723] to-[#0f1822]'>
      <div className='flex flex-col gap-6 bg-[#202332] text-white p-8 rounded-lg shadow-lg w-full max-w-sm'>
        <h3 className='text-center font-bold text-2xl'>Signup</h3>

        <div className='flex flex-col gap-4'>
          <input
            onChange={handleInputChange}
            name='username'
            className='px-4 py-2 rounded-md bg-[#202332] text-white border border-gray-600 focus:outline-none placeholder-gray-400'
            type="text"
            placeholder='Username'
          />
          <input
            onChange={handleInputChange}
            name='fullName'
            className='px-4 py-2 rounded-md bg-[#202332] text-white border border-gray-600 focus:outline-none placeholder-gray-400'
            type="text"
            placeholder='Full Name'
          />
          <input
            onChange={handleInputChange}
            name='email'
            className='px-4 py-2 rounded-md bg-[#202332] text-white border border-gray-600 focus:outline-none placeholder-gray-400'
            type="text"
            placeholder='Email'
          />
          <input
            onChange={handleInputChange}
            name='password'
            className='px-4 py-2 rounded-md bg-[#202332] text-white border border-gray-600 focus:outline-none   placeholder-gray-400'
            type="password"
            placeholder='Password'
          />
          {signupError && <div className='text-red-600'>{signupError.message}</div>}
          <button onClick={handleClick} className='cursor-pointer bg-[#4c4c96] hover:bg-[#363669] text-white font-semibold py-2 rounded-md transition'>
            Signup
          </button>
        </div>

        <div className='text-sm text-center text-gray-300'>
          Already have an account?{' '}
          <Link to='/login' className='cursor-pointer text-[#5454a5] font-semibold hover:underline'>
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Signup