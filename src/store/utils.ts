export const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';

export const getAuthToken = () => {
    const session = sessionStorage.getItem("student_session");
    if (!session) return null;
    try {
        const parsed = JSON.parse(session);
        // Check if token is expired
        return new Date().getTime() < parsed.expiry ? parsed.token : null;
    } catch {
        return null;
    }
};