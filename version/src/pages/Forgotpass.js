

import { useState } from 'react';
import { Link } from 'react-router-dom';
import Form from '../utilities/Forms';

function Forgotpass  () {
  const [email, setEmail] = useState('');
  const [validate, setValidate] = useState({});

  const validateforgotPassword = () => {
      let isValid = true;

      let validator = Form.validator({
          email: {
              value: email,
              isRequired: true,
              isEmail: true
          }
      });

      if (validator !== null) {
          setValidate({
              validate: validator.errors
          })

          isValid = false
      }
      return isValid;
  }

  const forgotPassword = (e) => {
      e.preventDefault();

      const validate = validateforgotPassword();

      if (validate) {
          alert('Reset password link is sent to '+email);
          setValidate({});
          setEmail('');
      }
  }
  

  return (
    <div>
      <div className="form-container">
              <form action="" method='POST' onSubmit={forgotPassword} autoComplete='off'>
              <h2>Change Password</h2>
                    <div className="company">
                      <label htmlFor="Company">Company</label>
                      <select name="Company" id="Company">
                        <option value="softcell">Softcell</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="emailid">
                       <label htmlFor="emailid">Email ID</label>
                       <input type="email" 
                       className={`form-control ${validate.validate && validate.validate.email ? 'is-invalid ' : ''}`}
                       name="emailid" 
                       value={email}
                       placeholder='Email'
                       id="emailid"required
                       onChange={(e) => setEmail(e.target.value)}
                       />
                       <div className={`invalid-feedback text-start ${(validate.validate && validate.validate.email) ? 'd-block' : 'd-none'}`} >
                            {(validate.validate && validate.validate.email) ? validate.validate.email[0] : ''}
                        </div>
                    </div>
                    <input type="submit" value="Change password"/>
              </form>
                <div> 
                    <div className='backtologin'>
                        <Link to="/">Back to Login</Link>
                    </div>
                </div>
        </div>
    </div>    
  );
};

export default Forgotpass
