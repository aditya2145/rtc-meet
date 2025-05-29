const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const { connectMongoDB } = require('./db/connectMongoDB.js');

const userRoute = require('./routes/auth.route.js');
const roomRoute = require('./routes/room.route.js');

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);


const io = (process.env.NODE_ENV !== "production") ? new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ["GET", "POST"],
    }
}) : new Server(server);

if(process.env.NODE_ENV !== "production") {
    app.use(cors({
        origin: 'http://localhost:3000',
        credentials: true,
    }));
}
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoute);
app.use('/api/rooms', roomRoute);

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('join-room', ({ emailId, roomId }) => {
        socket.join(roomId);
        socket.to(roomId).emit('user-joined', { socketId: socket.id, emailId });
    });

    socket.on('offer', ({ to, offer }) => {
        io.to(to).emit('receive-offer', { offer, from: socket.id });
    });

    socket.on('answer', ({ answer, to }) => {
        io.to(to).emit('receive-answer', { answer, from: socket.id });
    });

    socket.on('ice-candidate', ({ candidate, to }) => {
        io.to(to).emit('receive-ice-candidate', { candidate, from: socket.id });
    });

    socket.on('left-meeting', ({roomId}) => {
        socket.leave(roomId);
        io.to(roomId).emit('user-left-meeting', {socketId: socket.id});
    });

    socket.on('end-meeting', ({roomId}) => {
        socket.to(roomId).emit('meeting-ended');
    })

    socket.on('disconnect', () => {
        console.log("User disconnected:", socket.id);
        io.emit('user-disconnected', { socketId: socket.id });
    });
});

if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")));

    app.get('/*\w', (req, res) => {
        res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
    })
}

server.listen(PORT, '0.0.0.0',() => {
    console.log(`Server is running at PORT: ${PORT}`);
    connectMongoDB();
});