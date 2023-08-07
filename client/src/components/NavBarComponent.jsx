import { Navbar, Form} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {LogoutButton} from './AuthComponents';
import 'bootstrap-icons/font/bootstrap-icons.css';



function NavHeader(props) {

  return (
    <Navbar bg="primary" expand="sm" variant="dark" fixed="top" className="navbar-padding">
      <Link to="/" className="mr-auto">
         <Navbar.Brand>
         <i className="bi bi-airplane-fill me-1"></i>
             BlueWings
         </Navbar.Brand>
      </Link>
      {props.loggedIn && (       
        <span className="navbar-text ml-auto text-white">
         <Link to={`/reservations/${props.user.id}`}> Welcome {props.user.name.split(' ')[0]}! </Link>   
        </span> )
      }  
      <Form className='ml-auto'>
      {props.loggedIn ?
        <LogoutButton logout={props.handleLogout}/> : 
        <Link to='/login'className='btn btn-outline-light'>Login</Link>
      }
      </Form>
      
    </Navbar>
  );
}
  
export default NavHeader;