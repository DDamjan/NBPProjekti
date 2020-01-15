
// Users
const GET_ALL_USERS_TYPE = 'match (n:User {type:$Type}) return n';
const USER_AUTH = 'match (n:User {username:$user,password:$pass}) return n';
const GET_USER_BY_ID = 'MATCH (n:User) WHERE id(n)=$ID RETURN n';
const CREATE_DRIVER='CREATE(a:User {firstName:$Ime,lastName:$Prez,username:$User,password:$Pass,type:"driver",isActive:"true",phone:$Tel,car:$Car,carColor:$Color,licencePlate:$Plate,currentLat:$cLat,currentLng:$cLng,currentLocation:$cLoc,pickupLat:$pLat,pickupLng:$pLng,pickupLocation:$pLoc}) return a';
const CREATE_CLIENT='CREATE(a:User {firstName:$Ime,lastName:$Prez,username:$User,password:$Pass,type:"client",currentLat:$cLat,currentLng:$cLng,currentLocation:$cLoc,pickupLat:$pLat,pickupLng:$pLng,pickupLocation:$pLoc}) return a';
const CREATE_OPERATOR='CREATE(a:User {firstName:$Ime,lastName:$Prez,username:$User,password:$Pass,type:"operator",isActive:"true"}) return a';
function CreateQuerySelector(type){
    if(type=="driver"){ CREATE_DRIVER}
    if(type=="client"){CREATE_CLIENT}
    if(type=="operator"){CREATE_OPERATOR}
}

module.exports = {
    GET_ALL_USERS_TYPE: GET_ALL_USERS_TYPE,
    USER_AUTH: USER_AUTH,
    GET_USER_BY_ID: GET_USER_BY_ID,
    CREATE_DRIVER: CREATE_DRIVER,
    CREATE_CLIENT: CREATE_CLIENT,
    CREATE_OPERATOR: CREATE_OPERATOR,
    CreateQuerySelector: CreateQuerySelector
}