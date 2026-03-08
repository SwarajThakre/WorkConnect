import { useState } from "react";
import form from '../utilities/Forms';
import { useNavigate } from "react-router-dom";
import { Alert, Button, Form, Stack} from 'react-bootstrap'

function Register() {
  const [company, setCompany] = useState('');
  const [loginType, setLoginType] = useState('');
  const [fullname, setFullname] = useState('');
  const [phonenumber, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setCreatePassword] = useState('');
  const [validate, setValidate] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  let navigate = useNavigate();

  const validateRegister = () => {
    let isValid = true;

    let validator = form.validator({
      company: {
        value: company,
      },
      phonenumber:{
        value: phonenumber,
        isRequired: true,
      },
      email: {
        value: email,
        isRequired: true,
        isEmail: true
      },
      password: {
        value: password,
        isRequired: true,
        minLength: 6
      }
    });

    if (validator !== null) {
      setValidate({
        validate: validator.errors
      });

      isValid = false;
    }
    return isValid;
  };


  const register = async (e) => {
    e.preventDefault();

    const isValid = validateRegister();

    if (isValid) {
      setIsLoading(true);
      setError(null);

      try {
        // Make the API Request
      const response = await fetch("/api/users/register", {
        method: "POST",
         headers: {
         "Content-Type": "application/json",
          },
        body: JSON.stringify({
        company: document.getElementById('company').value,
        logintype: document.getElementById('loginas').value,
        fullname,
        phonenumber,
        email,
        password,
       }),
        });

        if (response.ok) {
          // Registration successful
          setSuccess(true);
          setValidate({});
          setEmail("");
          setCreatePassword("");
          navigate('/admin');
        } else if (response.status === 409) {
          // Email already registered
          throw new Error("Email already registered");
        }
         else {
          // Other errors
          throw new Error("Registration failed");
        }
      } catch (error) {
        setError(error.message);
      }

      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="form">
        <Form className="form" method="POST" onSubmit={register} autoComplete={'off'}>
          <Stack gap={0}>
          <h2>User Registration</h2>
          <div className="company">
            <label htmlFor="company">Company</label>
            <select
              name="company"
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            >
              <option value="Softcell">Softcell</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="loginas">
            <label htmlFor="loginas">Login as</label>
            <select
              name="loginas"
              id="loginas"
              value={loginType}
              onChange={(e) => setLoginType(e.target.value)}
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div className="fullname">
              <label htmlFor="fullname">Fullname</label>
              <input
                type="text"
                id="fullname"
                value={fullname}
                placeholder="Full name"
                onChange={(e) => setFullname(e.target.value)}
              />
            </div>
            <div className="phone">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                value={phonenumber}
                placeholder="Phone number"
                onChange={(e) => setPhone(e.target.value)}
                pattern="[0-9]*"
              />
            </div>
          <div className="emailid">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className={`form-control ${validate.validate && validate.validate.email ? 'is-invalid ' : ''}`}
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className={`text ${(validate.validate && validate.validate.email) ? 'd-block' : 'd-none'}`}>
              {(validate.validate && validate.validate.email) ? validate.validate.email[0] : ''}
            </div>
          </div>
          <div className="password">
            <label htmlFor="password">Create New Password</label>
            <input
              type='password'
              className={`form-control ${validate.validate && validate.validate.createpassword ? 'is-invalid ' : ''}`}
              value={password}
              placeholder="CreatePassword"
              autoComplete="off" required
              onChange={(e) => setCreatePassword(e.target.value)}
            />
            <div className={`invalid-feedback text-start ${(validate.validate && validate.validate.createpassword) ? 'd-block' : 'd-none'}`}>
              {(validate.validate && validate.validate.createpassword) ? validate.validate.createpassword[0] : ''}
            </div>
          </div>
          <Button type="submit" variant="primary">Register</Button>
          <Alert variant="danger">
          <div className="error">
            {isLoading && <div>Loading...</div>}
            {error && <div> {error}</div>}
            {success && <div>Successfully Registered User</div>}
          </div>
          </Alert>
          </Stack>
        </Form>
      </div>
    </>
  );
}

export default Register;
