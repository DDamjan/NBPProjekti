// Drivers
const GET_ALL_DRIVERS = 'match (n:User {type:"Driver"}) return n';
const GET_DRIVER_BY_ID = 'match (n:User {type:"Driver"}) where id(n)=$ID return n';
// Users
const USER_AUTH = 'match (n:User {username:$user,password:$pass}) return n';
const GET_USER_BY_ID = 'MATCH (n:User) WHERE id(n)=$ID RETURN n';

module.exports = {
    GET_ALL_DRIVERS: GET_ALL_DRIVERS,
    GET_DRIVER_BY_ID: GET_DRIVER_BY_ID,
    USER_AUTH: USER_AUTH,
    GET_USER_BY_ID: GET_USER_BY_ID
}