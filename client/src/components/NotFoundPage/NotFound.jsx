import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className='text-center flex flex-col gap-2 p-7 h-screen w-screen bg-black text-white'>
      <h1 className='text-2xl font-bold'>404 - Page Not Found</h1>
      <p className='text-lg'>Sorry, the page you're looking for doesn't exist.</p>
      <Link className='text-[#4242e8]' to="/">Go back home</Link>
    </div>
  );
}

export default NotFound;
