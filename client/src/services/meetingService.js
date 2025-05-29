export const getAllMeetings = async(meetingStatus) => {
    try {
        const res = await fetch(`/api/rooms/${meetingStatus}`);
        const data = await res.json();
        if(!res.ok) {
            throw new Error(data.message || "Something went wrong");
        }
        return data;
    } catch (error) {
        throw (error.message);
    }
};

export const joinMeeting = async({roomId}) => {
    try {
        const res = await fetch('/api/rooms/join', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({slug: roomId}),
        });

        const data = await res.json();
        if(!res.ok) {
            throw new Error(data.message || "Something went wrong");
        }
        return data;

    } catch (error) {
        throw new Error(error.message);
    }
};

export const scheduleMeeting = async(meetingData) => {
    try {
        const res = await fetch('/api/rooms/schedule', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(meetingData),
        });
        const data = await res.json();

        if(!res.ok) {
            throw new Error(data.message || "Something went wrong");
        }
        return data;
    } catch (error) {
        throw (error.message);
    }
};

export const createMeeting = async(meetingData) => {
    try {
        const res = await fetch('/api/rooms/newMeeting', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(meetingData),
        });
        const data = await res.json();

        if(!res.ok) {
            throw new Error(data.message || "Something went wrong");
        }
        return data;
    } catch (error) {
        throw (error.message);
    }
};

export const leaveMeeting = async({slug}) => {
    try {
        const res = await fetch('/api/rooms/leave', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({slug}),
        });
        const data = await res.json();

        if(!res.ok) {
            throw new Error(data.error || "Something went wrong");
        }
        return data;
    } catch (error) {
        throw (error.message);
    }
};

export const endMeeting = async({slug}) => {
    try {
        const res = await fetch('/api/rooms/endMeeting', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({slug}),
        });
        const data = await res.json();

        if(!res.ok) {
            throw new Error(data.error || "Something went wrong");
        }
        return data;
    } catch (error) {
        throw (error.message);
    }
};

export const getMeetingDetails = async({slug}) => {
    try {
        const res = await fetch(`/api/rooms/meeting/${slug}`);
        const data = await res.json();

        if(!res.ok) {
            throw new Error(data.error || "Something went wrong");
        }
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
};
