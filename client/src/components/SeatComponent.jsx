export default function Seat(props) {
   
    const {  
      seat,
      isSelected,   
      onSelect,
      disabled,     
      isUnavailable  
    } = props;

    return (        
      <>
      <label className={ `${seat.booked ? 'booked' : 'available'}  ${isSelected ? 'selected' : ''} ${isUnavailable ? 'unavailable':''} justify-content-center`}>
      <input className="spaced" type="checkbox" disabled={seat.booked || disabled} checked={isSelected} onChange={onSelect}/>
          Seat {seat.id.slice(-1)}
      </label>
      </>
    );
  }
  
 