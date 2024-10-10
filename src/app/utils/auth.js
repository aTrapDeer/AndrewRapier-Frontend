export const isAuthenticated = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('isAuthenticated') === 'true';
    }
    return false;
};
