
import { User } from '../models/user';

const baseURL = 'http://localhost:8080/users/';

export function dbRegisterUser(username: string, password: string) {
    const url = baseURL + 'register';
    const payload = {
        username,
        password
    }

    return fetch(url, { method: "POST", body: JSON.stringify(payload), headers: { "Content-Type": "application/json" } }).
        then(res => res.json());
}

export function dbAuthUser(username: string, password: string) {
    const url = baseURL + 'auth';
    const data = {
        username,
        password
    }

    return fetch(url, { method: "POST", body: JSON.stringify(data), headers: { "Content-Type": "application/json" } }).
        then(res => res.json());
}

export function dbGetUserByID(ID: number) {
    const url = baseURL + `?id=${ID}`;

    return fetch(url).
        then(res => res.json());
}

export function dbCheckUsername(username: string) {
    const url = `${baseURL}checkuser/?username=${username}`;

    return fetch(url).then(res=> res.json());
}