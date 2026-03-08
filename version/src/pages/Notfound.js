import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="not-found-container">
      <h1>404</h1>
      <p>Sorry,we could not find this Page😢.Go back to Login <Link to={"/"} className='text-decoration-none'>Back to Login</Link></p>
    </div>
  );
}

export default NotFound;
