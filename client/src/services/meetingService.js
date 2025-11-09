import { handleApiResponse } from "../../utils/handlerApiResponse";

export const getAllMeetings = async (meetingStatus) => {
    const res = await fetch(`/api/rooms/${meetingStatus}`);
    return handleApiResponse(res);
};

export const joinMeeting = async ({ roomId }) => {
    const res = await fetch('/api/rooms/join', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug: roomId }),
    });

    return handleApiResponse(res);
};

export const scheduleMeeting = async (meetingData) => {
    const res = await fetch('/api/rooms/schedule', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(meetingData),
    });

    return handleApiResponse(res);
};

export const createMeeting = async (meetingData) => {
    const res = await fetch('/api/rooms/newMeeting', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(meetingData),
    });

    return handleApiResponse(res);
};

export const leaveMeeting = async ({ slug }) => {
    const res = await fetch('/api/rooms/leave', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug }),
    });

    return handleApiResponse(res);
};

export const endMeeting = async ({ slug }) => {
    const res = await fetch('/api/rooms/endMeeting', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug }),
    });

    return handleApiResponse(res);
};

export const getMeetingDetails = async ({ slug }) => {
    const res = await fetch(`/api/rooms/meeting/${slug}`);
    return handleApiResponse(res);
};
