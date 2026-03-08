import React, { useEffect, useState } from "react";
import form from "../utilities/Forms";
import { useParams } from "react-router-dom";
import { Alert } from "react-bootstrap";
import axios from "axios";

function UpdateUser() {
  const [user, setUser] = useState({});

  const [company, setCompany] = useState("");
  const [loginType, setLoginType] = useState("");
  const [fullname, setFullname] = useState("");
  const [phonenumber, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [validate, setValidate] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { id } = useParams();
  // const navigate = useNavigate();

  const validateupdate = () => {
    let isValid = true;

    let validator = form.validator({
      company: {
        value: company,
      },
      email: {
        value: email,
        isEmail: true,
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
  const updateuser = async (e) => {
    e.preventDefault();

    const isValid = validateupdate();

    if (isValid) {
      setIsLoading(true);
      setError(null);

      try {
        const updatedUserData = {
          company: user.company,
          logintype: user.loginas,
          fullname: user.fullname,
          email: user.email,
          phonenumber: user.phonenumber,
        };

        // Make the API Request
        const response = await axios.put(`/api/admin/${id}`, updatedUserData, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          // Update successful
          setSuccess(true);
          setValidate({});
        } else if (response.status === 409) {
          // Email already registered
          throw new Error("Email already registered");
        } else {
          // Other errors
          throw new Error("Update User failed");
        }
      } catch (error) {
        setError(error.message);
      }

      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetch(`/api/admin/${id}`, {
          method: "GET",
        });
        const result = await response.json();

        if (response.ok) {
          console.log("API Response:", result); // Log the API response for debugging

          setUser({
            id: id,
            update: true,
            fullname: result.fullname,
            email: result.email,
            phonenumber: result.phonenumber,
          });
        } else {
          console.error("Failed to fetch user data.");
        }
      } catch (error) {
        console.error("An error occurred while fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
    // eslint-disable-next-line
  }, [id]);

  return (
    <div className="container">
      <div className="row mt-4">
        <div className="col-sm-5 col-offset-3 mx-auto shadow p-5">
          <h4 className="text-center mb-4">Edit a User</h4>
          <h5 className="text-success">User Id:{user.id}</h5>
          <div className="form-group mb-3">
            <label htmlFor="company" style={{ color: "white" }}>
              Company
            </label>
            <select
              className="form-control form-control-lg"
              name="company"
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            >
              <option value="Softcell">Softcell</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group mb-3">
            <label htmlFor="loginas" style={{ color: "white" }}>
              Login as
            </label>
            <select
              className="form-control form-control-lg"
              name="loginas"
              id="loginas"
              value={loginType}
              onChange={(e) => setLoginType(e.target.value)}
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div className="form-group mb-3">
            <label htmlFor="Full name" style={{ color: "white" }}>
              FullName
            </label>
            <input
              type="text"
              className="form-control from-control-lg"
              placeholder="Enter FullName"
              name="Full Name"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="Email" style={{ color: "white" }}>
              Email
            </label>
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter Email"
              name="email"
              value={email}
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
          <div className="form-group mb-3">
            <label htmlFor="Phonenumber" style={{ color: "white" }}>
              Phonenumber
            </label>
            <input
              type="tel"
              className="form-control form-control-lg"
              placeholder="Enter PhoneNumber"
              name="email"
              pattern="[0-9]*"
              value={phonenumber}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <button className="btn btn-secondary btn-block" onClick={updateuser}>
            Update User
          </button>
          <Alert variant="danger">
            <div className="error">
              {isLoading && <div>Loading...</div>}
              {error && <div> {error}</div>}
              {success && <div>Successfully Registered User</div>}
            </div>
          </Alert>
        </div>
      </div>
    </div>
  );
}

export default UpdateUser;
