import API from '../API';
import { Link } from 'react-router-dom';
import {useEffect, useState } from 'react';

function ReservationsPage(props) {

    const [seats, setSeats] = useState([]);

    const getSeatsUser = async () => { //take the seat of the user
        const seats = await API.getSeatsUser(props.user.id);
        setSeats(seats);
    };
  
    useEffect(()=>{
         getSeatsUser();
    },[]);
            
    return(
      <>
      <h1>Welcome back, {props.user.name}!</h1> 
    
      {seats.length ? (
        <>          
          <p>Here are your reservations:</p>
          
           <div > 
           {seats.map(seat => (
             <div key={seat.id} > 
               <span className="details"> reservation: <strong>{seat.id}</strong>  for airplane: <strong>{seat.airplanes}</strong> </span>
             </div>))
           }
           </div>  
           
          <div className="space"></div>

          <Link to="/" className="btn btn-primary">Return Home</Link>  
        </>
       ) : (
         <>
          <p>You currently have no reservations.</p>  
          <Link to="/" className="btn btn-primary">Book a flight now</Link>   
         </> 
       )
      }

      </>
    ); 
}

export default ReservationsPage;