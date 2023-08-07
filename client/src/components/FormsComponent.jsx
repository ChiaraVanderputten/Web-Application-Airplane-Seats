import { Form, Button } from "react-bootstrap";
import {Link } from 'react-router-dom';

function FormSelected(props){

    const {  
        handleSubmitSelected, 
        selectedSeats,  
        seats,  
        disabled  
      } = props;


    return(
     
      <Form className='booking' onSubmit={handleSubmitSelected} disabled={disabled}>
        <Form.Group controlId="numSeats">
        <Form.Label>Seat selected:</Form.Label>  
        <div className="d-flex align-items-center">
          {<ul>  
          {selectedSeats.map(id => {
           const seat = seats.find(s => s.id === id);
           return ( <li key={id}> {seat.id} </li> )  })}
          </ul>}
        </div>
        </Form.Group>
        <Button disabled={disabled} type="submit" className='mx-4 mt-4'>Book Selected Seats</Button>
        <Link to="/" className="btn btn-danger ml-2 mt-4">Cancel</Link>
      </Form>
     
    );

}

function FormForRow(props){

    const {  
        handleSubmit,
        airplane,  
        disabled,  
        numSeats,
        setNumSeats  
      } = props;


    return(
     
      <Form className='booking' onSubmit={handleSubmit} >
           <Form.Group controlId="numSeats">
            <Form.Label>Select the number of seats to book:</Form.Label>  
            <div className="d-flex align-items-center">   
                <Form.Control disabled={disabled} required type="number" className="form-control form-control-sm-centered" 
                              min={1} max={airplane.seats - airplane.occupied} value={numSeats}
                              onChange={e => {
                                               const value = e.target.value
                                               if (!isNaN(value))    
                                                  setNumSeats(parseInt(value));

                                                 }} />   
            </div>
            </Form.Group>
           <Button disabled={disabled}  type="submit" className='mx-4 mt-4'>Book Seats</Button>
           <Link to="/" className="btn btn-danger ml-2 mt-4">Cancel</Link>
         </Form>
     
    )

}

export {FormSelected, FormForRow}