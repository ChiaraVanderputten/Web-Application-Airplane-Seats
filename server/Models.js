'use strict';

function Airplane(id, type, seats, occupied) {
  this.id = id;
  this.type = type;
  this.seats = seats;
  this.occupied = occupied;

}

function Seat (id, booked, airplanes, user){
  this.id=id;
  this.booked=booked;
  this.airplanes=airplanes;
  this.user=user;
}


module.exports= {Airplane, Seat};
