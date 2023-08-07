import { useState } from 'react';
import {Form, Button, Alert} from 'react-bootstrap';

function LoginForm(props) {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');


  const handleSubmit = (e) => {
      e.preventDefault();
      const credentials = { username, password };
      
      props.login(credentials)
        .catch((err)=>{ setErrorMessage(err.error); setShow(true)});
  }

  return (
    <>
     <p>Enter your credentials to access your personal area:</p>
     <Form onSubmit={handleSubmit}>
        <Alert
            dismissible
            show={show}
            onClose={() => setShow(false)}
            variant="danger">
            {errorMessage}
        </Alert>
      
        <Form.Group controlId='username'>
          <Form.Label>Email</Form.Label>
          <Form.Control type='email' value={username} onChange={ev => setUsername(ev.target.value)} required={true} />
        </Form.Group>

        <Form.Group controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} required={true} minLength={1}/>
        </Form.Group>
        <div className="mt-3">
        <Button type="submit">Login</Button>
        </div>
      </Form>
    </>
  )
}

function LogoutButton(props) { 
  return(
     // log out and go back to home
    <a href="/" className="btn btn-outline-light" onClick={props.logout}>  
       Logout
    </a>
  )
}



export { LoginForm, LogoutButton};