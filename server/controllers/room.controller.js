const slugify = require('slugify');
const { v4: uuidv4 } = require('uuid');
const Room = require('../models/room.model.js');
const User = require('../models/user.model.js');
const { asyncHandler } = require('../utils/asyncHandler.js');
const { ApiError } = require('../utils/ApiError.js');
const { ApiResponse } = require('../utils/ApiResponse.js');

const createMeeting = asyncHandler(async (req, res) => {
        const { title, durationMinutes } = req.body;
        if(!title || !durationMinutes) {
            return res.status(400).json(new ApiError(400, "All fields are required"));
        }
        const slug = uuidv4().slice(0, 20);
        const start = new Date();
        const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

        const me = await User.findById(req.user._id).select("email");
        const room = await Room.create({
            slug,
            title,
            durationMinutes,
            startTime: start,
            invitedUsers: [me.email],
            host: req.user._id,
            endTime: end,
        });

        res.status(201).json(new ApiResponse(201, room, "Meeting created successfully"));
});

const scheduleMeeting = asyncHandler(async(req, res) => {
        const { title, startTime, durationMinutes } = req.body;
        if(!title || !durationMinutes || !startTime) {
            return res.status(400).json(new ApiError(400, "All fields are required"));
        }
        const slug = uuidv4().slice(0, 20);
        const start = new Date(startTime);
        if(start <= new Date()) {
            return res.status(400).json(new ApiError(400, "Start time should be more that current time"));
        }
        const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

        const me = await User.findById(req.user._id).select("email");
        const room = await Room.create({
            slug,
            title,
            durationMinutes,
            startTime: start,
            invitedUsers: [me.email],
            host: req.user._id,
            endTime: end,
        });

        res.status(201).json(new ApiResponse(201, room, "Meeting scheduled successfully"));
});

const joinMeeting = asyncHandler(async (req, res) => {
        const userId = req.user._id;
        const { slug } = req.body;
        const room = await Room.findOne({ slug }).select("title host startTime endTime durationMinutes").populate({
            path: "participants",
            select: "fullName avatar",
        });

        if (!room) {
            return res.status(404).json(new ApiError(404, "Room not found"));
        }

        const now = new Date();
        if (now >= new Date(room.endTime)) {
            return res.status(400).json(new ApiError(400, "Meeting Ended"));
        }

        if (now < new Date(room.startTime)) {
            return res.status(400).json(new ApiError(400, "Meeting not started"));
        }

        if(room.host.toString() === userId.toString()) {
            return res.status(200).json(room);
        }

        const alreadyJoined = room.participants.includes(userId);

        if (alreadyJoined) {
            console.log("ALREADY JOINED");
            return res.status(409).json({ message: "You are already in the meeting" });
        }

        room.participants.push(userId);
        console.log("JOINED");
        await room.save();

        res.status(200).json(room);
});

const leaveMeeting = asyncHandler(async (req, res) => {
        const { slug } = req.body;
        await Room.findOneAndUpdate({ slug }, { $pull: { participants: req.user._id } });

        res.status(200).json({message: "Left meeting successfully"});
});


const endMeeting = asyncHandler(async (req, res) => {
        const userId = req.user._id;
        const { slug } = req.body;
        const room = await Room.findOne({ slug });
        if (room.host.toString() !== userId.toString()) {
            return res.status(400).json({ message: "You don't have access to end the meeting" });
        }
        room.endTime = new Date();
        await room.save();
        res.status(200).json({message: "Meeting ended successfully"});
});

const upcomingMeetings = asyncHandler(async (req, res) => {
        const userId = req.user._id;
        const now = new Date();

        const me = await User.findById(userId).select("email");

        const meetings = await Room.find({
            invitedUsers: me.email,
            startTime: { $gt: now },
        })
        .select("title startTime slug endTime")
        .populate({
            path: "host",
            select: "email",
        });

        res.status(200).json(meetings);
});

const pastMeetings = asyncHandler(async (req, res) => {
        const userId = req.user._id;
        const now = new Date();

        const me = await User.findById(userId).select("email");

        const meetings = await Room.find({
            invitedUsers: me.email,
            endTime: { $lte: now },
        })
        .select("title slug startTime endTime")
        .populate({
            path: "host",
            select: "email",
        });

        res.status(200).json(meetings);
});

const ongoingMeetings = asyncHandler(async(req, res) => {
        const userId = req.user._id;
        const now = new Date();

        const me = await User.findById(userId).select("email");

        const meetings = await Room.find({
            invitedUsers: me.email,
            startTime: {$lte : now},
            endTime: {$gt: now},
        })
        .select("title slug startTime endTime")
        .populate({
            path: "host",
            select: "email",
        });

        res.status(200).json(meetings);
});

const getMeetingDetails = asyncHandler(async(req, res) => {
        const {slug} = req.params;
        const room = await Room.findOne({slug})
        .select("title startTime slug endTime durationMinutes")
        .populate({
            path: "participants",
            select: "fullName avatar",
        })
        .populate({
            path: "host",
            select: "fullName email avatar"
        })
        ;

        res.status(200).json(room);
});

module.exports = {
    createMeeting,
    scheduleMeeting,
    joinMeeting,
    leaveMeeting,
    endMeeting,
    upcomingMeetings,
    pastMeetings,
    getMeetingDetails,
    ongoingMeetings,
}