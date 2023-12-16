import { jwtDecode } from "jwt-decode";

export function getCurrentUser(localStorage) {
    const userFields = ['userName', 'points', 'badge'];
    const token = localStorage.getItem('userToken');
    if (token) {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < new Date()) {
            localStorage.removeItem('userToken');
            return false;
        }
        return userFields.reduce((acc, field) => {
            acc[field] = localStorage.getItem(field);
            return acc;
        }, {});
    }
    return false;
}

export function getCurrentUserToken(localStorage) {
    const token = localStorage.getItem('userToken');
    if (token) {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp < new Date()) {
            localStorage.removeItem('userToken');
            return false;
        }
    }
    return token;
}

export function saveCurrentUser({username, points, badge, jwt}, localStorage) {
    !!username ? localStorage.setItem('userName', username) : localStorage.removeItem('userName');
    !!points ? localStorage.setItem('points', points) : localStorage.removeItem('points');
    !!badge ? localStorage.setItem('badge', badge) : localStorage.removeItem('badge');
    !!jwt ? localStorage.setItem('userToken', jwt) : localStorage.removeItem('userToken');
}