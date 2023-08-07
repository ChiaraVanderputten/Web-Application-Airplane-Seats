import { Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API from '../API';
import Seat from './SeatComponent'
import { FormSelected, FormForRow } from './FormsComponent';


function SingleAirplane(props) {
  
  const params = useParams(); 
  const user = props.user;
  const dictionary = {'L1': ['A','B','C','D'], 'R1': ['A','B','C','D','E'],  'I1': ['A','B','C','D','E','F']}; // to get the number of seats per row in each airplane
  const airplane = props.airplanes.find(a => a.id === params.airplaneId);
  const [seatRows, setSeatRows] = useState([]); // array of array conteaning the seats ids for each row
  const [seats, setSeats] = useState([]); 
  const [numSeats, setNumSeats] = useState(0); //number of seats user want to book (first form)
  const [error, setError] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]); //seat selected by the user
  const [disabled, setDisabled] = useState(false); //to disable the form if the user is not loggedin
  const [unavailableSeats, setUnavailableSeats] = useState([]); //contains the seats that created conflict
  const [seatsUser, setSeatsUser]=useState([]);
  const [updatedAirplane, setUpdatedAirplane] = useState(airplane);


  const getSeats = async () => {
        const seats = await API.getSeats(params.airplaneId);
        setSeats(seats); 
       
        const res =[]; // divide the seats for rows
        const nr = dictionary[params.airplaneId].length;
        for (let i = 0; i < seats.length; i++) {
          
          if (i % nr === 0) 
            res.push([]);

          const seat = seats[i];  
          res[res.length - 1].push(seat);
        }
          
        setSeatRows(res);

        if(user)
          setSeatsUser(seats.filter(s => s.user === user.id)); 
        else
          setDisabled(true); //disable if user not autenticated      
  }
    
  useEffect(()=>{
         getSeats();    
    },[]);   
   
  useEffect(() => {  //disable after user have make one prenotation for the airplane
      if(seatsUser.length > 0) 
         setDisabled(true);
      else 
         setDisabled(false);    
      
    }, [seatsUser]);
    
    
  const updateAirplane = async () => { //updeat the seat of the airplane (for example for cancelReservation to get the update airplane and use it for the description at the beggining of the page)
      const airplanes = await API.getAirplanes(); //take the plane directly from the db where it's updated
      const selectedAirplane = airplanes.find(a => a.id === airplane.id); 
      setUpdatedAirplane(selectedAirplane);   
  };

    
  //handle the cancellation of the seats already booked by the user
  const cancelAllReservation = async(e)=>{
       
        e.preventDefault(); // remain in the same page
        
        try {
          
          if(seatsUser.length>0){
            await API.cancelAllReservations(user.id,  airplane.id);
            
            getSeats(); //richiamo per aggiornare la visualizzazione dei posti nella pagina (in questo modo dopo la cancellazione i posti tornano verdi)
            updateAirplane(); // update value of the description of the seats
            
          }else{
            setError(`You have no reservations to cancel for this airplane`);
            setTimeout(() => {setError(''); }, 7000);
          }

        } catch (error) {
            console.error(error);
          }
    }


  async function handleSubmit(e) {
      
      e.preventDefault();

      try{  
          
          // Select available seats in order from the database
          const seatsToBook = seats.filter(s=>s.booked===0).slice(0, numSeats).map(s=>s.id);
                
          const {occupied, booked} = await API.makeNewPrenotations(airplane.id, seatsToBook, user.id);
        
          if(occupied.length > 0 && booked.length===0){
           
              // Set state to highlight unavailable seats  
              setUnavailableSeats(occupied);            
                        // Clear unavailable seats after 5 seconds
              setTimeout(() => {setUnavailableSeats([]); }, 5000); 
              setError(`The following seats were unavailable: ${occupied.join(',')}`);
          }
               
          getSeats();
          updateAirplane();
          setSelectedSeats([]); 
          setNumSeats(0);
            
      }catch(error){
          console.log(error);
          setError('Failed to book seats, please select at least one seat');
        }
      }

  async function handleSubmitSelected(e) {
      e.preventDefault();
  
      try{       
           
          const {occupied, booked} = await API.makeNewPrenotations(airplane.id, selectedSeats, user.id);
           
          if(occupied.length > 0 && booked.length===0){
            
               // Set state to highlight unavailable seats  
               setUnavailableSeats(occupied);            
                         // Clear unavailable seats after 5 seconds
               setTimeout(() => {setUnavailableSeats([]); }, 5000); 

               setError(`The following seats were unavailable: ${occupied.join(',')}`);
          }
              
          getSeats();
          updateAirplane();
          setSelectedSeats([]);  
             
      }catch(error){
         console.error(error);
         setError('Failed to book seats, please select at least one seat');
       }
  }  

  return (
    <>
      
    {airplane ?  
      <>                                                      
        <AirplaneDescription selected={selectedSeats} numSeats={numSeats} updatedAirplane = {updatedAirplane}/>
        
        {seatRows && seatRows.map((row, i)=>( //2D VISUALIZATION
                      
                     <div className="row" key={i}> Row N° {i+1}
                        {row.map((s, y)=>(
                          <div className="col" key={y}>                      
                     
                            <Seat seat={s} key={s.id} isUnavailable={unavailableSeats.includes(s.id)}
                                  isSelected={selectedSeats.includes(s.id)} disabled={disabled}  
                                  onSelect ={()=>{
                                        if (selectedSeats.includes(s.id)) // if already selected -> release it
                                          setSelectedSeats(selectedSeats.filter(seat => seat !== s.id)); 
                                        else  //otehrwise add tot the list
                                          setSelectedSeats([...selectedSeats, s.id]);   
                            }}/>
                          </div>
                          ))}
                      </div>))}
        
        {props.loggedIn && <FormForRow  disabled={disabled} airplane={airplane} setNumSeats={setNumSeats} handleSubmit={handleSubmit} numSeats={numSeats}></FormForRow>}        
        {props.loggedIn && <FormSelected disabled={disabled} handleSubmitSelected={handleSubmitSelected} seats={seats} selectedSeats ={selectedSeats} ></FormSelected>}
        {props.loggedIn && 
         <>
            <p> Click the button to delete all yours reservations related to this flight: </p>
            <form onSubmit={cancelAllReservation}>
                <button type="submit" className="btn btn-danger">Cancel Reservations </button>  
            </form>
         </> 
        } 
            
        {error && <p className="text-danger"><strong>{error}</strong></p>}
        
      </> : <p className='lead'>The selected airplane does not exist!</p>     
    } 

    </>
  );
}
  
  
function AirplaneDescription(props) {
    
    const {
      selected,
      numSeats, 
      updatedAirplane
    } = props;

    return (
      <>
      {updatedAirplane && (<>

       <Row><h1><strong>Airplane {updatedAirplane.id}: </strong></h1></Row>
       <Row className="row-seats"> number of seats: {updatedAirplane.seats}, number of available seats: {updatedAirplane.seats - updatedAirplane.occupied}, number of occupied seats : {updatedAirplane.occupied}, number of requested seats: {selected.length + numSeats }</Row>
        
       </>)}

       <span className="badge badge-occ">Occupied</span>
       <span className="badge badge-avail">Available</span>
       <span className="badge badge-req">Requested</span>
      </>
    );
}

export default SingleAirplane