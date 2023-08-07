'use strict';

function Airplane(id, type, seats, occupied) {
  this.id = id;
  this.type = type;
  this.seats = seats;
  this.occupied = occupied;

  /* Method to enable the proper serialization to string of the dayjs object. 
  Needed for the useLocation hook of react router when passing the answer to the edit form (AnswerComponent and AnswerForm). */
  this.serialize = () => {
    return {id: this.id, type: this.type, seats: this.seats, occupied: this.occupied};
  }
}

function Seat (id, booked, airplanes, user){
   this.id=id;
   this.booked=booked;
   this.airplanes=airplanes;
   this.user=user;

   this.serialize = () => {
    return {id: this.id, booked: this.booked, airplanes:this.airplanes, user:this.user};
  }

}

export { Airplane, Seat};
