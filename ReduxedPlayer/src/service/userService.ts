
import { User } from '../models/user';

const baseURL = 'http://denicdamjan.ddns.net:8080/mongousers/';

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

export function dbGetUserByID(ID: string) {
    const url = baseURL + `?id=${ID}`;

    return fetch(url).
        then(res => res.json());
}

export function dbCheckUsername(username: string) {
    const url = `${baseURL}checkuser/?username=${username}`;

    return fetch(url).then(res=> res.json());
}

export function dbRemoveFriend(payload: any) {
    const url = `${baseURL}removefriend`;

    return fetch(url, { method: "POST", body: JSON.stringify(payload), headers: { "Content-Type": "application/json" } }).
        then(res => res.json());
}

export function dbAddFriend(payload: any) {
    const url = `${baseURL}addfriend`;

    return fetch(url, { method: "POST", body: JSON.stringify(payload), headers: { "Content-Type": "application/json" } }).
        then(res => res.json());
}

export function dbUpdateUser(payload: any) {
    const url = `${baseURL}updateuser`;

    return fetch(url, { method: "POST", body: JSON.stringify(payload), headers: { "Content-Type": "application/json" } }).
        then(res => res.json());
}