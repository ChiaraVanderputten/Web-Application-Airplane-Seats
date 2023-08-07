import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Alert } from 'react-bootstrap';
import { BrowserRouter, Routes, Route, Outlet, Navigate} from 'react-router-dom';
import {AirplaneList} from './components/AirplaneListComponent';
import SingleAirplane from './components/SingleAirplaneComponent';
import API from './API';
import './App.css';
import {useEffect, useState } from 'react';
import NavHeader from './components/NavBarComponent';
import NotFound from './components/NotFoundComponent';
import { LoginForm } from './components/AuthComponents';
import ReservationsPage from './components/PersonalPage';

function App() {
  
  const [airplanes, setAirplanes] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  
  useEffect(()=> {
    const getAirplanes = async () => {
      const airplanes = await API.getAirplanes();
      setAirplanes(airplanes);
    }
    getAirplanes();
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
        
        const user = await API.getUserInfo(); // we have the user info here
        setUser(user);
        setLoggedIn(user !== null);    
    };
    checkAuth();
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setUser(user);
      setLoggedIn(true);
      setMessage({msg: `Welcome, ${user.name}!`, type: 'success'});
    }catch(err) {
      setMessage({msg: err, type: 'danger'});
    }
  };

  const handleLogout = async () => {
    
    await API.logOut();
    setLoggedIn(false);
    setUser(null);
    setMessage('');
  
  };

  return (
      <>
      <BrowserRouter>
          <Routes>
            <Route element={
              <>
               <NavHeader loggedIn={loggedIn} user={user} handleLogout={handleLogout}></NavHeader>
               <Container fluid className="mt-3">
               {message && 
                <Row><Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
                </Row> 
               }
               <Outlet/>
               </Container>
              </>
            }>
              <Route index element={ <AirplaneList user={user}/>}/>
              <Route path='airplanes/:airplaneId'  element={
                <div className="page-airplane-container">
                <SingleAirplane airplanes={airplanes} loggedIn={loggedIn} user={user}></SingleAirplane>
                </div>} />
            
              <Route path='*' element={ <NotFound/> } />      
              <Route path='/login' element={!loggedIn ? <LoginForm login={handleLogin} /> : <Navigate to='/' />} />
              <Route path='reservations/:userId' element={ loggedIn?  <ReservationsPage user={user} /> : <Navigate to="/"/>}/>
            </Route>
          </Routes>
      </BrowserRouter>
      </>
  );
}

export default App;
