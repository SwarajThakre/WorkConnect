import React, { useContext, useState } from "react";
import form from "../utilities/Forms";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Button, Form, Alert, Stack } from "react-bootstrap";

function Login() {
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validate, setValidate] = useState({});
  const [isAlertVisible, setIsAlertVisible] = useState(false); // Manage alert visibility
  const { authenticate, isLoading, error } = useContext(AuthContext);

  const validateLogin = () => {
    let isValid = true;

    let validator = form.validator({
      company: {
        value: company,
      },
      email: {
        value: email,
        isRequired: true,
        isEmail: true,
      },
      password: {
        value: password,
        isRequired: true,
        minLength: 6,
      },
    });

    if (validator !== null) {
      setValidate({
        validate: validator.errors,
      });

      isValid = false;
    }
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsAlertVisible(true);
    const isValid = validateLogin();
    if (isValid) {
      authenticate(email, password);
    }
  };

  return (
    <>
      <div className="form">
        <Form
          className="form"
          method="POST"
          onSubmit={handleSubmit}
          autoComplete={"off"}
        >
          <Stack gap={0}>
            <h2>Login</h2>
            <div className="company">
              <label htmlFor="company">Company</label>
              <select
                name="company"
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              >
                <option value="softcell">Softcell</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="emailid">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className={`form-control ${
                  validate.validate && validate.validate.email
                    ? "is-invalid "
                    : ""
                }`}
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />

              <div
                className={`text ${
                  validate.validate && validate.validate.email
                    ? "d-block"
                    : "d-none"
                }`}
              >
                {validate.validate && validate.validate.email
                  ? validate.validate.email[0]
                  : ""}
              </div>
            </div>
            <div className="password">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className={`form-control ${
                  validate.validate && validate.validate.password
                    ? "is-invalid "
                    : ""
                }`}
                value={password}
                placeholder="Password"
                autoComplete="off"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <div
                className={`invalid-feedback text-start ${
                  validate.validate && validate.validate.password
                    ? "d-block"
                    : "d-none"
                }`}
              >
                {validate.validate && validate.validate.password
                  ? validate.validate.password[0]
                  : ""}
              </div>
            </div>
            <Link to="/forgotpass" className="link-dark text-decoration-none">
              Forgot Password?
            </Link>
            <Button type="submit" variant="primary">
              Login
            </Button>
            {/* Show the alert after pressing submit button if isLoading is true */}
            {isAlertVisible && isLoading && (
              <Alert variant="danger">
                <div>Loading...</div>
              </Alert>
            )}

            {/* Show error message if available */}
            {error && !isLoading && (
              <Alert variant="danger">
                <div>{error}</div>
              </Alert>
            )}
          </Stack>
        </Form>
      </div>
    </>
  );
}

export default Login;
