import Admin from '../model/Admin.js';

export const adminLoginHelper = async (username: string, password: string) => {
    const admin = await Admin.findOne({ username });
    if (admin && admin.password === password) {
        return { success: true };
    }
    return { success: false };
};
