import SessionSettings from '../model/SessionSettings';

export const getSessionByIdHelper = async (sessionId: string) => {
    const session = await SessionSettings.findOne({ sessionId });
    if (session) {
        return {
            _id: session._id,
            date: session.date, // No conversion to IST
            startTime: session.startTime, // Keep as is
            endTime: session.endTime, // Keep as is
            sessionId: session.sessionId,
        };
    }
    return null; 
};

export const saveSessionSettingsHelper = async (date: Date, startTime: string, endTime: string, sessionId: string) => {
    // Parse startTime and endTime
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    // Create Date objects for start and end times
    const startDateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), startHours, startMinutes);
    const endDateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), endHours, endMinutes);

    // Save the session without any timezone conversion
    const newSession = new SessionSettings({
        date: date.toISOString().split('T')[0], // Format date to 'yyyy-MM-dd' without time zone conversion
        startTime: startTime, // Keep as is
        endTime: endTime, // Keep as is
        sessionId: sessionId,
    });

    await newSession.save();
};

export const getSessionSettingsHelper = async () => {
    const settings = await SessionSettings.find({});
    
    return settings.map(setting => {
        // Parse the start and end times as is without converting them to IST
        return {
            _id: setting._id,
            date: setting.date, // Keep as is
            startTime: setting.startTime, // Keep as is
            endTime: setting.endTime, // Keep as is
            sessionId: setting.sessionId,
        };
    });
};

export const deleteSessionHelper = async (sessionId: string) => {
    const deletedSession = await SessionSettings.findByIdAndDelete(sessionId);
    return deletedSession !== null;
};
