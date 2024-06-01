export const Logout = () => {
    localStorage.removeItem('id')
    localStorage.removeItem('authToken')
    window.location.href = "/";
}