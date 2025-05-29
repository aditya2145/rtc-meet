import React, { useEffect, useState, useRef } from 'react';
import { useSocket } from '../../providers/SocketProvider/Socket';
import { usePeer } from '../../providers/PeerProvider/Peer';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider/AuthProvider';
import { getMeetingDetails, leaveMeeting, endMeeting } from '../../services/meetingService';
import MicOn from '../../assets/mic.svg'
import MicOff from '../../assets/mute-mic.svg'
import VideoOn from '../../assets/video-icon.svg'
import VideoOff from '../../assets/video-off.svg'
import ScreenShare from '../../assets/screen-share.svg'
import PeopleIcon from '../../assets/people-logo.svg'
import Minimize from '../../assets/minimize.svg'
import Confirmation from '../../components/ConfirmationPage/Confirmation';
import MeetingDetails from '../../components/MeetingDetails/MeetingDetails';
import toast from 'react-hot-toast'

function Room({onMinimize}) {
  const { roomId } = useParams();
  const { authUser } = useAuth();
  const { socket } = useSocket();
  const { createOffer, createAnswer, handleRemoteAnswer, handleIceCandidate, removePeer, removeAllPeers, remoteStreams } = usePeer();
  const localVideo = useRef();
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [viewParticipants, setViewParticipants] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  const [endTheMeeting, setEndMeeting] = useState(false);
  const [currentMeeting, setCurrentMeeting] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const remoteVideoRefs = useRef({});


useEffect(() => {
  Object.entries(remoteStreams).forEach(([id, stream]) => {
    if (remoteVideoRefs.current[id]) {
      remoteVideoRefs.current[id].srcObject = stream;
    }
  });
}, [remoteStreams]);

  useEffect(() => {
    if(!currentMeeting || !currentMeeting.endTime) {
      return;
    }
    const now = Date.now();
    const end = new Date(currentMeeting.endTime).getTime();
    const timeLeft = end - now;

    if (timeLeft <= 0) {
      // If already past, redirect immediately
      navigate('/');
    } else {
      // Redirect after remaining time
      const timeout = setTimeout(() => {
        navigate('/');
        toast.success("Meeting Ended");
      }, timeLeft);

      return () => clearTimeout(timeout); // Cleanup on unmount
    }
  }, [currentMeeting, currentMeeting?.endTime, navigate]);


  const toggleMic = () => {
    const audioTrack = localVideo.current.srcObject.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicOn(audioTrack.enabled);
    }
  };

  const toggleCamera = () => {
    const videoTrack = localVideo.current.srcObject.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsCameraOn(videoTrack.enabled);
    }
  };

  const toggleViewParticipants = () => {
    setViewParticipants(!viewParticipants);
  }

  const handleMinimize = () => {
    if(currentMeeting?.title && currentMeeting?.host.fullName) {
      onMinimize(roomId, currentMeeting.title, currentMeeting.host.fullName);
    }
  };

  const handleLeave = async() => {
    try {
      await leaveMeeting({slug: roomId});
      socket?.emit('left-meeting', {roomId});
      navigate('/');
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEnd = async() => {
    try {
      await endMeeting({slug: roomId});
      socket?.emit('end-meeting', {roomId});
      await removeAllPeers();
      navigate('/');
    } catch (error) {
      console.log(error.message);
    }
  };


  useEffect(() => {
    const start = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideo.current.srcObject = stream;
      try {
        const currMeeting = await getMeetingDetails({slug: roomId});
        setCurrentMeeting(currMeeting);
      } catch (error) {
        setError(error);
      }

      socket?.emit('join-room', { emailId: authUser?.email, roomId });
      socket?.on('user-joined', async ({ socketId, emailId }) => {
        console.log(socketId);
        const offer = await createOffer({ localStream: localVideo.current.srcObject, socketId });
        socket?.emit('offer', { offer, to: socketId });
        try {
          const currMeeting = await getMeetingDetails({slug: roomId});
          setCurrentMeeting(currMeeting);
        } catch (error) {
          setError(error);
        }
      });

      socket?.on('receive-offer', async ({ offer, from }) => {
        console.log("OFFER Received");
        const answer = await createAnswer({ offer, from, localStream: localVideo.current.srcObject });
        socket.emit('answer', { answer, to: from });
      });

      socket?.on('receive-answer', async ({ answer, from }) => {
        console.log("ANSWER RECEIVED");
        await handleRemoteAnswer({ answer, from });
      });

      socket?.on('receive-ice-candidate', async ({ candidate, from }) => {
        await handleIceCandidate({ candidate, from });
      });

      socket?.on('user-left-meeting', async({socketId}) => {
        await removePeer({ socketId });
        try {
          const currMeeting = await getMeetingDetails({slug: roomId});
          setCurrentMeeting(currMeeting);
        } catch (error) {
          setError(error);
        }
      });

      socket?.on('meeting-ended', async(roomId) => {
        await removeAllPeers();
        navigate('/');
        toast.success('Meeting Ended');
      });

      socket?.on('user-disconnected', async ({ socketId }) => {
        await removePeer({ socketId });
        try {
          const currMeeting = await getMeetingDetails({slug: roomId});
          setCurrentMeeting(currMeeting);
        } catch (error) {
          setError(error);
        }
      });
    }
    start();

    return () => {
      socket.off('user-joined');
      socket.off('receive-offer');
      socket.off('receive-answer');
      socket.off('receive-ice-candidate');
      socket.off('user-left-meeting');
      socket.off('meeting-ended');
      socket.off('user-disconnected');
    };
  }, [authUser?.email, createAnswer, createOffer, handleIceCandidate, handleRemoteAnswer, navigate, removeAllPeers, removePeer, roomId, socket]);

  return (
    <div className='text-white flex flex-col bg-[#242323] h-screen w-screen'>
      <header className='flex justify-between items-center bg-[#1E2939] px-10 py-2'>
        <h2 className='text-xl font-semibold text-white'>{currentMeeting?.title}</h2>

        <div className='flex items-center gap-2'>
          <div className='flex flex-col items-center gap-0.5'>
            <button onClick={toggleViewParticipants} className='w-[1.5rem] h-[1.5rem] overflow-hidden'>
              <img className='w-full h-full object-cover hover:opacity-50' src={PeopleIcon} alt="people-logo" />
            </button>
            <span className='text-sm'>Participants</span>
          </div>

          <div className='flex flex-col items-center gap-0.5'>
            <button onClick={handleMinimize} className='w-[1.5rem] h-[1.5rem] overflow-hidden'>
              <img className='w-full h-full object-cover hover:opacity-50' src={Minimize} alt="minimize" />
            </button>
            <span className='text-sm'>Minimize</span>
          </div>
        </div>
      </header>

      <div className='flex'>
        <div className={`p-4 ${viewParticipants? 'w-[75%]' : 'w-full'}`}>
          <video ref={localVideo} autoPlay muted playsInline className='w-[20rem] rounded-lg overflow-hidden' />
          {remoteStreams && <div className='flex flex-wrap'>
            {Object.entries(remoteStreams).map(([id, stream]) => (
              <video
                key={id}
                autoPlay
                playsInline
                ref={(el) => {
                  if (el) remoteVideoRefs.current[id] = el;
                }}
                style={{ width: 300, margin: 10 }}
              />
            ))}
          </div>
          }
        </div>

        {viewParticipants && 
        <div className='w-[25%] bg-[#2e2d2d] rounded-lg text-white h-screen fixed right-0 overflow-y-auto'>
          <MeetingDetails currentMeeting={currentMeeting} />
        </div> 
        }  
      </div>

      <footer className='fixed flex items-center justify-between px-10 py-3 w-full bg-[#1E2939] bottom-0 left-0'>
        <div className='flex items-baseline gap-10'>
          <div className='flex flex-col items-start gap-0.5'>
            <button onClick={toggleMic} className='w-[1.8rem] h-[1.8rem] overflow-hidden'>
              <img className='transition-colors duration-300 hover:opacity-50 h-full w-full object-cover' src={isMicOn? MicOn : MicOff} alt="mic-logo" />
            </button>
            <span className='absolute bottom-1 text-xs'>{isMicOn? 'Mute' : 'Unmute'}</span>
          </div>

          <div className='flex flex-col gap-0.5'>
            <button onClick={toggleCamera} className='w-[1.8rem] h-[1.8rem] overflow-hidden'>
              <img className='transition-colors duration-300 hover:opacity-50 h-full w-full object-cover' src={isCameraOn? VideoOn : VideoOff} alt="video-logo" />
            </button>
            <span className='absolute bottom-1 text-xs'>{isCameraOn? 'Off' : 'On'}</span>
          </div>
        </div>

        <div className='flex flex-col gap-0.5'>
          <button className='w-[1.8rem] h-[1.8rem] overflow-hidden'>
            <img className='transition-colors duration-300  hover:opacity-50 h-full w-full object-cover' src={ScreenShare} alt="screen-share-logo" />
          </button>
          <span className='text-sm'>Share</span>
        </div>

        <div className='flex items-center gap-4'>
          <button onClick={() => setConfirmation(true)} className='transition-colors duration-300 bg-indigo-500 hover:bg-indigo-600 px-4 py-1 rounded-lg'>
            Leave
          </button>

          {currentMeeting?.host?.email === authUser?.email && <button onClick={() => setEndMeeting(true)} className='bg-red-600 transition-colors duration-300 hover:bg-red-700 px-4 py-1 rounded-lg'>
            End Meeting
          </button>
          }
        </div>
      </footer>
      {endTheMeeting && (
        <Confirmation confirmationType={'end meeting'} handleYes={handleEnd} handleNo={setEndMeeting} />
      )}

      {confirmation && (
        <Confirmation confirmationType={'leave meeting'} handleYes={handleLeave} handleNo={setConfirmation} />
      )}

    </div>
  );
}

export default Room;