import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {useEffect, useState } from 'react';
import API from '../API'

 function AirplaneList(props) {

  const [airplanes, setAirplanes] = useState([]);

  useEffect(()=> {
    const getAirplanes = async () => {
      const airplanes = await API.getAirplanes();
      setAirplanes(airplanes);
    }
    getAirplanes();
  }, []);


  return (
      <>
      <Row>
        <Col className="welcome-container">
          <h1 className='welcome'>Welcome to BlueWings!</h1>
          <p className='lead'>We now have {airplanes.length} airplanes available.</p>
        </Col>
      </Row>
      <Row  className="airplanes-container">
        <dl>
          {
            airplanes.map((a) => <AirplaneRow airplane={a} key={a.id}/>)
          }
        </dl>
      </Row>

      {props.user && ( <p> Hello {props.user.name}. Here you can <Link to={`/reservations/${props.user.id}`}> visit your personal page. </Link> </p>)}
      </>
  );
}

function AirplaneRow(props) {
  return (
      <>
      <dt>Airplane {props.airplane.id}: <Link to={`/airplanes/${props.airplane.id}`} className="btn btn-primary">{props.airplane.id}</Link></dt>
      <dd>Total number of seat {props.airplane.seats} , number of available seats {props.airplane.seats-props.airplane.occupied}, number of occupied seats {props.airplane.occupied}. </dd>
      </>
  );
}


export {AirplaneList}