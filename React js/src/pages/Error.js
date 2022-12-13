import React from 'react';
import { Link } from 'react-router-dom';

const Error = () => {
  return (
    <div>
      <h2>Error</h2>
      <h2>Opps</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
};

export default Error;
