'use strict';

const { db } = require('./db');
const {Airplane, Seat} = require('./Models');


exports.getSeatById =(id)=>{
  return new Promise((resolve, reject)=>{
  const sql ='SELECT * FROM seats WHERE id=?';
  db.get( sql, [id], (err, row) =>{
   
    if(err)  
      reject(err);
    else
      resolve(new Seat(row.id, row.booked, row.airplanes, row.user))
    
  });
  });
}


exports.listAirplanes = () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM airplanes';
      db.all(sql, [], (err, rows) => {
        
        if (err) 
          reject(err);
        
        const airplanes = rows.map((a) => new Airplane(a.id, a.type, a.seats, a.occupied));
        resolve(airplanes);
        
      });
    });
  }


exports.listSeatsAirplane = (airplaneId)=>{
  return new Promise((resolve, reject)=>{
    const sql ='SELECT * FROM seats WHERE airplanes = ?'
    db.all(sql, [airplaneId], (err,rows)=>{
      
      if (err)
        reject(err);
      
      const seats = rows.map((s)=>new Seat(s.id, s.booked, s.airplanes, s.user))
      resolve(seats);
      
    });
  });
} 


exports.listSeatsUser=(userId)=>{
  return new Promise((resolve, reject)=>{
    const sql ='SELECT * FROM seats WHERE user=?'
    db.all(sql, [userId], (err, rows)=>{
      
      if(err)
        reject(err);
      else{
        const seats = rows.map((s)=> new Seat(s.id, s.booked, s.airplanes, s.user))
        resolve(seats)
      }
      
    });
  });
}


exports.bookSeat =(s, userId)=>{

  return new Promise((resolve, reject)=>{
    const sql ='UPDATE seats SET booked= 1, user=? WHERE id=?';
    db.run(sql, [userId, s], function(err){
      
      if(err) 
        reject(err);
      else 
        resolve(exports.getSeatById(s));
    });
  });
}


exports.deleteSeat =(userId, airplaneId)=>{
  return new Promise((resolve, reject)=>{
    const sql = 'UPDATE seats SET booked=0, user=NULL WHERE user=? AND airplanes=?';
    db.run(sql, [ userId, airplaneId], function(err){
      
      if(err)
        reject(err);
      else 
        resolve(this.changes);
    });
  });
}


exports.updateAirplaneOccupied= (airplaneId, seatBooked)=>{
  return new Promise((resolve, reject)=>{
    const sql ='UPDATE airplanes SET occupied= occupied + ? WHERE id= ?';
    db.run(sql, [seatBooked, airplaneId], function(err){
      
      if(err) 
        reject(err);
      else 
        resolve(this.changes);
    });
  });
}


exports.updateAirplaneReleased =(airplane, seatToReleased)=>{
  return new Promise((resolve, reject)=>{
    const sql = 'UPDATE airplanes SET occupied=occupied-? WHERE id=?';
    db.run(sql, [seatToReleased, airplane], function(err){
      
      if(err)
        reject(err);
      else 
        resolve(this.changes);
    });
  });
}

exports.checkSeatFree =(seatId)=>{
  return new Promise((resolve, reject)=>{
    const sql='SELECT booked FROM seats WHERE id = ?';
    db.get(sql, [seatId], function(err, row){
    
      if(err)
        reject(err);
      else        
        resolve(row.booked);
      
    });
  });

}