const REPO_PATH = __dirname.substring(0, __dirname.indexOf('\\constants')) + '\\repo\\';

const GET_ALL_USERS_TYPE = 'match (n) where n.type=$Type return n';
const USER_AUTH = 'match (n) where n.username=$user and n.password=$pass return n';
const GET_USER_BY_ID = 'MATCH (n) WHERE id(n)=$ID RETURN n';
const CREATE_DRIVER='CREATE(a:Driver {firstName:$Ime,lastName:$Prez,username:$User,password:$Pass,type:"driver",isActive:"true",phone:$Tel,car:$Car,carColor:$Color,licencePlate:$Plate,currentLat:$cLat,currentLng:$cLng,currentLocation:$cLoc,pickupLat:null,pickupLng:null,pickupLocation:""}) return a';
const CREATE_CLIENT='CREATE(a:Client {firstName:$Ime,lastName:$Prez,username:$User,password:$Pass,type:"client",pickupLat:$Lat,pickupLng:$Lng,pickupLocation:$Loc}) return a';
const CREATE_RIDE='CREATE (r:Ride {pickupLat:$SLat,pickupLng:$SLng,destinationLat:$DLat,destinationLng:$DLng,pickupLocation:$SLoc,destinationLocation:$DLoc,startTime:$STime,endTime:"X",isCanceled:false,fare:$Fare,distance:$Dist}) return r';
const RIDE_DISPACHED='match (n:Operator),(m:Ride) where id(m)=$RID and id(n)=$OID create (n)-[r:RIDE_DISPACHED {DateTime:datetime()}]->(m) return r';
const RIDE_DRIVEN='match (n:Driver),(m:Ride) where id(m)=$RID and id(n)=$DID create (n)-[r:RIDE_DRIVEN {DateTime:datetime()}]->(m) return r';
const RIDE_REQUESTED='match (n:Client),(m:Ride) where id(m)=$RID and id(n)=$CID create (n)-[r:RIDE_REQUESTED {DateTime:datetime()}]->(m) return r';
const FINISH_RIDE='match (d:Driver)-[r1]->(r:Ride)<-[r2]-(c:Client) where id(c)=$CID and id(d)=$DID and id(r)=$RID set d.currentLat=$DLat,d.currentLng=$DLng,d.currentLocation=$DLoc,c.pickupLat=$DLat,c.pickupLng=$DLng,c.pickupLocation=$DLoc,r.endTime=$ETime,r.isCanceled=$Canc return r';
const CANCEL_RIDE='match (d:Driver)-[r1]->(r:Ride)<-[r2]-(c:Client) where id(c)=$CID and id(d)=$DID and id(r)=$RID set r.endTime=$ETime,r.isCanceled=$Canc return r';
const DRIVER_ALL_RIDES='match (d:Driver)-[r1]->(r:Ride) where id(d)=$DID return r';
const CLIENT_ALL_DEST_LOC='match (c:Client)-[r1]->(r:Ride) where id(c)=$CID return distinct r.destinationLocation';
const ALL_DRIVERS_WITH_RIDES='match (n:Driver)-[r1]->(r:Ride) return distinct n';
const CHECK_USER='match (n) where n.username=$user and n.type=$type return n';
const TOP_LOCATIONS='match (c:Client)-[r1]->(r:Ride) where id(c)=$CID return distinct count(r),r.destinationLocation order by count(r) desc';

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
    REPO_PATH: REPO_PATH
}
