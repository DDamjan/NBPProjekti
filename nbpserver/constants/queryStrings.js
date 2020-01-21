// Users
const GET_ALL_USERS_TYPE = 'match (n:User {type:$Type}) return n';
const USER_AUTH = 'match (n:User {username:$user,password:$pass}) return n';
const GET_USER_BY_ID = 'MATCH (n:User) WHERE id(n)=$ID RETURN n';
const CREATE_DRIVER='CREATE(a:User {firstName:$Ime,lastName:$Prez,username:$User,password:$Pass,type:"driver",isActive:"true",phone:$Tel,car:$Car,carColor:$Color,licencePlate:$Plate,currentLat:$cLat,currentLng:$cLng,currentLocation:$cLoc,pickupLat:null,pickupLng:null,pickupLocation:""}) return a';
const CREATE_CLIENT='CREATE(a:User {firstName:$Ime,lastName:$Prez,username:$User,password:$Pass,type:"client",pickupLat:$Lat,pickupLng:$Lng,pickupLocation:$Loc}) return a';
const CREATE_RIDE='match (n:User),(m:User) where id(m)=$DID and id(n)=$CID create (n)-[r:Ride {startLat:$SLat,startLng:$SLng,destinationLat:$DLat,destinationLng:$DLng,startLocation:$SLoc,destinationLocation:$DLoc,startTime:$STime,endTime:"X",isCanceled:false,fare:$Fare,distance:$Dist}]->(m) return r';
const FINISH_RIDE='match (n:User)-[r:Ride]->(m:User) where id(n)=$CID and id(m)=$DID and id(r)=$RID set r.destinationLat=$DLat,r.destinationLng=$DLng,r.destinationLocation=$DLoc,r.endTime=$ETime return r';
const CANCEL_RIDE='match (n:User)-[r:Ride]->(m:User) where id(n)=$CID and id(m)=$DID and id(r)=$RID set r.endTime=$ETime return r';
const DRIVER_ALL_RIDES='match (m:User)-[r:Ride]->(n:User) where id(n)=$DID return r';
const CLIENT_ALL_DEST_LOC='match (m:User)-[r:Ride]->(n:User) where id(m)=$CID return r.destinationLocation';
const ALL_DRIVERS_WITH_RIDES='match (m:User)-[r:Ride]->(n:User) return distinct n';
const DISPATCH='match (n:User),(m:User) where id(m)=$DID and id(n)=$OID create (n)-[r:Dispatch {dispachDateTime:datetime()}]->(m) return r';
const CHECK_USER='match (n:User {username:$user}) return n';
const TOP_LOCATIONS='match (m:User)-[r:Ride]->(n:User) where  id(m)=$CID return distinct count(r),r.destLoc order by r.destLoc';

module.exports = {
    GET_ALL_USERS_TYPE: GET_ALL_USERS_TYPE,
    USER_AUTH: USER_AUTH,
    GET_USER_BY_ID: GET_USER_BY_ID,
    CREATE_DRIVER: CREATE_DRIVER,
    CREATE_CLIENT: CREATE_CLIENT,
    CREATE_RIDE: CREATE_RIDE,
    FINISH_RIDE: FINISH_RIDE,
    CANCEL_RIDE: CANCEL_RIDE,
    DRIVER_ALL_RIDES: DRIVER_ALL_RIDES,
    CLIENT_ALL_DEST_LOC: CLIENT_ALL_DEST_LOC,
    ALL_DRIVERS_WITH_RIDES: ALL_DRIVERS_WITH_RIDES,
    DISPATCH: DISPATCH,
    CHECK_USER: CHECK_USER ,
    TOP_LOCATIONS: TOP_LOCATIONS
}