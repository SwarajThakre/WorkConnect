import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function UserList (){
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Fetch users from the database
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users/');
      const data = await response.json();

      // Update the users with the fetched data
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const searchUser = async () => {
    try {
      const response = await axios.get(`/api/admin/search/${search}`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };


  const deleteUser = async (userid) => {
    try {
      const response = await axios.delete(`/api/admin/${userid}`);
      console.log(response.data.message);

      // Refresh the user list after deletion
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };


  return (
    <div>
      <h2>User List</h2>
       <div class="col-sm-8">
          <h5 class="text-center  ml-4 mt-4  mb-5">View Records</h5>
        <div class="input-group mb-4 mt-3">
          <div class="form-outline">
           <input type="text" id="form1" onChange={(e)=>setSearch(e.target.value)} class="form-control" placeholder="Search User Here" style={{backgroundColor:"#ececec"}}/>
        </div>
          <button type="button" onClick={searchUser}  class="btn btn-success">
            <i class="fa fa-search" aria-hidden="true"></i>
          </button>
        </div>  
      <table className='table table-hover table-striped table-bordered ml-4'>
        <thead>
          <tr>
            <th>UserID</th>            
            <th>Company</th>
            <th>User Type</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Account Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.userid}>
              <td>{user.userid}</td>
              <td>{user.company}</td>
              <td>{user.logintype}</td>
              <td>{user.fullname}</td>
              <td>{user.email}</td>
              <td>{user.phonenumber}</td>
              <td>{user.accountstatus}</td>
              <td><Link className="text-danger mr-2"
              onClick={() => deleteUser(user.userid)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16" style={{fontSize:"18px",marginRight:"5px"}}>
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
         <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
          </svg></Link>
              <Link className='mr-2' to={`/updateuser/${user.userid}`} >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
             <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
            </svg>
              </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default UserList;
