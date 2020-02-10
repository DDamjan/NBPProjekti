const REPO_PATH = __dirname.substring(0, __dirname.indexOf('\\constants')) + '\\repo\\';

const GET_ALL_USERS_TYPE = 'match (n) where n.type=$Type return n';
const USER_AUTH = 'match (n) where n.username=$user and n.password=$pass return n';
const USER_AUTH_WAR='match (n)-[r1]->(r:Ride) where n.username=$user and n.password=$pass and r.isActive=true return n,r';
const GET_USER_BY_ID = 'MATCH (n) WHERE id(n)=$ID RETURN n';
const GET_USER_BY_ID_WAR='match (n)-[r1]->(r:Ride) where id(n)=$ID and r.isActive=true return n,r';
const CREATE_DRIVER='CREATE(a:Driver {firstName:$Ime,lastName:$Prez,username:$User,password:$Pass,type:"driver",isActive:false,phone:$Tel,car:$Car,carColor:$Color,licencePlate:$Plate,currentLat:$cLat,currentLng:$cLng,currentLocation:$cLoc,pickupLat:0.0,pickupLng:0.0,pickupLocation:""}) return a';
const CREATE_CLIENT='CREATE(a:Client {firstName:$Ime,lastName:$Prez,username:$User,password:$Pass,type:"client",isActive:false,currentLat:$Lat,currentLng:$Lng,currentLocation:$Loc,destinationLat:0.0,destinationLng:0.0,destinationLocation:""}) return a';
const CREATE_RIDE='CREATE (r:Ride {isActive:true,pickupLat:$SLat,pickupLng:$SLng,destinationLat:$DLat,destinationLng:$DLng,pickupLocation:$SLoc,destinationLocation:$DLoc,startTime:$STime,endTime:"X",isCanceled:false,fare:$Fare,distance:$Dist}) return r';
const RIDE_DISPACHED='match (n:Operator),(m:Ride) where id(m)=$RID and id(n)=$OID create (n)-[r:RIDE_DISPACHED {DateTime:datetime()}]->(m) return r';
const RIDE_DRIVEN='match (n:Driver),(m:Ride) where id(m)=$RID and id(n)=$DID create (n)-[r:RIDE_DRIVEN {DateTime:datetime()}]->(m) return r';
const RIDE_REQUESTED='match (n:Client),(m:Ride) where id(m)=$RID and id(n)=$CID create (n)-[r:RIDE_REQUESTED {DateTime:datetime()}]->(m) return r';
const FINISH_RIDE='match (d:Driver)-[r1]->(r:Ride)<-[r2]-(c:Client) where id(c)=$CID and id(d)=$DID and id(r)=$RID set d.isActive=false,c.isActive=false,d.currentLat=$DLat,d.currentLng=$DLng,d.currentLocation=$DLoc,c.currentLat=$DLat,c.currentLng=$DLng,c.currentLocation=$DLoc,c.destinationLat=0.0,c.destinationLng=0.0,c.destinationLocation="",r.endTime=$ETime,r.isCanceled=$Canc,r.isActive=false return r';
const CANCEL_RIDE='match (d:Driver)-[r1]->(r:Ride)<-[r2]-(c:Client) where id(c)=$CID and id(r)=$RID set d.isActive=false,c.isActive=false,c.destinationLat=0.0,c.destinationLng=0.0,c.destinationLocation="",r.endTime=$ETime,r.isCanceled=$Canc,r.isActive=false return r';
const DRIVER_ALL_RIDES='match (d:Driver)-[r1]->(r:Ride) where id(d)=$DID return r';
const CLIENT_ALL_DEST_LOC='match (c)-[r1]->(r:Ride) where id(c)=$CID return r';
const ALL_DRIVERS_WITH_RIDES='match (n:Driver)-[r1]->(r:Ride) return distinct n';
const CHECK_USER='match (n) where n.username=$user and n.type=$type return n';
const TOP_LOCATIONS='match (c:Client)-[r1]->(r:Ride) where id(c)=$CID return distinct count(r),r,r.destinationLocation order by count(r) desc';
const DELETE_RIDE='match (r:Ride) where id(r)=$RID detach delete r';
const UPDATE_CLIENT_TRUE='match (c:Client) where id(c)=$CID set c.isActive=true,c.currentLat=$Lat,c.currentLng=$Lng,c.currentLocation=$Loc,c.destinationLat=$DLat,c.destinationLng=$DLng,c.destinationLocation=$DLoc return c';
const UPDATE_DRIVER_TRUE='match (d:Driver) where id(d)=$DID set d.isActive=true';//d.pickupLat=$SLat,d.pickupLng=$SLng,d.pickupLocation=$SLoc';
const CANCEL_RIDE_NOT_CREATED='match (c:Client) where id(c)=$CID set c.isActive=false,c.destinationLat=0.0,c.destinationLng=0.0,c.destinationLocation="" return c';
const DRIVER_UPDATE_ARRIVAL='match (d:Driver) where id(d)=$DID set d.currentLocation=$Loc,d.currentLat=$Lat,d.currentLng=$Lng return d';
const DRIVER_BT_RIDE='match (d:Driver)-[r1]->(r:Ride)<-[r2]-(c:Client) where id(r)=$RID and id(c)=$CID return d';

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
    CHECK_USER: CHECK_USER ,
    TOP_LOCATIONS: TOP_LOCATIONS,
    RIDE_DISPACHED: RIDE_DISPACHED,
    RIDE_DRIVEN: RIDE_DRIVEN,
    RIDE_REQUESTED: RIDE_REQUESTED,
    REPO_PATH: REPO_PATH,
    DELETE_RIDE: DELETE_RIDE,
    UPDATE_CLIENT_TRUE: UPDATE_CLIENT_TRUE,
    UPDATE_DRIVER_TRUE: UPDATE_DRIVER_TRUE,
    CANCEL_RIDE_NOT_CREATED: CANCEL_RIDE_NOT_CREATED,
    GET_USER_BY_ID_WAR: GET_USER_BY_ID_WAR,
    DRIVER_UPDATE_ARRIVAL: DRIVER_UPDATE_ARRIVAL,
    USER_AUTH_WAR: USER_AUTH_WAR,
    DRIVER_BT_RIDE: DRIVER_BT_RIDE
}
