import React from 'react';
import { Link } from 'react-router-dom';

const Homepage: React.FC = () => (
  <>
    <h1>Dashboard</h1>
    <Link to="/faq">Welcome to the jungle</Link>
  </>
);

export default Homepage;
