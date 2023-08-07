'use strict';

const express = require('express');
const morgan = require('morgan');
const dao = require('./air-dao');
const {check, validationResult} = require('express-validator');
const cors = require('cors');
const userDao = require('./user-dao');

// Passport-related imports
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');

// init express
const app = new express();
const port = 3001;


// set up middlewares
app.use(express.json());
app.use(morgan('dev'));
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true
}
app.use(cors(corsOptions));

//configuration Express with passport

// Passport: set up local strategy                          //funzione di callback chiamata una volta che l'autenticazione è stata completata
passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = await userDao.getUser(username, password); //username is the email
  if(!user) //check if user exist
    return cb(null, false, 'Incorrect username or password.');
    
  return cb(null, user); //if correct call the callback
}));

passport.serializeUser(function (user, cb) { //viene chiamata quando l'utente viene autenticato con successo e Passport deve memorizzare l'utente nella sessione. 
  cb(null, user);
});

// viene chiamata quando viene ricevuta una richiesta HTTP e Passport deve deserializzare l'oggetto utente dalla sessione
passport.deserializeUser(function (user, cb) { // this user is id + email
  return cb(null, user); 
});

const isLoggedIn = (req, res, next) => { // use it to check if a user is logged and so if can perform operations
  if(req.isAuthenticated()) {
    return next(); //pass the request to the next middleware
  }
  return res.status(401).json({error: 'Not authorized'});
}

app.use(session({
  secret: "shhhhh... it's a secret!", // to cifrate cookies
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.authenticate('session')); //handle user auentication with sessions

// GET /api/airplanes
app.get('/api/airplanes', (req, res) => {
  dao.listAirplanes()
  .then(airplanes => res.json(airplanes))
  .catch(() => res.status(500).end());
});

// GET /api/airplanes/:id
app.get('/api/airplanes/:id', (req, res) => {
  
  dao.listSeatsAirplane(req.params.id)
  .then(seats => res.json(seats))
  .catch(() => res.status(500).end());
})

//GET /api/seats/:id
app.get('/api/seats/:id', isLoggedIn, async(req, res)=>{
  try{
    const seats= await dao.listSeatsUser(req.params.id);
    res.json(seats);
  }
  catch{res.status(500).end();}
})

// POST /api/sessions
app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err); //if error during auentication
      
      if (!user)  //not success autentication      
        return res.status(401).send(info);
      
      // success, perform the login
      req.login(user, (err) => {
        if (err)
          return next(err);
        
        // req.user contains the authenticated user, we send all the user info back
        return res.status(201).json(req.user);
      });
  })(req, res, next);
});

// GET /api/sessions/current
app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.json(req.user);}
  else
    res.status(401).json({error: 'Not authenticated'});
});

// DELETE /api/session/current
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});

//PUT /api/makeReservations
app.post('/api/makeReservations', isLoggedIn, [check('selectedSeats').isArray({min:1})], async (req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty())        
    return res.status(422).json('You have to select at least one seat');
  
  const airplaneId = req.body.airplaneId;
  const seatsIDs = req.body.selectedSeats;
  const userId = req.body.userId;  

  try {
    
    const occupied=[];
    const bookedSeat=[];

    for (let i of seatsIDs){   
       const check = await dao.checkSeatFree(i); //return 0 or 1
        if(check)
          occupied.push(i); 
    }
    
    if(occupied.length>0)
      res.status(200).json( { occupied: occupied } );
    else{

      for (const s of seatsIDs){
        const seat = await dao.bookSeat(s , userId); // Aggiorna i dati dei posti selezionati
        bookedSeat.push(seat);
      }
      
      const num = await dao.updateAirplaneOccupied(airplaneId, seatsIDs.length);
  
      if(num === 1)
        res.status(200).json({ booked: bookedSeat});
    }
    
  }catch(error){
    console.error(error);
    res.status(500).json({ error: 'Failed to book seats', message: error.message });
  }

})

//DELETE /api/cancelAllReservations
app.delete(`/api/cancelAllReservations`,isLoggedIn, [check('airplaneId').isString()], async(req,res)=>{

  const errors = validationResult(req);
  
  if (!errors.isEmpty()) 
      return res.status(422).json('Fail to cancel the reservation');
            
  const userId = req.body.userId;
  const airplaneId = req.body.airplaneId

     try{
      
        const changes = await dao.deleteSeat(userId, airplaneId); //number of modified rows 
        const num = await dao.updateAirplaneReleased(airplaneId, changes); //the modified row is only one, the one associated to the airplane
       
        if(num === 1 && changes>0)
          res.status(200).json(changes);
        else
          throw new Error('Fail to update airplane and seats status');   

     }
     catch(error){
      res.status(500).json({ error: 'Failed to released the seats', message: error.message });}  
})

// activate the server
app.listen(port, () => 'API server started');