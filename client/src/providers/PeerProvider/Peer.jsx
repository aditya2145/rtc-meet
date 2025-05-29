import { createContext, useCallback, useContext, useRef, useState } from "react";
import { useSocket } from "../SocketProvider/Socket";

const PeerContext = createContext();

export const usePeer = () => useContext(PeerContext);

export const PeerProvider = (props) => {
    const {socket} = useSocket();
    const peerConnections = useRef({});
    const [remoteStreams, setRemoteStreams] = useState({});

    const createPeerConnection = useCallback(({localStream, socketId}) => {
        const peer = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });

        localStream.getTracks().forEach(track => peer.addTrack(track, localStream));

        peer.onicecandidate = (e) => {
            if(e.candidate) {
                socket.emit('ice-candidate', { candidate: e.candidate, to: socketId });
            }
        }

        peer.ontrack = (e) => {
            setRemoteStreams((prev) => ({...prev, [socketId]: e.streams[0]}));
        };

        peerConnections.current[socketId] = peer;
        return peer;
    }, [socket]);

    const createOffer = useCallback(async({socketId, localStream}) => {
        const peer = createPeerConnection({localStream, socketId});
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        return offer;
    }, [createPeerConnection]);

    const createAnswer = useCallback(async({offer, from, localStream}) => {
        const peer = createPeerConnection({localStream, socketId: from});
        await peer.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        return answer;
    }, [createPeerConnection]);

    const handleRemoteAnswer = useCallback(async({answer, from}) => {
        const peer = peerConnections.current[from];
        if(peer) {
            await peer.setRemoteDescription(new RTCSessionDescription(answer));
        }
    }, []);


    const handleIceCandidate = useCallback(async({candidate, from}) => {
        const peer = peerConnections.current[from];
        if(peer) {
            await peer.addIceCandidate(new RTCIceCandidate(candidate));
        }
    }, []);

    const removePeer = useCallback(async({socketId}) => {
        if(peerConnections.current[socketId]) {
            peerConnections.current[socketId].close();
            delete peerConnections.current[socketId];
            setRemoteStreams((prev) => {
                const updated = {...prev};
                delete updated[socketId];
                return updated;
            });
        }
    }, []);

    const removeAllPeers = useCallback(async() => {
        Object.keys(peerConnections.current).forEach((socketId) => {
            peerConnections.current[socketId].close();
            delete peerConnections.current[socketId];
        });
        setRemoteStreams({});
    }, []);

    return (
        <PeerContext.Provider value={{createOffer, createAnswer, handleRemoteAnswer, handleIceCandidate, removePeer, remoteStreams, removeAllPeers}}>
            {props.children}
        </PeerContext.Provider>
    )
}

