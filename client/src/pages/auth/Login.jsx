import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {useAuth} from '../../providers/AuthProvider/AuthProvider'

const Login = () => {
  const [formData, setFormData] = useState({});
  const { loginMutation, loginError } = useAuth();

  const handleInputChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  }

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(formData);
  }

  return (
    <div className='z-10 w-screen h-screen flex justify-center items-center bg-gradient-to-br from-[#080808] via-[#121723] to-[#0f1822]'>
      <div className='flex flex-col gap-6 bg-[#202332] text-white p-8 rounded-lg shadow-lg w-full max-w-sm'>
        <h3 className='text-center font-bold text-2xl'>Login</h3>

        <div className='flex flex-col gap-4'>
          <input
            name='username'
            onChange={handleInputChange}
            className='px-4 py-2 rounded-md bg-[#202332] text-white border border-gray-600 focus:outline-none placeholder-gray-400'
            type="text"
            placeholder='Enter your username'
          />
          <input
            name='password'
            onChange={handleInputChange}
            className='px-4 py-2 rounded-md bg-[#202332] text-white border border-gray-600 focus:outline-none placeholder-gray-400'
            type="password"
            placeholder='Enter your password'
          />
          {loginError && <div className='text-red-600'>{loginError.message}</div>}
          <button onClick={handleLogin} className='cursor-pointer bg-[#4c4c96] hover:bg-[#363669] text-white font-semibold py-2 rounded-md transition'>
            Login
          </button>
        </div>

        <div className='text-sm text-center text-gray-300'>
          Don't have an account?{' '}
          <Link to='/signup' className='text-[#5454a5] font-semibold hover:underline'>
            Signup
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
