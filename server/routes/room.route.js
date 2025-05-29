const express = require('express');
const { joinMeeting, createMeeting, leaveMeeting, scheduleMeeting, endMeeting, upcomingMeetings, pastMeetings, getMeetingDetails, ongoingMeetings } = require('../controllers/room.controller.js');
const { protectRoute } = require('../middlewares/protectRoute.js');

const router = express.Router();

router.post('/join', protectRoute, joinMeeting);
router.post('/newMeeting', protectRoute, createMeeting);
router.post('/schedule', protectRoute, scheduleMeeting);
router.post('/leave', protectRoute, leaveMeeting);
router.post('/endMeeting', protectRoute, endMeeting);
router.get('/upcoming', protectRoute, upcomingMeetings);
router.get('/past', protectRoute, pastMeetings);
router.get('/ongoing', protectRoute, ongoingMeetings);
router.get('/meeting/:slug', protectRoute, getMeetingDetails);

module.exports = router; 