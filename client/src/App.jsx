import './App.css'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Home from './pages/home/Home'
import Room from './pages/room/Room'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import NotFound from './components/NotFoundPage/NotFound'
import { SocketProvider } from './providers/SocketProvider/Socket'
import { PeerProvider } from './providers/PeerProvider/Peer'
import { useAuth } from './providers/AuthProvider/AuthProvider'
import MiniMeetingBox from './components/MiniMeetingBox/MiniMeetingBox'
import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import Loader from './components/Loader/Loader'

function App() {
  const navigate = useNavigate();
  const { authUser, loadingUser } = useAuth();
  const [minimizedMeeting, setMinimizedMeeting] = useState({
    isMinimized: false,
    roomId: null,
    title: '',
    host: '',
  });

  if(loadingUser) {
    return <Loader />
  }

  return (
    <div className='relative'>
      <SocketProvider>
        <PeerProvider>
          <Routes>
            <Route path='/' element={authUser? <Home /> : <Navigate to='/login' />} />
            <Route path='/room/:roomId' element={authUser? <Room onMinimize={(roomId, title, host) => setMinimizedMeeting({isMinimized: true, roomId, title, host})} /> : <Navigate to='/login' />} />
            <Route path='/login' element={!authUser? <Login /> : <Navigate to='/' />} />
            <Route path='/signup' element={!authUser? <Signup /> : <Navigate to='/' />} />

            <Route path='*' element={<NotFound />} />
          </Routes>
          {minimizedMeeting.isMinimized && (
            <>
            <div className='inset-0 fixed z-20 bg-black'></div>
            <MiniMeetingBox 
            roomId={minimizedMeeting.roomId}
            roomTitle={minimizedMeeting.title}
            roomHost = {minimizedMeeting.host}
            onClose={() => setMinimizedMeeting({isMinimized: false, roomId: null, speaker: ''})} />
            </>
          )}
        </PeerProvider>
      </SocketProvider>
      <Toaster
      position="top-center"
      reverseOrder={false}
      />
    </div>
  )
}

export default App
