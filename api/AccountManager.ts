let _username: string | null = null;

export function isLoggedIn() {
    return _username !== null;
}

export function getUserName() {
    return _username;
}

export function doLogin(username: string, password: string) {
    _username = username;
    return true;
}

export function logout() {
    _username = null;
}