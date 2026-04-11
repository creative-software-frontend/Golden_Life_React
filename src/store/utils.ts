export const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';

export const getAuthToken = () => {
    const vendorSession = sessionStorage.getItem("vendor_session");
    const studentSession = sessionStorage.getItem("student_session");
    const session = vendorSession || studentSession;
    if (!session) return null;
    try {
        const parsed = JSON.parse(session);
        return new Date().getTime() < (parsed.expiry || Infinity) ? parsed.token : null;
    } catch {
        return null;
    }
};