import SessionSettings from '../model/SessionSettings';
import { toZonedTime, format } from 'date-fns-tz';

const IST_TIME_ZONE = 'Asia/Kolkata';

export const getSessionByIdHelper = async (sessionId: string) => {
    const session = await SessionSettings.findOne({ sessionId });
    if (session) {
        return {
            _id: session._id,
            date: format(toZonedTime(new Date(session.date), IST_TIME_ZONE), 'yyyy-MM-dd'),
            startTime: session.startTime,
            endTime: session.endTime,
            sessionId: session.sessionId,
        };
    }
    return null; 
};


export const saveSessionSettingsHelper = async (date: Date, startTime: string, endTime: string,sessionId:string) => {
   

    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    const startDateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), startHours, startMinutes);
    const endDateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), endHours, endMinutes);

    const istStartTime = toZonedTime(startDateTime, IST_TIME_ZONE);
    const istEndTime = toZonedTime(endDateTime, IST_TIME_ZONE);

    
    const newSession = new SessionSettings({
        date: format(toZonedTime(date, IST_TIME_ZONE), 'yyyy-MM-dd'),
        startTime: format(istStartTime, 'HH:mm'),
        endTime: format(istEndTime, 'HH:mm'),
        sessionId: sessionId,
    });

    await newSession.save(); 
};
export const getSessionSettingsHelper = async () => {
    const settings = await SessionSettings.find({});
    
    return settings.map(setting => {
        const startDate = new Date(setting.date);
        const startHoursMinutes = setting.startTime.split(':').map(Number);
        const startDateTime = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startHoursMinutes[0], startHoursMinutes[1]);

        const endDate = new Date(setting.date);
        const endHoursMinutes = setting.endTime.split(':').map(Number);
        const endDateTime = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), endHoursMinutes[0], endHoursMinutes[1]);

        const istStartTime = toZonedTime(startDateTime, IST_TIME_ZONE);
        const istEndTime = toZonedTime(endDateTime, IST_TIME_ZONE);

        const formattedDate = format(toZonedTime(startDate, IST_TIME_ZONE), 'yyyy-MM-dd');
        
        return {
            _id: setting._id,
            date: formattedDate,
            startTime: format(istStartTime, 'HH:mm'),
            endTime: format(istEndTime, 'HH:mm'),
            sessionId: setting.sessionId,
        };
    });
};


export const deleteSessionHelper = async (sessionId: string) => {
    const deletedSession = await SessionSettings.findByIdAndDelete(sessionId);
    return deletedSession !== null;
};
