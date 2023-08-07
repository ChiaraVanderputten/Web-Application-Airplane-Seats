import { Airplane, Seat } from "./Models";

const SERVER_URL = 'http://localhost:3001';


const getAirplanes = async () => { //return all airplanes
    const response = await fetch(SERVER_URL + '/api/airplanes');
    
    if(response.ok) {
      const airplanesJson = await response.json();
      return airplanesJson.map(a => new Airplane(a.id, a.type, a.seats, a.occupied));
    }
    else
      throw new Error('Internal server error');
}


const getSeats = async(airplaneId)=>{ //return all the seat for a specific airplane
  const response = await fetch(SERVER_URL + `/api/airplanes/${airplaneId}`);
 
  if(response.ok) { 
    const seatsJson = await response.json();
    return seatsJson.map(s => new Seat(s.id, s.booked, s.airplanes, s.user));
  }
  else
    throw new Error('Internal server error');
}  


const getSeatsUser = async(userId)=>{ //return all the seats of a specific user
  const response = await fetch(SERVER_URL + `/api/seats/${userId}`, {credentials: 'include'});

  if(response.ok){
    const seatsJson = await response.json();
    return seatsJson.map(s =>new Seat(s.id, s.booked, s.airplanes, s.user));
  }else 
    throw new Error('Internal server error');
}


const logIn = async (credentials) => { 
    const response = await fetch(SERVER_URL + '/api/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });

    if(response.ok) {
      const user = await response.json();
      return user;
    }
    else {
      const errDetails = await response.text();
      throw errDetails;
    }
};


const getUserInfo = async () => {
    const response = await fetch(SERVER_URL + '/api/sessions/current', {
      credentials: 'include',
    });
    
    if (response.ok) {
      const user = await response.json();
      return user;
    } else 
      return null;  
}; 
  

const logOut = async() => {
    const response = await fetch(SERVER_URL + '/api/sessions/current', {
      method: 'DELETE',
      credentials: 'include'
    });

    if (response.ok)
      return null;
}

//given the seat to book, check if there are some conflict (return the occupied list not empty)
//if there are no conflict book the seat and change the status of the airplane (return the booked list not empty)
const makeNewPrenotations = async(airplaneId, selectedSeats, userId)=>{
  try{

    const response = await fetch(SERVER_URL + `/api/makeReservations`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ selectedSeats : selectedSeats, airplaneId : airplaneId, userId : userId  }),
      credentials: 'include'
    });
   
    if (response.ok) {

      const data = await response.json();
      const occupied = data.occupied || [];
      const booked = data.booked || [];

      return { occupied, booked }; 

    }else 
      throw new Error(await response.json());
            

  }catch(error){ 
    throw new Error(error.message, { cause: error });
  }

}

//given the seat of the user related to the specific airplan and the airplane 
//reset the seat to available and update the occupied seat of an airplane
const cancelAllReservations = async( userId, airplaneId)=>{

  try { 
    const response = await fetch(SERVER_URL + `/api/cancelAllReservations`, {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ userId: userId, airplaneId: airplaneId  }),
    credentials: 'include'                        
    });
    
    if (response.ok){
      const changes = await response.json();
      return changes;
    }else
      throw new Error(await response.json());;

  }catch(err){
    throw new Error(err.message, { cause: err });
  }    
}



const API = {getAirplanes, getSeats, getUserInfo, logOut, logIn, getSeatsUser, cancelAllReservations, makeNewPrenotations };
export default API;  